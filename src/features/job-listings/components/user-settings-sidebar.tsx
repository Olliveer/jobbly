import SidebarNavMenuGroup from "@/components/sidebar/sidebar-nav-menu-group";
import { BellIcon, FileUserIcon } from "lucide-react";

const UserSettingsSidebar = () => {
  return (
    <SidebarNavMenuGroup
      items={[
        {
          label: "Notifications",
          icon: <BellIcon />,
          href: "/user-settings/notifications",
        },
        {
          label: "Resume",
          icon: <FileUserIcon />,
          href: "/user-settings/resume",
        },
      ]}
    />
  );
};

export { UserSettingsSidebar };
