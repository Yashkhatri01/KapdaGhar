import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

import { useSidebar } from "../contexts/SidebarContext";

function AppLayout() {

  const {

    collapsed,
    mobileOpen,
    closeMobile,

  } = useSidebar();

  return (

    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Mobile Overlay */}

      {mobileOpen && (

        <div

          onClick={closeMobile}

          className="
            fixed
            inset-0
            z-30
            bg-black/40
            lg:hidden
          "

        />

      )}

      {/* Desktop Sidebar Space */}

      <div

        className={`
          hidden
          lg:block
          shrink-0
          transition-all
          duration-300
          ${
            collapsed
              ? "w-20"
              : "w-64"
          }
        `}

      />

      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        <main

          className="
            flex-1
            overflow-y-auto
            bg-gray-50
            p-6
          "

        >

          <Outlet />

        </main>

        <Footer />

      </div>

    </div>

  );

}

export default AppLayout;