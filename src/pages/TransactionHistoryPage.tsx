import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const { wallet, address } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    if (!address) {
      navigate('/hairy-home');
      return;
    }
    loadTransactions();
  }, [address, navigate]);

  const loadTransactions = async () => {
    if (!wallet) return;

    try {
      setIsLoading(true);
      const signatures = await wallet.connection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: 50 }
      );

      const txDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await wallet.connection.getTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0
            });
            return {
              signature: sig.signature,
              blockTime: sig.blockTime,
              err: sig.err,
              slot: sig.slot,
              details: tx
            };
          } catch (err) {
            return {
              signature: sig.signature,
              blockTime: sig.blockTime,
              err: sig.err,
              slot: sig.slot,
              details: null
            };
          }
        })
      );

      setTransactions(txDetails);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionType = (tx: any) => {
    if (!tx.details) return 'unknown';
    
    const preBalances = tx.details.meta?.preBalances || [];
    const postBalances = tx.details.meta?.postBalances || [];
    
    if (preBalances[0] > postBalances[0]) return 'sent';
    if (preBalances[0] < postBalances[0]) return 'received';
    return 'other';
  };

  const getTransactionAmount = (tx: any) => {
    if (!tx.details) return 0;
    
    const preBalances = tx.details.meta?.preBalances || [];
    const postBalances = tx.details.meta?.postBalances || [];
    
    const diff = Math.abs(postBalances[0] - preBalances[0]) / 1e9;
    return diff;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    const type = getTransactionType(tx);
    return type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <i className="ri-history-fill text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Historial de Transacciones</h1>
              <p className="text-sm text-purple-200">{transactions.length} transacciones encontradas</p>
            </div>
          </div>
          <button
            onClick={loadTransactions}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Actualizar"
          >
            <i className={`ri-refresh-line text-xl text-white ${isLoading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white/20 text-white'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm cursor-pointer whitespace-nowrap ${
              filter === 'sent'
                ? 'bg-white/20 text-white'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Enviadas
          </button>
          <button
            onClick={() => setFilter('received')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all text-sm cursor-pointer whitespace-nowrap ${
              filter === 'received'
                ? 'bg-white/20 text-white'
                : 'text-purple-200 hover:text-white'
            }`}
          >
            Recibidas
          </button>
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-5xl text-purple-300 animate-spin mb-4"></i>
            <p className="text-purple-200">Cargando transacciones...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-inbox-line text-5xl text-purple-300 mb-4"></i>
            <p className="text-purple-200 mb-2">No hay transacciones</p>
            <p className="text-sm text-purple-300">
              {filter !== 'all' ? 'Prueba con otro filtro' : 'Realiza tu primera transacción'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx, index) => {
              const type = getTransactionType(tx);
              const amount = getTransactionAmount(tx);
              
              return (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => window.open(`https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`, '_blank')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        type === 'sent' ? 'bg-red-500/20' :
                        type === 'received' ? 'bg-green-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        <i className={`${
                          type === 'sent' ? 'ri-arrow-up-line text-red-400' :
                          type === 'received' ? 'ri-arrow-down-line text-green-400' :
                          'ri-arrow-left-right-line text-purple-400'
                        } text-xl`}></i>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-white font-semibold text-sm">
                            {type === 'sent' ? 'Enviado' :
                             type === 'received' ? 'Recibido' :
                             'Transacción'}
                          </p>
                          {tx.err && (
                            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                              Error
                            </span>
                          )}
                        </div>
                        <p className="text-purple-300 text-xs font-mono truncate">
                          {tx.signature.slice(0, 16)}...{tx.signature.slice(-16)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      {amount > 0 && (
                        <p className={`text-sm font-bold ${
                          type === 'sent' ? 'text-red-400' :
                          type === 'received' ? 'text-green-400' :
                          'text-white'
                        }`}>
                          {type === 'sent' ? '-' : type === 'received' ? '+' : ''}{amount.toFixed(4)} SOL
                        </p>
                      )}
                      <p className="text-purple-300 text-xs">
                        {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-information-line text-xl text-blue-400 flex-shrink-0"></i>
            <div className="text-xs text-blue-200">
              <p className="font-semibold mb-1">Información:</p>
              <p>Haz clic en cualquier transacción para ver los detalles completos en Solana Explorer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



