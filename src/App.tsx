import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { AppRoutes } from "./router";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter basename={__BASE_PATH__}>
        <Suspense fallback={<div className="text-white p-6">Cargando...</div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
