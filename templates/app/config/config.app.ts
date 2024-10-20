import { serverOnly$ } from 'vite-env-only/macros';

const serverConfig = serverOnly$(() => {
  return {};
});

export const appConfig = {
  routes: {},
  ...(serverConfig ? serverConfig() : {}),
};
