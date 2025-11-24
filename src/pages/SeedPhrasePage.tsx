import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SeedPhrasePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const state = location.state as { mnemonic?: string };
    if (state?.mnemonic) {
      setMnemonic(state.mnemonic);
      setWords(state.mnemonic.split(' '));
    } else {
      navigate('/hairy-home');
    }
  }, [location, navigate]);

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (confirmed) {
      navigate('/hairy-wallet');
    }
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

          {/* Warning */}
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <i className="ri-alarm-warning-fill text-2xl text-red-400 flex-shrink-0"></i>
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-2">⚠️ MUY IMPORTANTE:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Esta frase es la ÚNICA forma de recuperar tu wallet</li>
                  <li>Nunca la compartas con nadie</li>
                  <li>Guárdala en un lugar seguro y offline</li>
                  <li>Si la pierdes, perderás acceso a tus fondos para siempre</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seed Phrase Grid */}
          <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-lg p-3 flex items-center space-x-3"
                >
                  <span className="text-purple-300 font-semibold text-sm w-6">
                    {index + 1}.
                  </span>
                  <span className="text-white font-mono font-semibold">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyMnemonic}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-6 cursor-pointer whitespace-nowrap"
          >
            <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'} text-xl`}></i>
            <span>{copied ? '¡Copiado!' : 'Copiar Frase Semilla'}</span>
          </button>

          {/* Confirmation Checkbox */}
          <label className="flex items-start space-x-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-400 cursor-pointer"
            />
            <span className="text-sm text-purple-100">
              He guardado mi frase semilla de forma segura. Entiendo que si la pierdo, no podré recuperar mi wallet.
            </span>
          </label>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            <span>Continuar a mi Wallet</span>
            <i className="ri-arrow-right-line text-xl"></i>
          </button>

          {/* Tips */}
          <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-lightbulb-line text-xl text-blue-400 flex-shrink-0"></i>
              <div className="text-xs text-blue-200">
                <p className="font-semibold mb-2">💡 Consejos de seguridad:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Escribe la frase en papel y guárdala en un lugar seguro</li>
                  <li>Considera usar una caja fuerte o bóveda</li>
                  <li>No tomes capturas de pantalla ni la guardes digitalmente</li>
                  <li>No la envíes por email, mensajes o redes sociales</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
