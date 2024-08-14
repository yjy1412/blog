import { BearerTokenTypeEnum } from '../enums/auth-jwt.enum';

export interface BearerTokenResponse {
  accessToken: string;
  refreshToken: string;
}
export interface BasicTokenPayload {
  email: string;
  password: string;
}
export interface BearerTokenPayload {
  id: number;
  email: string;
  type: BearerTokenTypeEnum;
}
