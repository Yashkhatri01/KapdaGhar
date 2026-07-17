import { navigation } from "../../../config/navigation";
import SidebarItem from "./SidebarItem";
import { useSidebar } from "../../../contexts/SidebarContext";

function Sidebar() {
  const {
    collapsed,
    mobileOpen,
    closeMobile,
  } = useSidebar();

  return (
    <aside
      className={`
        fixed
        lg:fixed
        inset-y-0
        left-0
        z-40
        flex
        flex-col
        bg-white
        border-r
        transition-all
        duration-300
        ease-in-out

        ${
          collapsed
          ? "w-20 lg:w-20"
          : "w-64 lg:w-64"
        }

        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }

        w-64
      `}
    >
      {/* BRAND */}

<div
  className={`
    border-b
    transition-all
    duration-300
    ${
      collapsed
        ? "p-4"
        : "px-5 py-5"
    }
  `}
>

  {collapsed ? (

    <div className="flex justify-center">

      <img
        src="/logo.svg"
        alt="Chhaya Garments"
        className="h-10 w-10 object-contain"
      />

    </div>

  ) : (

    <div className="flex items-center gap-3">

      <img
        src="/logo.svg"
        alt="Chhaya Garments"
        className="h-11 w-11 object-contain shrink-0"
      />

      <div className="min-w-0">

        <h1 className="text-lg font-bold text-gray-900 leading-tight">

          Chhaya Garments

        </h1>

        <p className="mt-0.5 text-xs text-gray-500">

          Garment Manager

        </p>

      </div>

    </div>

  )}

</div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto px-3 py-4">

        <div className="space-y-1">

          {navigation.map((item) => (

            <div
              key={item.path}
              onClick={closeMobile}
            >
              <SidebarItem
                item={item}
                collapsed={collapsed}
              />
            </div>

          ))}

        </div>

      </nav>

    </aside>
  );
}

export default Sidebar;