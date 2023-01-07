import { TokenTypeEnum } from './token-type.enum';
import { DurationLike } from 'luxon';

export interface TokenPayloadInterface {
  sub: string;
  type: TokenTypeEnum;
  exp: DurationLike;
  [key: string]: any;
}
