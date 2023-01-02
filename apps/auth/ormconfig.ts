import * as dotenv from 'dotenv';
// eslint-disable-next-line import/no-unresolved
import { ConfigFactory } from '@longucodes/config';
import { configSchema } from './src/config/config.schema';
import { migrations } from './src/config/entities.config';
import { DataSource } from 'typeorm';

dotenv.config();
const config = new ConfigFactory(configSchema).config as any;

const databaseConfig = {
  type: 'postgres',
  ...config.database,
  migrations: migrations,
};

export default new DataSource(databaseConfig);
