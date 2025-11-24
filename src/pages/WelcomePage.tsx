import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useEffect } from 'react';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { address } = useWallet();

  useEffect(() => {
    if (address) {
      navigate('/hairy-wallet');
    }
  }, [address, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="https://static.readdy.ai/image/f9a9038def0140c9123e9ba49c8c1ced/2a9a7cef54b9a42ee0e2ab32d8dad66e.png"
              alt="HairyWallet"
              className="w-64 h-64 object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
            HairyWallet
          </h1>
          <p className="text-xl text-purple-100 mb-2">
            Tu wallet de Solana segura y fácil de usar
          </p>
          <p className="text-sm text-purple-200">
            Envía, recibe y gestiona tus SOL de forma segura
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Wallet Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 mx-auto">
              <i className="ri-add-circle-line text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 text-center">
              Crear Nueva Wallet
            </h2>
            <p className="text-purple-100 mb-6 text-center">
              Genera una nueva wallet de Solana con una frase semilla segura de 12 palabras
            </p>
            <button
              onClick={() => navigate('/hairy-wallet/crear')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
            >
              Crear Wallet
            </button>
          </div>

          {/* Import Wallet Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-6 mx-auto">
              <i className="ri-download-cloud-line text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 text-center">
              Importar Wallet
            </h2>
            <p className="text-purple-100 mb-6 text-center">
              Importa una wallet existente usando tu frase semilla o clave privada
            </p>
            <button
              onClick={() => navigate('/hairy-wallet/importar')}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
            >
              Importar Wallet
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'ri-shield-check-line', text: 'Segura' },
            { icon: 'ri-speed-line', text: 'Rápida' },
            { icon: 'ri-lock-line', text: 'Privada' },
            { icon: 'ri-global-line', text: 'Descentralizada' }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <i className={`${feature.icon} text-3xl text-yellow-400 mb-2`}></i>
              <p className="text-sm text-white font-medium">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Network Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-green-400/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300 font-medium">Conectado a Solana Devnet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
