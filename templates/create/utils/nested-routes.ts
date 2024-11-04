import fs from 'fs';
import path from 'path';

import { RouteManifest } from '@remix-run/dev/dist/config/routes';

type Route = [string, string];
type DirectoryEntry = fs.Dirent;
type DefineRouteFunction = (path: string, file: string) => void;
type DefineRoutesCallback = (route: DefineRouteFunction) => void;
type DefineRoutesFunction = (callback: DefineRoutesCallback) => RouteManifest;

interface GetRoutesFunction {
  (dir: string, baseDir?: string): Route[];
}
interface NestedRoutesFunction {
  (dirname: string): (defineRoutes: DefineRoutesFunction) => Promise<RouteManifest>;
}

export const nestedRoutes: NestedRoutesFunction = (dirname: string) => {
  return async (defineRoutes: DefineRoutesFunction): Promise<RouteManifest> => {
    const routesDir = path.resolve(dirname, 'app', 'routes');
    const routes: Route[] = getRoutes(routesDir, routesDir);

    return defineRoutes((route) => {
      for (const [routePath, filePath] of routes) {
        route(routePath, `routes/${filePath}`);
      }
    });
  };
};

const getRoutes: GetRoutesFunction = (dir, baseDir = '') => {
  const entries: DirectoryEntry[] = fs.readdirSync(dir, { withFileTypes: true });
  let routes: Route[] = [];

  for (const entry of entries) {
    const res: string = path.resolve(dir, entry.name);
    const relativePath: string = path.relative(baseDir, res);

    if (entry.isDirectory()) {
      routes = routes.concat(getRoutes(res, baseDir));
    } else if (entry.isFile() && entry.name === 'route.tsx') {
      const routePath: string = '/' + path.dirname(relativePath).replace(/\\/g, '/');
      routes.push([routePath, relativePath]);
    }
  }

  return routes;
};
