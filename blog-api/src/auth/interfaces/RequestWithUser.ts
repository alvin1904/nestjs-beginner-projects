import { Request } from 'express';

export interface UserDetailsInReq {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface RequestWithUser extends Request {
  user?: UserDetailsInReq;
}
