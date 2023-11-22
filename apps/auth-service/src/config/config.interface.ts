export interface ConfigInterface {
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

  admin: {
    secretFilePath: string;
  };
}
