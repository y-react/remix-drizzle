import { NavMenu, SvgImage } from '~/common/components';
import { Footer, Header } from '~/components/page';
import { imgConfig } from '~/config';

export default function Index() {
  const contact = {
    number: '+00 11 22 3344'.split('').reverse().join(''),
    email: {
      address: 'contact'.split('').reverse().join(''),
      domain: 'example.com'.split('').reverse().join(''),
    },
    social: {
      link: 'https://',
      name: 'LinkedIn: The Strengths Institute',
    },
  };

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
                href={imgConfig.contqct.phone}
                className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200"
                viewBox="0 0 128 128"
              />
              {/* <svg className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M28 7.98c-11.023.0-20 8.978-20 20v44c0 11.023 8.977 20 20 20h44c11.023.0 20-8.977 20-20v-44c0-11.022-8.977-20-20-20H28zm0 4h44c8.861.0 16 7.139 16 16v44c0 8.862-7.139 16-16 16H28c-8.861.0-16-7.138-16-16v-44c0-8.861 7.139-16 16-16zm8.098 10.09c-4.091-.176-7.196 1.378-9.149 3.246a10.982 10.982.0 00-2.164 2.868c-.482.933-.789 1.702-.789 2.703.0-.089-.022.378-.035.922-.013.543-.011 1.275.039 2.16.1 1.769.4 4.162 1.195 7 1.591 5.675 5.174 13.119 12.946 20.89 7.771 7.772 15.215 11.354 20.89 12.946 2.838.795 5.231 1.095 7 1.195.885.05 1.613.052 2.157.039.543-.013 1.014-.035.925-.035 1.001.0 1.77-.307 2.703-.789a10.982 10.982.0 002.868-2.164c1.868-1.953 3.422-5.058 3.246-9.149-.084-1.951-1.167-3.678-2.766-4.703-1.235-.791-3.153-2.02-5.656-3.621a9.493 9.493.0 00-9.649-.328l.172-.086-2.355 1.012-.172.121a1.98 1.98.0 01-1.926.207 22.832 22.832.0 01-7.23-4.852 22.832 22.832.0 01-4.852-7.23 1.98 1.98.0 01.207-1.926l.121-.172 1.012-2.355-.086.172a9.486 9.486.0 00-.328-9.649c-1.601-2.503-2.83-4.421-3.621-5.656-1.025-1.599-2.752-2.682-4.703-2.766zm-.172 3.996c.561.025 1.14.353 1.508.926l3.621 5.656a5.527 5.527.0 01.187 5.571l-.047.086-.965 2.254.2-.364a6.019 6.019.0 00-.625 5.77 26.705 26.705.0 005.715 8.515 26.705 26.705.0 008.515 5.715c1.9.795 4.086.557 5.77-.625l-.364.2 2.254-.965.086-.047a5.532 5.532.0 015.571.191v-.004l5.656 3.621c.573.368.901.947.926 1.508.131 3.038-.924 4.939-2.141 6.211a7.069 7.069.0 01-1.813 1.379c-.544.281-1.064.34-.867.34-.367.0-.56.024-1.019.035-.46.011-1.076.012-1.836-.031-1.521-.086-3.62-.346-6.149-1.055-5.056-1.418-11.834-4.615-19.14-11.922-7.307-7.306-10.505-14.085-11.922-19.14-.709-2.528-.969-4.628-1.055-6.149a22.634 22.634.0 01-.031-1.836c.011-.459.035-.652.035-1.019.0.197.059-.323.34-.867a7.086 7.086.0 011.379-1.813c1.272-1.217 3.173-2.272 6.211-2.141z"
                  transform="translate(-2.667 -2.667) scale(1.33333)"
                />
              </svg> */}
            </div>
            <div>
              <div className="data-u">
                <span data-u={contact.number}></span>
              </div>
            </div>
            <div className="justify-self-center">
              <SvgImage
                href={imgConfig.contqct.email}
                className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200"
                viewBox="0 0 128 128"
              />
              {/* <svg className="h-12 w-12 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M40 524c-22-26-2-54 127-177 102-97 128-117 153-117s50 19 143 108l112 107 3-145c2-127 1-146-15-157-22-16-454-18-484-3-17 10-19 22-19 115 0 87-3 105-15 105s-15-19-15-108c0-156-19-147 290-147 230 0 249 1 269 19s21 29 21 206c0 131-4 190-12 198-9 9-85 12-279 12-229 0-268-2-279-16zm540-23c0-16-242-241-259-241-18 0-261 224-261 241 0 5 110 9 260 9 147 0 260-4 260-9z"
                  transform="matrix(.19762 0 0 -.19762 .783 127.724)"
                />
              </svg> */}
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
