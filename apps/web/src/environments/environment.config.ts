import { InjectionToken, ValueProvider } from '@angular/core';

export type Environment = Readonly<{
  apiUrl: string;
}>;

export const ENV_CONFIG = new InjectionToken<Environment>('env.config');

export const provideEnvironment = (value: Environment): ValueProvider => ({
  provide: ENV_CONFIG,
  useValue: value,
});
