import { DynamicModule, Module } from '@nestjs/common';
import {
  SESSION_REPOSITORY,
  USER_REPOSITORY,
} from '@longucodes/auth-engine-core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure';
import { UserRepository } from './infrastructure/repository/user.repository';
import { SessionEntity } from './infrastructure/entity/session.entity';
import { SessionRepository } from './infrastructure/repository/session.repository';
import * as migrations from './infrastructure/migrations';
export interface TypeormEngineModuleOptions {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  driver: string;
}

@Module({})
export class TypeormEngineModule {
  public static forRoot(options: TypeormEngineModuleOptions): DynamicModule {
    return {
      module: TypeormEngineModule,
      global: true,
      imports: [
        TypeOrmModule.forRoot({
          entities: [UserEntity, SessionEntity],
          migrationsRun: true,
          migrations,
          ...options,
        }),
        TypeOrmModule.forFeature([UserEntity, SessionEntity]),
      ],
      providers: [
        { provide: USER_REPOSITORY, useClass: UserRepository },
        {
          provide: SESSION_REPOSITORY,
          useClass: SessionRepository,
        },
      ],
      exports: [USER_REPOSITORY, SESSION_REPOSITORY],
    };
  }
}
