import { BearerTokenTypeEnum } from '../enums/auth-jwt.enum';

export interface DecodedBearerToken {
  id: number;
  email: string;
  type: BearerTokenTypeEnum;
}
