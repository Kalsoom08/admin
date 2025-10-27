import CONSTANTS from '@data/Constants';
import { HeaderBar } from '@maincomponents/headerbar/HeaderBar';
import { ProfileDropdown } from '@maincomponents/headerbar/ProfileDropdown';
import { ThemeSwitch } from '@maincomponents/headerbar/ThemeSwitch';

import { cn } from '@maincomponents/lib/utils';
import AppSidebar from '@maincomponents/sidebar/Index';
import { SidebarProvider } from '@maincomponents/sidebar/SidebarProvider';
import { PrivatePageWrapper } from '@maincomponents/wrappers/PrivatePageWrapper';
import { getLocalStorageValue } from '@utils/localstorageutil';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const defaultOpen = getLocalStorageValue(CONSTANTS.SIDEBAR_STATE) || true;
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div
        id='content'
        className={cn(
          'ml-auto w-full max-w-full',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'sm:transition-[width] sm:duration-200 sm:ease-linear',
          'flex h-svh flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
        )}
      >
        <HeaderBar>
          <div className='ml-auto flex items-center gap-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </HeaderBar>
        <PrivatePageWrapper>
          <Outlet />
        </PrivatePageWrapper>
      </div>
    </SidebarProvider>
  );
}
