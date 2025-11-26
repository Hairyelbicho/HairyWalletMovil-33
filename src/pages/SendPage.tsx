import { useWalletContext } from "@/contexts/WalletContext";
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SendPage() {
  const navigate = useNavigate();
  const { wallet } = useWalletContext();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo] = useState(""); // se puede integrar más adelante
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [loading, setLoading] = useState(false);

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const validateAddress = (address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const convertSecretKey = () => {
    try {
      if (!wallet?.secretKey) return null;

      let keyArray;

      // 1. Base58
      if (typeof wallet.secretKey === "string" && wallet.secretKey.length > 50) {
        const bs58 = require("bs58");
        keyArray = bs58.decode(wallet.secretKey);
      }

      // 2. JSON array "[1,2,3...]"
      if (typeof wallet.secretKey === "string" && wallet.secretKey.startsWith("[")) {
        keyArray = Uint8Array.from(JSON.parse(wallet.secretKey));
      }

      // 3. Uint8Array directa
      if (wallet.secretKey instanceof Uint8Array) {
        keyArray = wallet.secretKey;
      }

      if (!keyArray) return null;

      return Keypair.fromSecretKey(keyArray);
    } catch (err) {
      console.error("Error leyendo secretKey:", err);
      return null;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTxSignature("");

    if (!wallet?.publicKey) {
      setError("No hay wallet activa.");
      return;
    }

    if (!recipient.trim()) {
      setError("Ingresa una dirección de destino.");
      return;
    }

    if (!validateAddress(recipient)) {
      setError("La dirección no es válida.");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Cantidad no válida.");
      return;
    }

    const keypair = convertSecretKey();
    if (!keypair) {
      setError("Error al leer la clave privada de la wallet.");
      return;
    }

    try {
      setLoading(true);

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amountNum * 1e9,
        })
      );

      const signature = await sendAndConfirmTransaction(connection, tx, [keypair]);
      setTxSignature(signature);
      setSuccess("¡Transacción enviada con éxito!");

      // limpiar formulario
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("Error enviando tx:", err);
      setError(err?.message || "Error al enviar la transacción.");
    }

    setLoading(false);
  };

  const copySig = () => {
    navigator.clipboard.writeText(txSignature);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Enviar SOL</h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
          >
            <i className="ri-close-line text-xl text-white"></i>
          </button>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4">
            <p className="text-green-300 font-semibold">{success}</p>

            {txSignature && (
              <div className="mt-2">
                <p className="text-xs text-green-200 font-mono break-all">{txSignature}</p>

                <button
                  onClick={copySig}
                  className="text-xs text-green-300 hover:text-green-200 mt-1 cursor-pointer"
                >
                  Copiar firma
                </button>

                <a
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=mainnet-beta`}
                  target="_blank"
                  className="block text-xs mt-2 text-green-300 hover:text-green-200 cursor-pointer"
                >
                  Ver en Solana Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSend} className="space-y-6">

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-purple-200">Dirección destino</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1"
              placeholder="Ej: Gg4gNhz..."
              value={recipient}
              disabled={loading}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm text-purple-200">Cantidad (SOL)</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1"
              placeholder="0.00"
              type="number"
              disabled={loading}
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* FEE */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-purple-200 text-sm">
            Fee estimado: ~0.000005 SOL
          </div>

          <button
            type="submit"
            disabled={loading || !recipient || !amount}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-xl"></i>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill text-xl"></i>
                <span>Enviar</span>
              </>
            )}
          </button>
        </form>

        {/* WARNING */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 text-xs text-yellow-200">
          ⚠️ Las transacciones son irreversibles. Verifica siempre la dirección de destino.
        </div>
      </div>
    </div>
  );
}
