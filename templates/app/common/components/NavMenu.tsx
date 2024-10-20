import { Fragment } from 'react/jsx-runtime';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  StackedLayout,
} from 'componentry/components';

import { cypher } from '~/common/utils';
import { navConfig } from '~/config/config.nav';

interface NavMenuProps {
  className?: string;
}

export default function NavMenu({ className }: NavMenuProps) {
  return (
    navConfig.sections && (
      <StackedLayout
        navbar={
          <Navbar className={className}>
            {navConfig.sections.map((section, index) => {
              return (
                <NavbarSection key={`navbar-section-${index}`} className="max-lg:hidden">
                  {section.items.map((item, index) => {
                    if ('items' in item && item.items)
                      return (
                        <Dropdown key={`dropdown-${index}`}>
                          <DropdownButton as={NavbarItem} className="hidden lg:block">
                            {item.items[0]?.heading && <NavbarLabel>{item.items[0].heading}</NavbarLabel>}
                            <ChevronDownIcon />
                          </DropdownButton>
                          <DropdownMenu key={`dropdown-menu-${index}`} anchor="bottom start" className="min-w-80 lg:min-w-64">
                            {item.items.map((item, index) => {
                              return (
                                <DropdownItem key={`dropitem-${index}-${item.url}`} href={item.url}>
                                  {item?.tag && item.tag}
                                  {item.label && <DropdownLabel>{item.label}</DropdownLabel>}
                                </DropdownItem>
                              );
                            })}
                          </DropdownMenu>
                        </Dropdown>
                      );

                    return (
                      <NavbarItem key={`navbar-${index}-${item.url}`} href={item.url}>
                        {item.tag && item.tag}
                        {item.label && <NavbarLabel>{item.label}</NavbarLabel>}
                      </NavbarItem>
                    );
                  })}
                </NavbarSection>
              );
            })}
          </Navbar>
        }
        sidebar={
          <Sidebar>
            <SidebarBody>
              {navConfig.sections.map((section, index) => {
                return (
                  <SidebarSection key={`sidebar-section-${index}${cypher()}`}>
                    {section.items.map((item, index) => {
                      if ('items' in item && item.items) {
                        return (
                          <Fragment key={index}>
                            <SidebarDivider key={`sidebar-divider-${index}`} />
                            <SidebarSection key={`sidebar-section2-${index}-${item.url}`}>
                              {item.items.map((item, index) => {
                                return (
                                  <SidebarItem key={`sidebar-${index}-${item.url}`} href={item.url}>
                                    {item.tag && item.tag}
                                    {item.label && <SidebarLabel>{item.label}</SidebarLabel>}
                                  </SidebarItem>
                                );
                              })}
                            </SidebarSection>
                          </Fragment>
                        );
                      }

                      return (
                        <SidebarItem key={`sidebar-${index}-${item.url}`} href={item.url}>
                          {item.tag && item.tag}
                          {item.label && <SidebarLabel>{item.label}</SidebarLabel>}
                        </SidebarItem>
                      );
                    })}
                  </SidebarSection>
                );
              })}
            </SidebarBody>
          </Sidebar>
        }
      />
    )
  );
}
