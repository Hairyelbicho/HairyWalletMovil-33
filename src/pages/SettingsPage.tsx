import { useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { wallet, resetWallet } = useWalletContext();
  const address = wallet?.publicKey || null;

  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  // ================================
  // Resolver dominio .sol (Name Service)
  // ================================
  useEffect(() => {
    const resolveDomain = async () => {
      if (!address) return;
      try {
        const { reverseLookup } = await import("@solana/spl-name-service");
        const name = await reverseLookup(connection, address).catch(() => null);
        if (name) setDomain(name);
      } catch {
        setDomain(null);
      }
    };
    resolveDomain();
  }, [address]);

  // ================================
  // Copiar dirección
  // ================================
  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ================================
  // Borrar Wallet (solo local)
  // ================================
  const handleDeleteWallet = () => {
    const confirmDelete = confirm(
      "?? Esta acción eliminará tu wallet del dispositivo.\nAsegúrate de haber guardado tu frase semilla.\n\n¿Deseas continuar?"
    );

    if (confirmDelete) {
      resetWallet();
      localStorage.removeItem("hairywallet:wallet");
      navigate("/welcome");
    }
  };

  // ================================
  // Crear nueva wallet
  // ================================
  const handleCreateNew = () => {
    navigate("/seed-phrase", { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Ajustes</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
        >
          <i className="ri-close-line text-xl text-white"></i>
        </button>
      </div>

      {/* Card: Wallet Info */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Tu Wallet</h2>

        {/* Alias */}
        {domain && (
          <div className="mb-3">
            <span className="text-cyan-200 font-semibold">{domain}</span>
            <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-100 px-2 py-1 rounded-full border border-cyan-400/40">
              Alias .sol
            </span>
          </div>
        )}

        {/* Address */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3">
          <p className="text-xs text-purple-200 mb-1">Dirección pública</p>
          <p className="text-white font-mono break-all text-sm">{address}</p>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={copyAddress}
              className="flex items-center justify-center bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              <i className="ri-file-copy-line mr-2"></i>
              {copied ? "Copiado" : "Copiar"}
            </button>

            <button
              onClick={() =>
                window.open(
                  `https://solscan.io/account/${address}?cluster=mainnet`,
                  "_blank"
                )
              }
              className="flex items-center justify-center bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              <i className="ri-external-link-line mr-2"></i>
              Ver en Solscan
            </button>

            <button
              onClick={() => setShowQR(true)}
              className="flex items-center justify-center bg-green-500/20 text-green-200 hover:bg-green-500/30 px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              <i className="ri-qr-code-line mr-2"></i>
              Ver QR
            </button>
          </div>
        </div>

        {/* Show QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 shadow-2xl text-center relative">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-gray-700 hover:text-black"
              >
                <i className="ri-close-line text-xl"></i>
              </button>

              <QRCodeSVG value={address!} size={250} />
              <p className="mt-4 text-gray-700 text-sm break-all">{address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Security */}
      <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-red-300 mb-4">Seguridad</h2>
        <p className="text-sm text-red-200 mb-4">
          Tu frase semilla es la clave de tu wallet. No se guarda en servidores.
        </p>

        <button
          onClick={handleDeleteWallet}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl cursor-pointer"
        >
          Eliminar Wallet del dispositivo
        </button>
      </div>

      {/* Create new wallet */}
      <div className="bg-yellow-500/10 border border-yellow-400/30 p-6 rounded-2xl mb-6">
        <h2 className="text-xl font-bold text-yellow-300 mb-2">Crear nueva wallet</h2>
        <p className="text-sm text-yellow-200 mb-4">
          Generará una nueva frase semilla y reemplazará la actual.
        </p>

        <button
          onClick={handleCreateNew}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl cursor-pointer"
        >
          Crear nueva wallet
        </button>
      </div>

      {/* App Settings */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Aplicación</h2>

        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-purple-200 text-sm">Idioma</span>
          <span className="text-white font-semibold text-sm">Español</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-purple-200 text-sm">Versión</span>
          <span className="text-white font-semibold text-sm">v1.0.0</span>
        </div>
      </div>
    </div>
  );
}