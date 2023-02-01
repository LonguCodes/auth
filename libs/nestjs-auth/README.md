# Nestjs Auth

### Sections

- [AuthModule](#authmodule)
  - [Middleware](#middleware)
  - [Decorators](#decorators)
- [AuthEventsModule](#autheventsmodule)






### Purpose 

This is a companion library to the authentication microservice, designed to work with nest js applications.
It allows for easy interaction with the microservice core as well as listening for events.

### Usage

The application contains 2 modules - AuthModule and AuthEventsModule.

### AuthModule

This module is the core of the library, creating a connection to the core and listening for events.
To use if, just import the module and provide required values

```typescript
import {Module} from "@nestjs/common";
import {AuthModule} from "./auth.module";

@Module({
  imports: [
    AuthModule.forRoot({
      core: {
          host: 'serviceHost'
      }
    })
  ]
})
class MainModule {

}
```

You can also provide the options dynamically using dependency injection.
```typescript
import {Module} from "@nestjs/common";
import {AuthModule} from "@longucodes/nest-auth";
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    AuthModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        core:{
            host: configService.get('core.host')
        }
      }) 
    })
  ]
})
class MainModule {

}
```

#### Authentication

Some actions, like listening for events, require you to provide an **api key**. 
You can find it printed in the logs of the Auth Core during first boot.

```typescript
import {Module} from "@nestjs/common";
import {AuthModule} from "@longucodes/nest-auth";
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    AuthModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        core:{
            host: configService.get('core.host'),
            apiKey: configService.get('core.apiKey')
        }
      }) 
    })
  ]
})
class MainModule {

}
```

#### Middleware

The module exports an `AuthMiddleware` and `AuthGuard`. 

The middleware can be automatically applied to all routes by setting the `registerMiddleware` option of the module to `true`
```typescript
import {Module} from "@nestjs/common";
import {AuthModule} from "@longucodes/nest-auth";
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    AuthModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        core:{
            host: configService.get('core.host')
        },
        registerMiddleware: true
      }) 
    })
  ]
})
class MainModule {

}
```

The guard needs to be applied manually. We recommend adding it globally to secure your API.

```typescript
// main.js

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalGuards(await app.resolve(AuthGuard));
  
  await app.listen(3333);
}
```

#### Decorators

To get access to the user in your controllers, the `@User()` decorator is used.
Parameters of the controller methods decorated with this decorator will contain information about the user, like email and roles.

```typescript
 interface UserDto {
  id: string;
  email: string;
  roles: string[];
}
```

The data will only be available in routes, where the middleware is applied if automatic middleware register is not enabled.

By default, all routes require authentication. To allow access to routes without a token, use the `@Public()` decorator on the route or controller.
This will skip the check of authentication.

### AuthEventsModule

The module allows you to listen for events happening in the Auth Core.
To listen to an event, first import the module in your main module.

```typescript
import {Module} from "@nestjs/common";
import {AuthModule, AuthEventsModule} from "@longucodes/nest-auth";
import {ConfigService} from '@nestjs/config'

@Module({
  imports: [
    AuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        core: {
          host: configService.get('core.host')
        }
      })
    }),
    AuthEventsModule.forRoot({})
  ]
})
class MainModule {

}
```

After that, you can use standard event emitter notation to listen for events.

```typescript
import {Injectable, Logger} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {LoginEvent, RegisterEvent, ValidatedEvent, ChangeRoleEvent} from '@longucodes/auth-core';

@Injectable()
export class ExampleService {
  @OnEvent(`auth.${RegisterEvent.Name}`)
  private async OnRegister(payload: RegisterEvent.Payload) {
    Logger.verbose(`${payload.email} just registered!`);
  }

  @OnEvent(`auth.${LoginEvent.Name}`)
  private async OnLogin(payload: LoginEvent.Payload) {
    Logger.verbose(`${payload.email} just logged in!`);
  }

  @OnEvent(`auth.${ValidatedEvent.Name}`)
  private async OnValidate(payload: ValidatedEvent.Payload) {
    Logger.verbose(`${payload.email} was just validated!`);
  }

  @OnEvent(`auth.${ChangeRoleEvent.Name}`)
  private async OnChangeRoles(payload: ChangeRoleEvent.Payload) {
    Logger.verbose(`${payload.email}'s roles were changed to [${payload.currentRoles.join(',')}]!`);
  }
}
```
### AdminModule

This module is used for easy access to administrative actions, like role changes or special token generation.

Currently, it exposes following classes: 
- `AuthUserRepository` - role changes and validation/password change token generation
