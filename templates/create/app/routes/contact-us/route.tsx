import { useLoaderData } from '@remix-run/react';

import { NavMenu, SvgImage } from '~/common/components';
import { Footer, Header } from '~/components/page';
import { imgConfig } from '~/config';

export const loader = async () => {
  return {
    number: '+00 11 22 3344'.split('').reverse().join(''),
    email: {
      address: 'contact'.split('').reverse().join(''),
      domain: 'example.com'.split('').reverse().join(''),
    },
    social: {
      link: 'https://',
      name: 'LinkedIn: The Company',
    },
  };
};

export default function Index() {
  const contact = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
      <NavMenu className="mb-6 flex-row justify-between" />
      <section className="h-screen">
        <article>
          <div className="mt-20 flex flex-col items-center">
            <h2 className="text-lg uppercase md:text-2xl">Our contact details</h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-6">
            <div className="justify-self-center">
              <SvgImage
                href={imgConfig.contact.phone}
                className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200"
                viewBox="0 0 128 128"
              />
            </div>
            <div>
              <div className="data-u">
                <span data-u={contact.number}></span>
              </div>
            </div>
            <div className="justify-self-center">
              <SvgImage
                href={imgConfig.contact.email}
                className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200"
                viewBox="0 0 128 128"
              />
            </div>
            <div>
              <div className="data-d">
                <span data-d={contact.email.domain} data-u={contact.email.address}></span>
              </div>
            </div>
          </div>
        </article>
      </section>
      <Footer />
    </>
  );
}
