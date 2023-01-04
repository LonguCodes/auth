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
  events: {
    amqp?: {
      enable: boolean;
      url: string;
      exchange: string;
      assert?: boolean;
      prefix?: string;
    };
  };
}
