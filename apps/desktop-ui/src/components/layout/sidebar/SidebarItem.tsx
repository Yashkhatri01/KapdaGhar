import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type NavigationItem = {
  title: string;
  subtitle?: string;
  path: string;
  icon: LucideIcon;
};

type SidebarItemProps = {
  item: NavigationItem;
};

function SidebarItem({ item }: SidebarItemProps) {

  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `
        group
        flex
        items-center
        gap-4
        rounded-xl
        px-4
        py-3
        transition-all
        duration-200

        ${
          isActive
            ? "bg-indigo-50 text-indigo-700 shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }
        `
      }
    >

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-gray-100
          transition-colors
          group-hover:bg-white
        "
      >
        <Icon size={20} />
      </div>

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

    </NavLink>
  );
}

export default SidebarItem;