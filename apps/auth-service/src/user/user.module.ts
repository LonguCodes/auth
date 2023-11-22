import { Module } from '@nestjs/common';
import { UserService } from './domain/services/user.service';
import { UserController } from './application/controllers/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
