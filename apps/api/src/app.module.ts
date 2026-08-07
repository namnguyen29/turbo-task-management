import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { validateEnvironment } from './config/validate-environment';
import { TaskModule } from './features/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env'],
      validate: validateEnvironment,
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
