import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Footer from "../components/layout/footer/Footer";

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* FOOTER */}
        <div className="shrink-0 border-t bg-white">
          <Footer />
        </div>

      </div>

    </div>
  );
}

export default AppLayout;