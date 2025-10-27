import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@maincomponents/sidebar/SidebarProvider';
import logo from "../../assets/logo.png";
export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-gray-300 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
           <img src={logo} className="size-4" alt="Ahmad Cafe" />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>Ahmad Cafe</span>
         
              </div>
         
            </SidebarMenuButton>
          </DropdownMenuTrigger>
    
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
