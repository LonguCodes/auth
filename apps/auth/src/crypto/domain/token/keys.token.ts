export const CryptoKeysToken = Symbol('crypto-keys-token');

export interface CryptoKeys {
  public: string;
  private: string;
}
