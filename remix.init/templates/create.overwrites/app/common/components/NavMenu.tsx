import { Fragment } from 'react/jsx-runtime';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Dropdown, Navbar, Sidebar, StackedLayout } from 'componentry/components';

import { navConfig } from '~/config/config.nav';

type NavItem = {
  heading?: string;
  url: string;
  tag?: string;
  label?: string;
};

interface NavMenuProps {
  className?: string;
}

export function NavMenu({ className }: NavMenuProps) {
  return (
    navConfig.sections && (
      <StackedLayout
        navbar={
          <Navbar className={className}>
            {navConfig.sections.map((section, index) => {
              return (
                <Navbar.Section key={`navbar-section-${index}`} className="max-lg:hidden">
                  {section.items.map((item, index) => {
                    if ('items' in item && item.items)
                      return (
                        <Dropdown key={`dropdown-${index}`}>
                          <Dropdown.Button as={Navbar.Item} className="hidden lg:block">
                            {item.items && (item.items as NavItem[])[0]?.heading && <Navbar.Label>{(item.items as NavItem[])[0].heading}</Navbar.Label>}
                            <ChevronDownIcon />
                          </Dropdown.Button>
                          <Dropdown.Menu key={`dropdown-menu-${index}`} anchor="bottom start" className="min-w-80 lg:min-w-64">
                            {(item.items as NavItem[]).map((item, index) => {
                              return (
                                <Dropdown.Item key={`dropitem-${index}-${item.url}`} href={item.url}>
                                  {item?.tag && item.tag}
                                  {item.label && <Dropdown.Label>{item.label}</Dropdown.Label>}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      );

                    return (
                      <Navbar.Item key={`navbar-${index}-${item.url}`} href={item.url}>
                        {item.tag && item.tag}
                        {item.label && <Navbar.Label>{item.label}</Navbar.Label>}
                      </Navbar.Item>
                    );
                  })}
                </Navbar.Section>
              );
            })}
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <Sidebar.Body>
              {navConfig.sections.map((section, index) => {
                return (
                  <Sidebar.Section key={`sidebar-section-${index}`}>
                    {section.items.map((item, index) => {
                      if ('items' in item && item.items) {
                        return (
                          <Fragment key={index}>
                            <Sidebar.Divider key={`sidebar-divider-${index}`} />
                            <Sidebar.Section key={`sidebar-section2-${index}-${item.url}`}>
                              {(item.items as NavItem[]).map((item, index) => {
                                return (
                                  <Sidebar.Item key={`sidebar-${index}-${item.url}`} href={item.url}>
                                    {item?.tag && item.tag}
                                    {item.label && <Sidebar.Label>{item.label}</Sidebar.Label>}
                                  </Sidebar.Item>
                                );
                              })}
                            </Sidebar.Section>
                          </Fragment>
                        );
                      }

                      return (
                        <Sidebar.Item key={`sidebar-${index}-${item.url}`} href={item.url}>
                          {item.tag && item.tag}
                          {item.label && <Sidebar.Label>{item.label}</Sidebar.Label>}
                        </Sidebar.Item>
                      );
                    })}
                  </Sidebar.Section>
                );
              })}
            </Sidebar.Body>
          </Sidebar>
        }
      />
    )
  );
}
