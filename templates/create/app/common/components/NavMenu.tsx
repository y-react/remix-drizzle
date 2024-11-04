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
      <StackedLayout.StackedLayout
        navbar={
          <Navbar.Navbar className={className}>
            {navConfig.sections.map((section, index) => {
              return (
                <Navbar.NavbarSection key={`navbar-section-${index}`} className="max-lg:hidden">
                  {section.items.map((item, index) => {
                    if ('items' in item && item.items)
                      return (
                        <Dropdown.Dropdown key={`dropdown-${index}`}>
                          <Dropdown.DropdownButton as={Navbar.NavbarItem} className="hidden lg:block">
                            {item.items && (item.items as NavItem[])[0]?.heading && (
                              <Navbar.NavbarLabel>{(item.items as NavItem[])[0].heading}</Navbar.NavbarLabel>
                            )}
                            <ChevronDownIcon />
                          </Dropdown.DropdownButton>
                          <Dropdown.DropdownMenu key={`dropdown-menu-${index}`} anchor="bottom start" className="min-w-80 lg:min-w-64">
                            {(item.items as NavItem[]).map((item, index) => {
                              return (
                                <Dropdown.DropdownItem key={`dropitem-${index}-${item.url}`} href={item.url}>
                                  {item?.tag && item.tag}
                                  {item.label && <Dropdown.DropdownLabel>{item.label}</Dropdown.DropdownLabel>}
                                </Dropdown.DropdownItem>
                              );
                            })}
                          </Dropdown.DropdownMenu>
                        </Dropdown.Dropdown>
                      );

                    return (
                      <Navbar.NavbarItem key={`navbar-${index}-${item.url}`} href={item.url}>
                        {item.tag && item.tag}
                        {item.label && <Navbar.NavbarLabel>{item.label}</Navbar.NavbarLabel>}
                      </Navbar.NavbarItem>
                    );
                  })}
                </Navbar.NavbarSection>
              );
            })}
          </Navbar.Navbar>
        }
        sidebar={
          <Sidebar.Sidebar>
            <Sidebar.SidebarBody>
              {navConfig.sections.map((section, index) => {
                return (
                  <Sidebar.SidebarSection key={`sidebar-section-${index}`}>
                    {section.items.map((item, index) => {
                      if ('items' in item && item.items) {
                        return (
                          <Fragment key={index}>
                            <Sidebar.SidebarDivider key={`sidebar-divider-${index}`} />
                            <Sidebar.SidebarSection key={`sidebar-section2-${index}-${item.url}`}>
                              {(item.items as NavItem[]).map((item, index) => {
                                return (
                                  <Sidebar.SidebarItem key={`sidebar-${index}-${item.url}`} href={item.url}>
                                    {item?.tag && item.tag}
                                    {item.label && <Sidebar.SidebarLabel>{item.label}</Sidebar.SidebarLabel>}
                                  </Sidebar.SidebarItem>
                                );
                              })}
                            </Sidebar.SidebarSection>
                          </Fragment>
                        );
                      }

                      return (
                        <Sidebar.SidebarItem key={`sidebar-${index}-${item.url}`} href={item.url}>
                          {item.tag && item.tag}
                          {item.label && <Sidebar.SidebarLabel>{item.label}</Sidebar.SidebarLabel>}
                        </Sidebar.SidebarItem>
                      );
                    })}
                  </Sidebar.SidebarSection>
                );
              })}
            </Sidebar.SidebarBody>
          </Sidebar.Sidebar>
        }
      />
    )
  );
}
