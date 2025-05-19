import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      message: 'Api is alive',
      status: 'ok' as const,
      timestamp: new Date(),
    };
  }
}
