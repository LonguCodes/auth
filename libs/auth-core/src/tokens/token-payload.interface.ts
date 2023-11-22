import { TokenType } from './token.type';
import { DurationLike } from 'luxon';

export interface TokenPayloadInterface {
  sub: string;
  type: TokenType;
  exp: DurationLike;
  [key: string]: any;
}
