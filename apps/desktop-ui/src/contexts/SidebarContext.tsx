import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SidebarContextType = {
  collapsed: boolean;
  mobileOpen: boolean;

  toggleCollapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
};

const SidebarContext =
  createContext<SidebarContextType | null>(null);

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem("sidebarCollapsed");

    if (saved) {
      setCollapsed(saved === "true");
    }
  }, []);

  function toggleCollapse() {
    const value = !collapsed;

    setCollapsed(value);

    localStorage.setItem(
      "sidebarCollapsed",
      String(value)
    );
  }

  function openMobile() {
    setMobileOpen(true);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        toggleCollapse,
        openMobile,
        closeMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context =
    useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used inside SidebarProvider"
    );
  }

  return context;
}