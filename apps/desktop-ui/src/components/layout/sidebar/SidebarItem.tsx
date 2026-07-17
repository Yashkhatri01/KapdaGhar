import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import Tooltip from "../../ui/tooltip/Tooltip";
type NavigationItem = {
  title: string;
  subtitle?: string;
  path: string;
  icon: LucideIcon;
};

type SidebarItemProps = {
  item: NavigationItem;
  collapsed: boolean;
};

function SidebarItem({
  item,
  collapsed,
}: SidebarItemProps) {

  const Icon = item.icon;

  return (
    <NavLink
  to={item.path}
  className={({ isActive }) =>
    `
    group
    flex
    items-center
    rounded-xl
    transition-all
    duration-200

    ${
      collapsed
        ? "justify-center p-3"
        : "gap-4 px-4 py-3"
    }

    ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm"
        : "text-gray-700 hover:bg-gray-100"
    }
    `
  }
>

  {collapsed ? (

<Tooltip
  title={item.title}
  subtitle={item.subtitle}
>
  <div
    className="
      flex
      h-10
      w-10
      shrink-0
      items-center
      justify-center
      rounded-lg
      bg-gray-100
      group-hover:bg-white
      transition
    "
  >
    <Icon size={20} />
  </div>
</Tooltip>

) : (

<div
  className="
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    rounded-lg
    bg-gray-100
    group-hover:bg-white
    transition
  "
>

<Icon size={20}/>

</div>

)}

  {!collapsed && (

    <div className="flex flex-col">

      <span className="text-sm font-semibold">
        {item.title}
      </span>

      {item.subtitle && (

        <span className="text-xs text-gray-500">
          {item.subtitle}
        </span>

      )}

    </div>

  )}

</NavLink>
  );
}

export default SidebarItem;