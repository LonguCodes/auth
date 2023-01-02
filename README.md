### Purpose 

The application is a solution for unified authentication methods across many applications.
It's based of asymmetric hashing of JWT tokens, with support for sessions and roles

### Usage

The service should be deployed alongside a backend service and can be directly exposed as auth api. To view all available endpoint, check `/api` endpoint for swagger documentation.
#### Docker

For easy usage, there is a docker image available under `longucodes/auth`.
It requires environment variables for configuration
```dotenv
DATABASE__HOST=HOST
DATABASE__USERNAME=USERNAME
DATABASE__PASSWORD=PASSWORD
DATABASE__DATABASE=DATABASE_NAME
```

Additional variables are also available, but optional. The default values are provided below
```dotenv
DATABASE__PORT=5432
DATABASE__MIGRATIONS_RUN=false

CRYPTO__PUBLIC_KEY_PATH='public.pem'
CRYPTO__PRIVATE_KEY_PATH='private.pem'
CRYPTO__GENERATE=true
CRYPTO__TOKEN_LIFETIME=600000
CRYPTO__RENEW_LIFETIME=15552000000
```

#### Private and public key
The application uses asymmetric hashing of tokens, so it required both a public and private key.
The keys can be provided using files, or they can be generated automatically.

If variable `CRYPTO__GENERATE` is set to true, any missing file will be generated. If only public key is present, it will be overwritten, as generating matching private key is impossible.

The keys should be provided in the `pem` format.

Public key can be fetched using `/api/auth/public` endpoint for verification of the token by the backend service.


#### Admin API

For communication between your backend service and the auth service, administrative token is needed. It will be generated during the first start of the application and logged.
If you want to use any of the administrative endpoints, send the token as a `Authorization: Bearer <TOKEN>` header.

#### Nestjs library

If your backend is based on NestJS, you can use a ready-to-go library, that integrates with the microservice for automatic token checking as well as extracting user information. It's still WIP, so expect changes.

It can be installed using `npm i @longucodes/auth` or `yarn add @longucodes/auth`. For more information, check [README](libs/auth-core/README.md) of the library

### Development

To run the service locally for development purposes, there are a couple steps you have to follow:

1. Install dependencies using `npm install` or `yarn`.
2. Copy the file `.env.example` to `.env` in the `apps/auth` directory
3. Bring up the development database by using `docker-compose up -d`
4. Run the app using `nx serve`

If everything went according to plan, you should have the app running on port 3333

### Contributing 

To make a code contribution, create a PR from your own repository to the master branch.
