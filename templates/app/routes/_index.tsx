import type { MetaFunction } from '@remix-run/cloudflare';

import { NavMenu } from '~/common/components';
import { Footer, Header } from '~/components/page';
import { headConfig } from '~/config';

export const meta: MetaFunction = () => {
  return headConfig.meta;
};

export default function Index() {
  return (
    <>
      <Header />
      <NavMenu className="mb-6 flex-row justify-between" />
      <section>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center">
            <header className="flex flex-col items-center">
              <p>{headConfig.meta[0].title}</p>
            </header>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
