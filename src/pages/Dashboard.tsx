import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { address, balance, isLoading, refreshBalance, wallet } = useWallet();
  const [copied, setCopied] = useState(false);
  const [recentTxs, setRecentTxs] = useState<any[]>([]);

  useEffect(() => {
    if (!address) {
      navigate('/hairy-home');
    }
  }, [address, navigate]);

  useEffect(() => {
    if (wallet) {
      loadRecentTransactions();
    }
  }, [wallet]);

  const loadRecentTransactions = async () => {
    if (!wallet) return;
    
    try {
      const signatures = await wallet.connection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: 5 }
      );
      setRecentTxs(signatures);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickActions = [
    {
      icon: 'ri-send-plane-fill',
      label: 'Enviar',
      path: '/hairy-wallet/enviar',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: 'ri-qr-code-fill',
      label: 'Recibir',
      path: '/hairy-wallet/recibir',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: 'ri-history-fill',
      label: 'Historial',
      path: '/hairy-wallet/historial',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'ri-settings-3-fill',
      label: 'Ajustes',
      path: '/hairy-wallet/ajustes',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  if (!address) return null;

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100 text-sm mb-1">Balance Total</p>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-5xl font-bold text-white">
                {isLoading ? '...' : balance.toFixed(4)}
              </h1>
              <span className="text-2xl text-purple-100 font-semibold">SOL</span>
            </div>
          </div>
          <button
            onClick={refreshBalance}
            className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full transition-all cursor-pointer"
            title="Actualizar balance"
          >
            <i className={`ri-refresh-line text-2xl text-white ${isLoading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>

        {/* Address */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
          <p className="text-purple-200 text-xs mb-2">Tu Dirección</p>
          <div className="flex items-center justify-between">
            <p className="text-white font-mono text-sm break-all">{address}</p>
            <button
              onClick={copyAddress}
              className="ml-4 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex-shrink-0 cursor-pointer"
              title="Copiar dirección"
            >
              <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'} text-lg text-white`}></i>
            </button>
          </div>
          {copied && (
            <p className="text-green-300 text-xs mt-2">¡Dirección copiada!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/15 rounded-2xl p-6 border border-white/20 transition-all group cursor-pointer"
          >
            <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
              <i className={`${action.icon} text-2xl text-white`}></i>
            </div>
            <p className="text-white font-semibold text-center">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Transacciones Recientes</h2>
          <button
            onClick={() => navigate('/hairy-wallet/historial')}
            className="text-purple-200 hover:text-white text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Ver todas <i className="ri-arrow-right-line"></i>
          </button>
        </div>

        {recentTxs.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-inbox-line text-5xl text-purple-300 mb-3"></i>
            <p className="text-purple-200">No hay transacciones recientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTxs.map((tx, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                onClick={() => window.open(`https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`, '_blank')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <i className="ri-arrow-right-line text-purple-300"></i>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Transacción</p>
                      <p className="text-purple-300 text-xs font-mono">
                        {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.err ? 'text-red-400' : 'text-green-400'}`}>
                      {tx.err ? 'Error' : 'Confirmada'}
                    </p>
                    <p className="text-purple-300 text-xs">
                      {new Date((tx.blockTime || 0) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Info */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Conectado a Solana mainnet-beta</span>
          </div>
          <a
            href="https://faucet.solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-200 hover:text-white text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            Obtener SOL de prueba <i className="ri-external-link-line"></i>
          </a>
        </div>
      </div>
    </div>
  );
}



