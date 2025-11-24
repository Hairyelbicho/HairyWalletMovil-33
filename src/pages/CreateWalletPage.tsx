import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function CreateWalletPage() {
  const navigate = useNavigate();
  const { createWallet, isLoading } = useWallet();
  const [error, setError] = useState('');

  const handleCreateWallet = async () => {
    try {
      setError('');
      const { mnemonic } = await createWallet();
      
      // Navegar a la página de seed phrase
      navigate('/hairy-wallet/seed-phrase', { 
        state: { mnemonic },
        replace: true 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la wallet');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/hairy-home')}
              className="absolute top-8 left-8 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl text-white"></i>
            </button>
            
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <i className="ri-add-circle-fill text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Crear Nueva Wallet
            </h1>
            <p className="text-purple-200">
              Genera una wallet segura de Solana
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <i className="ri-error-warning-fill text-2xl text-red-400"></i>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-shield-check-line text-xl text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Seguridad Total</h3>
                  <p className="text-sm text-purple-200">
                    Tu wallet se genera localmente en tu dispositivo. Nadie más tiene acceso a tus claves.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-key-2-line text-xl text-blue-400"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Frase Semilla de 12 Palabras</h3>
                  <p className="text-sm text-purple-200">
                    Recibirás una frase de recuperación única. Guárdala en un lugar seguro.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="ri-wallet-3-line text-xl text-purple-400"></i>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Compatible con Solana</h3>
                  <p className="text-sm text-purple-200">
                    Tu wallet funciona con toda la red de Solana y tokens SPL.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-6 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line text-xl animate-spin"></i>
                <span>Creando Wallet...</span>
              </>
            ) : (
              <>
                <i className="ri-add-circle-fill text-xl"></i>
                <span>Crear Mi Wallet</span>
              </>
            )}
          </button>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-alert-line text-xl text-yellow-400 flex-shrink-0"></i>
              <div className="text-xs text-yellow-200">
                <p className="font-semibold mb-2">⚠️ Importante:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>En el siguiente paso verás tu frase semilla de recuperación</li>
                  <li>Escríbela y guárdala en un lugar seguro</li>
                  <li>Es la ÚNICA forma de recuperar tu wallet si pierdes acceso</li>
                  <li>Nunca compartas tu frase semilla con nadie</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
