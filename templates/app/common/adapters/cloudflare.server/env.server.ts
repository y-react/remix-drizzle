import { AppLoadContext } from '@remix-run/cloudflare';

export function envContext(context: AppLoadContext) {
  return context.cloudflare.env;
}
