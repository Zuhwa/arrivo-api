import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Arrivo API')
  .setVersion('0.1')
  .addServer('https://g5l4ib2lcd.execute-api.ap-southeast-1.amazonaws.com/dev')
  .addTag('user')
  .addTag('post')
  .addTag('category')
  .addTag('payment')
  .addBearerAuth({ type: 'http', bearerFormat: 'jwt' })
  .build();

export { swaggerConfig };
