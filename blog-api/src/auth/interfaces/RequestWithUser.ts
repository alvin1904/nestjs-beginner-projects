import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
  };
}
