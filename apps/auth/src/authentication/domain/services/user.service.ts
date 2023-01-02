import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMissingError } from '../errors/user-missing.error';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public async getUserById(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  public async addUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    const newRoles = [...new Set(...user.roles, role.toLowerCase())];

    return this.userRepository.save({
      ...user,
      roles: newRoles,
    });
  }
  public async removeUserRole(userId: string, role: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UserMissingError('User does not exist');

    const newRoles = user.roles.filter(
      (userRole) => userRole !== role.toLowerCase()
    );

    return this.userRepository.save({
      ...user,
      roles: newRoles,
    });
  }
}
