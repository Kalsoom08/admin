import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@maincomponents/sidebar/SidebarProvider';
import { TeamSwitcher } from '@maincomponents/sidebar/TeamSwitcher';
import { NavGroup } from '@maincomponents/sidebar/NavGroup';

import { sidebarData } from '@data/sidebar';

function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map(props => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
