import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

// JWT payload interface
export interface ITokenPayload {
  _id: string;
  email?: string;
  username: string;
  iat?: number;
  exp?: number;
}
// User type
export interface IUser {
  _id: string;
  email?: string;
  username: string;
  avatar?: string;
  online?: boolean;
}