import { Module } from '@nestjs/common';
import { AuthenticationController } from './application/controllers/authentication.controller';
import { AuthenticationService } from './domain/services/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './domain/services/user.service';
import { UserEntity } from './infrastructure/entities/user.entity';
import { AuthenticationMiddleware } from './application/middleware/authentication.middleware';
import { SessionService } from './domain/services/session.service';
import { SessionEntity } from './infrastructure/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  providers: [
    AuthenticationService,
    AuthenticationMiddleware,
    UserService,
    SessionService,
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationMiddleware, AuthenticationService, UserService],
})
export class AuthenticationModule {}
