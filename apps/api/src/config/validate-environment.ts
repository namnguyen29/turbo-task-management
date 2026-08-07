export type NestNodeEnvironment = 'development' | 'test' | 'production';

const validNodeEnvironments: Readonly<NestNodeEnvironment[]> = ['development', 'test', 'production'];
const portPattern = /^\d+$/;

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
  const nodeEnvironment = (config.NEST_NODE_ENV as string) ?? 'development';
  if (typeof nodeEnvironment !== 'string' || !validNodeEnvironments.includes(nodeEnvironment as NestNodeEnvironment)) {
    throw new Error(
      `Invalid NEST_NODE_ENV: expected one of ${validNodeEnvironments.join(', ')}, received ${nodeEnvironment}`,
    );
  }

  const rawPort = (config.NEST_PORT as string) ?? '4300';

  if (typeof rawPort !== 'string' || !portPattern.test(rawPort)) {
    throw new Error(`Invalid NEST_PORT: expected an integer between 1 and 65535, received ${rawPort}`);
  }

  const port = Number(rawPort);
  if (port < 1 || port > 65535) {
    throw new Error(`Invalid NEST_PORT: expected an integer between 1 and 65535, received ${rawPort}`);
  }

  return {
    ...config,
    NEST_NODE_ENV: nodeEnvironment,
    NEST_PORT: port,
  };
}
