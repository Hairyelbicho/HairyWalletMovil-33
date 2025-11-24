import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { PublicKey } from '@solana/web3.js';

export default function SendPage() {
  const navigate = useNavigate();
  const { balance, sendTransaction, isLoading } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txSignature, setTxSignature] = useState('');

  const validateAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleMaxClick = () => {
    // Dejar un poco para las fees (0.000005 SOL)
    const maxAmount = Math.max(0, balance - 0.000005);
    setAmount(maxAmount.toString());
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTxSignature('');

    // Validaciones
    if (!recipient.trim()) {
      setError('Por favor ingresa una dirección de destino');
      return;
    }

    if (!validateAddress(recipient.trim())) {
      setError('La dirección de destino no es válida');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Por favor ingresa una cantidad válida');
      return;
    }

    if (amountNum > balance) {
      setError('Balance insuficiente');
      return;
    }

    try {
      const signature = await sendTransaction(recipient.trim(), amountNum);
      setTxSignature(signature);
      setSuccess('¡Transacción enviada exitosamente!');
      
      // Limpiar formulario
      setRecipient('');
      setAmount('');
      setMemo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la transacción');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <i className="ri-send-plane-fill text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Enviar SOL</h1>
              <p className="text-sm text-purple-200">Balance disponible: {balance.toFixed(4)} SOL</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hairy-wallet')}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl text-white"></i>
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-checkbox-circle-fill text-2xl text-green-400 flex-shrink-0"></i>
              <div className="flex-1">
                <p className="text-green-300 font-semibold mb-2">{success}</p>
                {txSignature && (
                  <div className="space-y-2">
                    <p className="text-xs text-green-200 font-mono break-all">
                      Firma: {txSignature}
                    </p>
                    <a
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=mainnet-beta`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-green-300 hover:text-green-200 transition-colors cursor-pointer"
                    >
                      <span>Ver en Solana Explorer</span>
                      <i className="ri-external-link-line"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
        <form onSubmit={handleSend} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Dirección de destino
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Ingresa la dirección de Solana"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-purple-200">
                Cantidad
              </label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs text-purple-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                Usar máximo
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg font-semibold"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200 font-semibold">
                SOL
              </div>
            </div>
            {amount && !isNaN(parseFloat(amount)) && (
              <p className="text-xs text-purple-300 mt-2">
                ≈ ${(parseFloat(amount) * 100).toFixed(2)} USD (estimado)
              </p>
            )}
          </div>

          {/* Memo (Optional) */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Nota (opcional)
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Agregar una nota..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>

          {/* Transaction Fee Info */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-200">Fee de red estimado</span>
              <span className="text-white font-semibold">~0.000005 SOL</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !recipient || !amount}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line text-xl animate-spin"></i>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <i className="ri-send-plane-fill text-xl"></i>
                <span>Enviar Transacción</span>
              </>
            )}
          </button>
        </form>

        {/* Warning */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <i className="ri-alert-line text-xl text-yellow-400 flex-shrink-0 mt-0.5"></i>
            <div className="text-xs text-yellow-200">
              <p className="font-semibold mb-1">Importante:</p>
              <p>Verifica cuidadosamente la dirección de destino. Las transacciones en blockchain son irreversibles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



