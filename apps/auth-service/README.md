### Usage

The Auth Core should be deployed alongside a backend service and can be directly exposed as auth-service api. To view all available endpoint, check `/api` endpoint for swagger documentation.

#### Docker

For easy usage, there is a docker image available under `longucodes/auth-service`.
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

Public key can be fetched using `/api/auth-service/public` endpoint for verification of the token by the backend service.

#### Admin API

For communication between your backend service and the Auth Core, administrative token is needed. It will be generated during the first start of the application and logged.
If you want to use any of the administrative endpoints, send the token as a `Authorization: Bearer <TOKEN>` header.
