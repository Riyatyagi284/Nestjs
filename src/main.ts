import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from "config";
import { TransformationInterceptor } from './responseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
  app.useGlobalInterceptors(new TransformationInterceptor());
  
  //app.setGlobalPrefix(config.get('appPrefix'));
  
  await app.listen(config.get('port'), () => {
    return console.log(`server is running on port ${config.get('port')}`);
  });
}
bootstrap();
