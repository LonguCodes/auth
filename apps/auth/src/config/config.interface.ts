export interface ConfigInterface {
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    migrationsRun: boolean;
  };
  crypto: {
    publicKeyPath: string;
    privateKeyPath: string;
    generate: boolean;
    tokenLifetime: number;
    renewLifetime: number;
  };
  user: {
    validation: boolean;
  };
}
