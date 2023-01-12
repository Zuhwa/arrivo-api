import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { UserSession } from 'src/user/entities/user-session.entity';
import { User } from 'src/user/user.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment-response.dto';
import { BillplzRedirectQueryDto } from './dto/billplz-redirect-query.dto';
import { BillplzCallbackBodyDto } from './dto/bilplz-callback-query.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ type: CreatePaymentDto })
  async create(@User() { id }: UserSession) {
    return {
      paymentUrl: await this.paymentService.create(id),
    };
  }

  @Get('redirect')
  redirect(@Query() query: BillplzRedirectQueryDto) {
    return this.paymentService.redirect(query);
  }

  @Post('callback')
  callback(@Body() body: BillplzCallbackBodyDto) {
    return this.paymentService.callback(body);
  }
}
