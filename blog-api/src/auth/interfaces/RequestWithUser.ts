import { Request } from 'express';

export interface UserDetailsInReq {
  id: string;
}

export interface RequestWithUser extends Request {
  user?: UserDetailsInReq;
}
