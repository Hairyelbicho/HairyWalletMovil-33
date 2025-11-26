import { useWalletContext } from "@/contexts/WalletContext";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceivePage() {
  const navigate = useNavigate();
  const { wallet } = useWalletContext();
  const address = wallet?.publicKey || null;

  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [domain, setDomain] = useState<string | null>(null);

  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  // ================================
  // 🔍 Resolver dominio .SOL automáticamente
  // ================================
  useEffect(() => {
    const resolveDomain = async () => {
      try {
        if (!address) return;

        const { getHashedName, getNameAccountKey, NameRegistryState } =
          await import("@solana/spl-name-service");

        const hashed = await getHashedName(address.toString());
        const key = await getNameAccountKey(hashed, undefined, undefined);

        const registry = await NameRegistryState.retrieve(connection, key).catch(() => null);

        if (registry?.data) {
          const solName = registry.data.toString().replace(/\0/g, "");
          if (solName.endsWith(".sol")) {
            setDomain(solName);
          }
        }
      } catch {
        setDomain(null);
      }
    };

    resolveDomain();
  }, [address]);

  // ================================
  // 📌 Copiar dirección
  // ================================
  const copyAddress = () => {
    if (!address) return;

    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ================================
  // 🧾 Formato QR estándar
  // ================================
  const getQRValue = () => {
    if (!address) return "";
    if (amount && !isNaN(parseFloat(amount))) {
      return `solana:${address}?amount=${amount}`;
    }
    return address;
  };

  // ================================
  // 📤 Compartir (si disponible)
  // ================================
  const shareAddress = async () => {
    if (!address) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi dirección de HairyWallet",
          text: `Envíame SOL a: ${address}${domain ? ` (alias: ${domain})` : ""}`,
        });
      } catch {}
    }
  };

  if (!address) {
    return (
      <div className="p-8 text-center text-white">
        <h2>No hay wallet cargada</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <i className="ri-qr-code-fill text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Recibir SOL</h1>
              <p className="text-sm text-purple-200">Escanea o comparte tu dirección</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
          >
            <i className="ri-close-line text-xl text-white"></i>
          </button>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-8 mb-6 flex items-center justify-center shadow-xl">
          <QRCodeSVG
            value={getQRValue()}
            size={260}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Amount optional */}
        <div className="mb-6">
          <label className="text-sm text-purple-200">Cantidad (opcional)</label>
          <div className="relative mt-2">
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white placeholder-purple-300"
              placeholder="0.00"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-purple-200">SOL</div>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            Si ingresas una cantidad, aparecerá también en el QR.
          </p>
        </div>

        {/* Address + Alias */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <p className="text-xs text-purple-200 mb-2">Tu dirección</p>

          {domain && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cyan-200 font-semibold">{domain}</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-100 px-2 py-1 rounded-full border border-cyan-400/40">
                Alias .sol
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-white font-mono text-sm break-all mr-4">{address}</p>
            <button
              onClick={copyAddress}
              className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer"
            >
              <i className={`${copied ? "ri-check-line" : "ri-file-copy-line"} text-white text-lg`}></i>
            </button>
          </div>

          {copied && (
            <p className="text-green-300 text-xs mt-2">¡Dirección copiada!</p>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={copyAddress}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl shadow-lg hover:shadow-2xl"
          >
            Copiar
          </button>

          {navigator.share && (
            <button
              onClick={shareAddress}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl shadow-lg hover:shadow-2xl"
            >
              Compartir
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 text-xs text-blue-200">
            <strong>Cómo recibir SOL:</strong> comparte tu dirección, alias .sol o tu QR.
          </div>

          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 text-xs text-yellow-200">
            <strong>Importante:</strong> solo envía SOL y tokens SPL en Solana.
          </div>

          <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 text-xs text-green-200">
            <strong>Red:</strong> Estás en Solana mainnet-beta (modo real).
          </div>
        </div>
      </div>
    </div>
  );
}
