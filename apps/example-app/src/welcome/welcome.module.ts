import { Module } from '@nestjs/common';
import { WelcomeService } from './welcome.service';
import { AdminModule } from '@longucodes/nest-auth';
import { WelcomeController } from './welcome.controller';

@Module({
  controllers: [WelcomeController],
  providers: [WelcomeService],
  imports: [AdminModule],
})
export class WelcomeModule {}
