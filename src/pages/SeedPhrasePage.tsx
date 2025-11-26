import { useWallet } from "@/contexts/WalletContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeedPhrasePage() {
  const navigate = useNavigate();
  const { importWalletFromMnemonic } = useWallet();

  const [mnemonic, setMnemonic] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  /** ---------------------------------------------------------
   * 🔹 Cargar la frase semilla desde localStorage
   *    (siempre presente al crear una wallet)
   * --------------------------------------------------------- */
  useEffect(() => {
    const savedMnemonic = localStorage.getItem("hairywallet:tempMnemonic");

    if (savedMnemonic) {
      const parsed = JSON.parse(savedMnemonic);
      const text = Array.isArray(parsed) ? parsed.join(" ") : parsed;

      setMnemonic(text);
      setWords(text.split(" "));
    } else {
      // Si no hay frase, volvemos al inicio
      navigate("/welcome");
    }
  }, [navigate]);

  /** ---------------------------------------------------------
   * 🔹 Copiar la frase
   * --------------------------------------------------------- */
  const copyMnemonic = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** ---------------------------------------------------------
   * 🔹 Guardar frase como wallet REAL
   * --------------------------------------------------------- */
  const handleContinue = async () => {
    if (!confirmed) return;

    // Crear/importar wallet real
    await importWalletFromMnemonic(mnemonic);

    // Limpiar memoria temporal
    localStorage.removeItem("hairywallet:tempMnemonic");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-key-2-fill text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Frase Semilla de Recuperación
            </h1>
            <p className="text-purple-200">
              Guarda estas 12 palabras en un lugar seguro
            </p>
          </div>

          {/* WARNING */}
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <i className="ri-alarm-warning-fill text-2xl text-red-400"></i>
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-2">⚠️ MUY IMPORTANTE:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Esta frase es la ÚNICA forma de recuperar tu wallet</li>
                  <li>Nunca la compartas con nadie</li>
                  <li>Guárdala en un lugar seguro y offline</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GRID DE 12 PALABRAS */}
          <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {words.map((w, i) => (
                <div
                  key={i}
                  className="bg-white/10 rounded-lg p-3 flex items-center space-x-3"
                >
                  <span className="text-purple-300 font-semibold text-sm w-6">
                    {i + 1}.
                  </span>
                  <span className="text-white font-mono font-semibold">
                    {w}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COPIAR */}
          <button
            onClick={copyMnemonic}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl mb-6 shadow-lg"
          >
            <i className={copied ? "ri-check-line" : "ri-file-copy-line"}></i>
            {copied ? " ¡Copiado!" : " Copiar Frase Semilla"}
          </button>

          {/* CONFIRMACIÓN */}
          <label className="flex items-start space-x-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <span className="text-sm text-purple-100">
              He guardado mi frase semilla de forma segura.
            </span>
          </label>

          {/* CONTINUAR */}
          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg"
          >
            Continuar a mi wallet
            <i className="ri-arrow-right-line text-xl ml-2"></i>
          </button>

        </div>
      </div>
    </div>
  );
}
