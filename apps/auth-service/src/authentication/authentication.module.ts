import { Module } from '@nestjs/common';
import { AuthenticationController } from './application/controllers/authentication.controller';
import { AuthenticationService } from './domain/services/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationMiddleware } from './application/middleware/authentication.middleware';
import { SessionService } from './domain/services/session.service';
import { SessionEntity } from './infrastructure/entities/session.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), UserModule],
  providers: [AuthenticationService, AuthenticationMiddleware, SessionService],
  controllers: [AuthenticationController],
  exports: [AuthenticationMiddleware, AuthenticationService],
})
export class AuthenticationModule {}
