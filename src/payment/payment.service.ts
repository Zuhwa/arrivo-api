import axios from 'axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSession } from 'src/user/entities/user-session.entity';
import { createHmac } from 'crypto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PostLabel } from 'src/post/entities/post.entity';
import { BillplzRedirectQueryDto } from './dto/billplz-redirect-query.dto';
import { BillplzCallbackBodyDto } from './dto/bilplz-callback-query.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private userService: UserService,
  ) {}

  async create(userId: string) {
    const user = await this.userService.findOne(userId);
    if (user.membership === PostLabel.PREMIUM) {
      throw new BadRequestException('user has premium subscription');
    }

    const { data } = await axios.post<{
      id: string;
      url: string;
      amount: number;
    }>(
      'https://www.billplz-sandbox.com/api/v3/bills',
      {
        collection_id: 'o7ubnpwy',
        description: 'Purchase Premium Subscription',
        email: user.email,
        name: user.fullName,
        amount: 5000,
        reference_1: user.id,
        redirect_url: 'http://localhost:3000/payment/redirect',
        callback_url: 'http://localhost:3000/payment/callback',
      },
      {
        headers: {
          Authorization:
            'Basic OTQ0NTk3ZDgtMDZkOC00ZDZhLTkwNzEtYTFlMmM5MWIzZjcx',
        },
      },
    );

    const payment = new Payment();
    payment.userId = user.id;
    payment.refId = data.id;
    payment.amount = data.amount;
    payment.status = PaymentStatus.PENDING;
    await this.paymentRepo.save(payment);

    return data.url;
  }

  getAppendString(data: object, initialKey: string = '') {
    const strings: string[] = [];

    for (const key of Object.keys(data)) {
      if (key === 'x_signature') continue;

      if (typeof data[key] === 'object') {
        strings.push(...this.getAppendString(data[key], key));
      } else {
        strings.push(`${initialKey}${key}${data[key]}`);
      }
    }

    return strings;
  }

  validateSignature(data: object, signature: string) {
    const joinedString = this.getAppendString(data)
      .sort((a, b) => a.localeCompare(b))
      .join('|');
    const signedSignature = createHmac('sha256', 'S-RunaKxMA43f42xKJrYOy0g')
      .update(joinedString)
      .digest('hex');

    if (signedSignature !== signature) {
      throw new BadRequestException('invalid signature');
    }
  }

  async handlePayment(paymentId: string, isPaid: boolean) {
    const payment = await this.paymentRepo.findOne({
      where: { refId: paymentId, status: PaymentStatus.PENDING },
      relations: ['user'],
    });
    if (!payment) throw new BadRequestException('Invalid payment');

    if (isPaid) {
      await this.paymentRepo.update(payment.id, {
        ...payment,
        status: PaymentStatus.PAID,
      });
      if (payment.user.membership !== PostLabel.PREMIUM) {
        await this.userService.update(payment.userId, {
          membership: PostLabel.PREMIUM,
        });
      }
    } else {
      await this.paymentRepo.update(payment.id, {
        ...payment,
        status: PaymentStatus.CANCELLED,
      });
    }
  }

  async redirect(data: BillplzRedirectQueryDto) {
    this.validateSignature(data, data.billplz.x_signature);
    await this.handlePayment(data.billplz.id, data.billplz.paid === 'true');
  }

  async callback(data: BillplzCallbackBodyDto) {
    this.validateSignature(data, data.x_signature);
    await this.handlePayment(data.id, data.paid === 'true');
  }
}
