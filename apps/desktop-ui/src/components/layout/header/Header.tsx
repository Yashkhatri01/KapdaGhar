import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarDays,
  UserCircle2,
} from "lucide-react";

import { useSidebar } from "../../../contexts/SidebarContext";

function Header() {
  const {
    collapsed,
    toggleCollapse,
    openMobile,
  } = useSidebar();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header
      className="
        h-16
        shrink-0
        bg-white/95
        backdrop-blur
        border-b
        border-gray-200
        px-6
        flex
        items-center
        justify-between
      "
    >
      {/* LEFT */}

      <div className="flex items-center gap-3">

        {/* Mobile */}

        <button
          onClick={openMobile}
          className="
            lg:hidden
            rounded-xl
            p-2
            hover:bg-gray-100
            transition-all
          "
        >
          <Menu size={21} />
        </button>

        {/* Desktop */}

        <button
          onClick={toggleCollapse}
          className="
            hidden
            lg:flex
            rounded-xl
            p-2
            hover:bg-gray-100
            transition-all
          "
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        <div
          className="
            hidden
            sm:flex
            items-center
            gap-2
            text-sm
            text-gray-600
          "
        >
          <CalendarDays
            size={16}
            className="text-indigo-600"
          />

          <span className="font-medium">
            {today}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-gray-200
            px-3
            py-1.5
            hover:bg-gray-50
            transition-all
          "
        >
          <UserCircle2
            size={26}
            className="text-indigo-600"
          />

          <span className="hidden sm:block text-sm font-semibold text-gray-800">
            Seth Ji
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;