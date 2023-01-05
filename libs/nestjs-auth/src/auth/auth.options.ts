export interface AuthModuleOptions {
  core: {
    host: string;
  };
  global?: boolean;
  registerMiddleware?: boolean;
}
export const AuthOptionsToken = Symbol('auth-module-options');
