import { DocumentBuilder } from '@nestjs/swagger';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Arrivo API')
  .setVersion('0.1')
  .addTag('user')
  .addTag('post')
  .addTag('category')
  .addTag('payment')
  .addBearerAuth({ type: 'http', bearerFormat: 'jwt' })
  .build();

export { swaggerConfig };
