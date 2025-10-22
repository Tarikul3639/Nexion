export interface ITokenPayload {
  _id: string;
  username?: string;
  name?: string;
  email: string;
  iat?: number;
  exp?: number;
}