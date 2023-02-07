import { HttpModule } from '@nestjs/axios/dist';
import { Module } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}

