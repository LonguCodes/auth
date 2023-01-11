export interface AuthModuleOptions {
  core: {
    /**
     * Url pointing to the auth service
     */
    host: string;

    /**
     * Api key used for privileged actions.
     */
    apiKey?: string;
  };
  /**
   * Should the module be registered as global
   */
  global?: boolean;

  /**
   * Should the authentication middleware be automatically registered for all routes
   */
  registerMiddleware?: boolean;
}
export const AuthOptionsToken = Symbol('auth-module-options');
