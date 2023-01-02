export interface AuthModuleOptions {
  core: {
    url: string;
  };
  global?: boolean;
  registerMiddleware?: boolean;
}
export const OptionsToken = Symbol('auth-module-options');
