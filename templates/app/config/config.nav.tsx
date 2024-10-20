import { HomeIcon } from '@heroicons/react/24/solid';
import { Divider } from 'componentry/components';

import { ThemeSwitcher } from '~/common/components/ThemeSwitcher';
import { cypher } from '~/common/utils';

export const navConfig = {
  sections: [
    {
      items: [{ label: 'Home', url: '/', tag: <HomeIcon /> }],
    },
    {
      items: [{ tag: <Divider /> }, { label: 'Contact us', url: '/contact-us' }, { tag: <ThemeSwitcher key={cypher()} /> }],
    },
  ],
};
