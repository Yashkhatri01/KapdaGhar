import { Search } from "lucide-react";

function Header() {
  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b">

      {/* LEFT - Quick Search */}
      <div className="flex items-center gap-2 w-80">

        <Search size={16} className="text-gray-400" />

        <input
          placeholder="Search customers, inventory..."
          className="w-full text-sm outline-none bg-transparent"
        />

      </div>

      {/* RIGHT - Actions */}
      <div className="flex items-center gap-3">

        <button className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
          + Quick Sale
        </button>

        <div className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          Offline
        </div>

        <div className="h-8 w-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
          CG
        </div>

      </div>

    </header>
  );
}

export default Header;