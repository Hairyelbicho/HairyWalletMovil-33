import { useWalletContext } from "@/contexts/WalletContext";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { wallet } = useWalletContext();

  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  /** ---------------------------------------------------------
   *  Redirigir si NO hay wallet cargada
   * --------------------------------------------------------- */
  useEffect(() => {
    if (!wallet?.publicKey) {
      navigate("/welcome");
    }
  }, [wallet, navigate]);

  /** ---------------------------------------------------------
   *  Cargar saldo real
   * --------------------------------------------------------- */
  const loadBalance = async () => {
    if (!wallet?.publicKey) return;

    setLoadingBalance(true);
    try {
      const pubKey = new PublicKey(wallet.publicKey);
      const lamports = await connection.getBalance(pubKey);
      setBalance(lamports / 1e9);
    } catch (err) {
      console.error("Error loading balance:", err);
    }
    setLoadingBalance(false);
  };

  /** ---------------------------------------------------------
   *  Cargar transacciones recientes
   * --------------------------------------------------------- */
  const loadRecentTransactions = async () => {
    if (!wallet?.publicKey) return;

    try {
      const pubKey = new PublicKey(wallet.publicKey);

      const signatures = await connection.getSignaturesForAddress(pubKey, {
        limit: 6,
      });

      setRecentTxs(signatures);
    } catch (err) {
      console.error("Error loading tx:", err);
    }
  };

  useEffect(() => {
    if (wallet?.publicKey) {
      loadBalance();
      loadRecentTransactions();
    }
  }, [wallet]);

  /** ---------------------------------------------------------
   *  Copiar dirección
   * --------------------------------------------------------- */
  const copyAddress = () => {
    if (!wallet?.publicKey) return;

    navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!wallet?.publicKey) return null;

  return (
    <div className="space-y-6">
      {/* BALANCE */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100 text-sm">Balance Total</p>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-5xl font-bold text-white">
                {loadingBalance ? "..." : balance.toFixed(4)}
              </h1>
              <span className="text-2xl text-purple-100">SOL</span>
            </div>
          </div>

          <button
            onClick={loadBalance}
            className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition"
          >
            <i
              className={`ri-refresh-line text-2xl text-white ${
                loadingBalance ? "animate-spin" : ""
              }`}
            ></i>
          </button>
        </div>

        {/* ADDRESS */}
        <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-purple-200 text-xs mb-2">Tu dirección</p>
          <div className="flex items-center justify-between">
            <p className="text-white font-mono text-sm break-all">
              {wallet.publicKey}
            </p>
            <button
              onClick={copyAddress}
              className="ml-3 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg transition cursor-pointer"
            >
              <i
                className={`${
                  copied ? "ri-check-line" : "ri-file-copy-line"
                } text-lg text-white`}
              ></i>
            </button>
          </div>
          {copied && (
            <p className="text-green-300 text-xs mt-2">¡Dirección copiada!</p>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/send")}
          className="bg-white/10 hover:bg-white/15 rounded-2xl p-6 text-center border border-white/20 cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <i className="ri-send-plane-fill text-2xl text-white"></i>
          </div>
          <p className="text-white font-semibold">Enviar</p>
        </button>

        <button
          onClick={() => navigate("/receive")}
          className="bg-white/10 hover:bg-white/15 rounded-2xl p-6 text-center border border-white/20 cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <i className="ri-qr-code-fill text-2xl text-white"></i>
          </div>
          <p className="text-white font-semibold">Recibir</p>
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="bg-white/10 hover:bg-white/15 rounded-2xl p-6 text-center border border-white/20 cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <i className="ri-settings-3-fill text-2xl text-white"></i>
          </div>
          <p className="text-white font-semibold">Ajustes</p>
        </button>

        <button
          onClick={() => navigate("/fiat")}
          className="bg-white/10 hover:bg-white/15 rounded-2xl p-6 text-center border border-white/20 cursor-pointer"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <i className="ri-shopping-cart-fill text-2xl text-white"></i>
          </div>
          <p className="text-white font-semibold">Comprar</p>
        </button>
      </div>

      {/* RECENT TX */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Transacciones recientes</h2>

        {recentTxs.length === 0 && (
          <p className="text-purple-200 text-center py-6">No hay transacciones recientes</p>
        )}

        {recentTxs.map((tx, i) => (
          <div
            key={i}
            onClick={() =>
              window.open(
                `https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`,
                "_blank"
              )
            }
            className="bg-white/5 border border-white/10 p-4 rounded-xl mb-3 hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-white font-medium text-sm">Transacción</p>
                <p className="text-purple-300 text-xs font-mono">
                  {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.err ? "text-red-400" : "text-green-400"}`}>
                  {tx.err ? "Error" : "Confirmada"}
                </p>
                <p className="text-purple-300 text-xs">
                  {tx.blockTime
                    ? new Date(tx.blockTime * 1000).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NETWORK */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-white text-sm flex items-center space-x-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
          <span>Conectado a Solana Mainnet-Beta</span>
        </p>
      </div>
    </div>
  );
}
