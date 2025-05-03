import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'ok' as const,
      timestamp: new Date(),
    };
  }
}
