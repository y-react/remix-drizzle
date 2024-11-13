import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { NavMenu } from '~/common/components';
import { envContext } from '~/common/services/cloudflare.server';
import { Footer, Header } from '~/components/page';
import { headConfig } from '~/config';

export const meta: MetaFunction = () => {
  return headConfig.meta;
};

export async function loader({ context }: LoaderFunctionArgs) {
  const environment = envContext(context).ENVIRONMENT;

  return environment;
}

export default function Index() {
  const environment = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen">
      <Header />
      <NavMenu className="mb-6 flex-row justify-between" />
      <section>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <header className="flex flex-col items-center">
              <p>{environment}</p>
            </header>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
