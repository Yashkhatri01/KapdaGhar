import { navigation } from "../../../config/navigation";
import SidebarItem from "./SidebarItem";
function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-full border-r bg-white flex flex-col">

      {/* BRAND */}
      <div className="border-b p-5">
        <h1 className="text-2xl font-bold text-gray-900">
          ChhayaGarments
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          KapdaGhar • Business Manager
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">

  <div className="space-y-1">

    {navigation.map((item) => (

      <SidebarItem
        key={item.path}
        item={item}
      />

    ))}

  </div>

</nav>

    </aside>
  );
}

export default Sidebar;