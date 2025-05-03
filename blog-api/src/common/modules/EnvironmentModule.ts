import { ConfigModule } from '@nestjs/config';

const EnvironmentModule = ConfigModule.forRoot({
  isGlobal: true,
  expandVariables: true, // Env variables can use ${envVariableName} to expand.
  envFilePath: '.env',
});

export default EnvironmentModule;
