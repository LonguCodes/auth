import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserService } from './domain/services/user.service';
import { UserController } from './application/controllers/user.controller';
import { UserRoleController } from './application/controllers/user-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController, UserRoleController],
  exports: [UserService],
})
export class UserModule {}
