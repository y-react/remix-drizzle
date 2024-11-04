import { Link } from 'componentry/components';

import { SvgImage } from '~/common/components//SvgImage';
import { footConfig, headConfig, imgConfig } from '~/config';

// https://developer.mozilla.org/en-US/docs/Web/SVG/Applying_SVG_effects_to_HTML_content
export function Header() {
  return (
    <header className="print:hidden">
      <Link.Link href="/">
        <div className="flex flex-col md:py-8 md:pl-8">
          <div className="flew-row flex w-full justify-around md:justify-start md:gap-x-8">
            <SvgImage
              href={imgConfig.logo}
              className="h-16 text-slate-700 text-opacity-70 dark:text-slate-200 dark:text-opacity-30 md:h-28"
              viewBox="0 0 2434 740"
            />
            <div className="flex flex-col items-center pt-1 md:pt-3">
              <div className="flex flex-col items-end">
                <p className="font-maharlika break-normal text-3xl uppercase text-slate-700 dark:text-slate-400 md:text-7xl md:tracking-[.25em]">
                  {headConfig.meta[0].title}
                </p>
              </div>
            </div>
          </div>
        </div>
        <span className="sr-only">{headConfig.meta[0].title}</span>
      </Link.Link>
    </header>
  );
}

export function Script() {
  return <>{footConfig.scripts?.filter((script) => script)?.map((script, index) => script && <script key={index} {...script?.props} />)}</>;
}

export function Footer() {
  return (
    <footer className="sticky top-[100vh] flex w-full flex-col items-center bg-opacity-100 pb-8 pt-12 print:hidden">
      <p className="font-lato-100 text-xs uppercase text-opacity-30">
        Copyright © {footConfig.title} {footConfig.from} - {footConfig.to()}
      </p>
    </footer>
  );
}
