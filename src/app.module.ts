import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionFilter } from './httpExceptionFilter';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.get('mongoDbUrl')),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'App_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule { }
