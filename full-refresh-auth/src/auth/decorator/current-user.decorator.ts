/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/common/utils/session-tokens.util';

const getUserByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest()?.user as TokenPayload;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return getUserByContext(context);
  },
);
