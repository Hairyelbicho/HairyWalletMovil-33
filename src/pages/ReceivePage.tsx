import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { QRCodeSVG } from 'qrcode.react';

// Alias .sol de tu wallet en mainnet
const HAIRY_DOMAIN = 'billeterapeluda.sol';

export default function ReceivePage() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getQRValue = () => {
    if (!address) return '';
    if (amount && !isNaN(parseFloat(amount))) {
      // Formato estándar de URI de pago de Solana
      return `solana:${address}?amount=${amount}`;
    }
    return address;
  };

  const shareAddress = async () => {
    if (!address) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi dirección de HairyWallet',
          text: `Envíame SOL a esta dirección: ${address}${
            HAIRY_DOMAIN ? ` (alias: ${HAIRY_DOMAIN})` : ''
          }`,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <i className="ri-qr-code-fill text-2xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Recibir SOL</h1>
              <p className="text-sm text-purple-200">
                Comparte tu dirección para recibir pagos
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hairy-wallet')}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-xl text-white"></i>
          </button>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl p-8 mb-6 flex items-center justify-center">
          <QRCodeSVG
            value={getQRValue()}
            size={256}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Optional Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Cantidad específica (opcional)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-16 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-200 font-semibold text-sm">
              SOL
            </div>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            Si especificas una cantidad, se incluirá en el código QR
          </p>
        </div>

        {/* Address Display */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <p className="text-xs text-purple-200 mb-2">Tu dirección de Solana</p>

          {/* Alias .sol si quieres mostrarlo */}
          {HAIRY_DOMAIN && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cyan-200 font-semibold">
                {HAIRY_DOMAIN}
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-100 px-2 py-1 rounded-full border border-cyan-400/40">
                Alias .sol
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-white font-mono text-sm break-all flex-1 mr-4">
              {address}
            </p>
            <button
              onClick={copyAddress}
              className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex-shrink-0 cursor-pointer"
              title="Copiar dirección"
            >
              <i
                className={`${
                  copied ? 'ri-check-line' : 'ri-file-copy-line'
                } text-lg text-white`}
              ></i>
            </button>
          </div>
          {copied && (
            <p className="text-green-300 text-xs mt-2">
              ¡Dirección copiada al portapapeles!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={copyAddress}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-file-copy-line text-lg"></i>
            <span>Copiar</span>
          </button>

          {typeof navigator !== 'undefined' && (navigator as any).share && (
            <button
              onClick={shareAddress}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-share-line text-lg"></i>
              <span>Compartir</span>
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-3">
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-information-line text-xl text-blue-400 flex-shrink-0 mt-0.5"></i>
              <div className="text-xs text-blue-200">
                <p className="font-semibold mb-1">Cómo recibir SOL:</p>
                <p>
                  Comparte tu dirección, tu alias{' '}
                  {HAIRY_DOMAIN && <strong>{HAIRY_DOMAIN}</strong>} o tu código
                  QR con quien quiera enviarte SOL. Las transacciones aparecerán
                  automáticamente en tu wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-alert-line text-xl text-yellow-400 flex-shrink-0 mt-0.5"></i>
              <div className="text-xs text-yellow-200">
                <p className="font-semibold mb-1">Importante:</p>
                <p>
                  Esta dirección solo acepta SOL y tokens SPL en la red de
                  Solana. No envíes criptomonedas de otras redes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <i className="ri-earth-line text-xl text-green-400 flex-shrink-0 mt-0.5"></i>
              <div className="text-xs text-green-200">
                <p className="font-semibold mb-1">Red principal (mainnet-beta):</p>
                <p>
                  Estás usando la red principal de Solana (mainnet-beta). Aquí
                  los SOL tienen valor real. Asegúrate siempre de comprobar la
                  dirección o alias antes de recibir o enviar fondos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
