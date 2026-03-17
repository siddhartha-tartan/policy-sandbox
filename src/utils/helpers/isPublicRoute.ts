const PUBLIC_PATHS = ["/login", "/signUp", "/forgotPassword", "/validate-login"];

export const isPublicRoute = (currentPath: string): boolean => {
  return PUBLIC_PATHS.some((path) => currentPath.startsWith(path));
};
