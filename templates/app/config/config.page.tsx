import { MetaDescriptor } from '@remix-run/react';

interface HeadConfig {
  meta: MetaDescriptor[];
}
interface FootConfig {
  title: string;
  from: string;
  to: () => number;
  scripts?: Array<{ props: React.HTMLProps<HTMLScriptElement> }>;
}

export const footConfig: FootConfig = {
  title: 'APP Copyright',
  from: '2010',
  to: () => new Date().getFullYear(),
};

export const headConfig: HeadConfig = {
  meta: [
    { title: 'APP Title' },
    {
      name: 'description',
      content: 'APP Description.',
    },
    {
      name: 'keywords',
      content: 'APP keywords',
    },
  ],
};
