import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function ImportWalletPage() {
  const navigate = useNavigate();
  const { importWalletFromMnemonic, importWalletFromPrivateKey, isLoading } = useWallet();
  
  const [importMethod, setImportMethod] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (importMethod === 'mnemonic') {
        if (!mnemonic.trim()) {
          setError('Por favor ingresa tu frase semilla');
          return;
        }
        await importWalletFromMnemonic(mnemonic.trim());
      } else {
        if (!privateKey.trim()) {
          setError('Por favor ingresa tu clave privada');
          return;
        }
        await importWalletFromPrivateKey(privateKey.trim());
      }
      
      navigate('/hairy-wallet');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar la wallet');
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <i className="ri-download-cloud-fill text-3xl text-white"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Importar Wallet
            </h1>
            <p className="text-purple-200">
              Recupera tu wallet existente
            </p>
          </div>

          {/* Import Method Selector */}
          <div className="flex space-x-2 mb-6 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setImportMethod('mnemonic')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                importMethod === 'mnemonic'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Frase Semilla
            </button>
            <button
              onClick={() => setImportMethod('privateKey')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                importMethod === 'privateKey'
                  ? 'bg-white/20 text-white'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Clave Privada
            </button>
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

          {/* Form */}
          <form onSubmit={handleImport} className="space-y-6">
            {importMethod === 'mnemonic' ? (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Frase Semilla (12 palabras)
                </label>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="Ingresa tus 12 palabras separadas por espacios"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono text-sm resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-purple-300 mt-2">
                  Ejemplo: word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Clave Privada
                </label>
                <textarea
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Ingresa tu clave privada en formato base58 o array JSON"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono text-sm resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-purple-300 mt-2">
                  Acepta formato base58 o array JSON [1,2,3,...]
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (importMethod === 'mnemonic' ? !mnemonic : !privateKey)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line text-xl animate-spin"></i>
                  <span>Importando...</span>
                </>
              ) : (
                <>
                  <i className="ri-download-cloud-fill text-xl"></i>
                  <span>Importar Wallet</span>
                </>
              )}
            </button>
          </form>

          {/* Security Warning */}
          <div className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-shield-check-line text-xl text-yellow-400 flex-shrink-0"></i>
              <div className="text-xs text-yellow-200">
                <p className="font-semibold mb-2">🔒 Seguridad:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Tu frase semilla y clave privada nunca se envían a ningún servidor</li>
                  <li>Se almacenan de forma segura solo en tu dispositivo</li>
                  <li>Asegúrate de estar en un entorno seguro antes de ingresar tus claves</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
