import { RouterProvider } from "react-router-dom";
import StartupLoader from "./components/startup/StartupLoader";
import { useStartup } from "./hooks/useStartup";
import router from "./router";

function App() {
  const ready = useStartup();

  if (!ready) {
    return <StartupLoader ready={false} />;
  }

  return <RouterProvider router={router} />;
}

export default App;