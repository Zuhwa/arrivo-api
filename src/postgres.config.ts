import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from './category/entities/category.entity';
import { Payment } from './payment/entities/payment.entity';
import { User } from './user/entities/user.entity';
import { Post } from './post/entities/post.entity';

config();

const configService = new ConfigService();

const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: Number(configService.get('DB_PORT')),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  // entities: [__dirname + '/**/*.entity.{js,ts}'],
  entities: [User, Category, Post, Payment],
  migrations: ['dist/migrations/*{.ts,.js}'],
  connectTimeoutMS: 2000,
  retryAttempts: 0,
  //   logging: process.env.ENV === 'DEV',
  //   synchronize: process.env.DB_SYNC === 'true',
};

export default pgConfig;
