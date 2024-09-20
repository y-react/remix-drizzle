import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [{ title: 'New App' }, { name: 'description', content: 'New App' }];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <header className="flex flex-col items-center"></header>
      </div>
    </div>
  );
}
