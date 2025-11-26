import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import * as bip39 from "bip39";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";

// ==========================
// MAINNET REAL
// ==========================
export const MAINNET = "https://api.mainnet-beta.solana.com";

type WalletInfo = {
  address: string | null;
  privateKey: string | null; // base58
  mnemonic?: string | null;
  balance: number;
};

type WalletContextValue = {
  wallet: WalletInfo;
  isLoading: boolean;
  connection: Connection;
  createNewWallet: () => Promise<void>;
  importWalletFromMnemonic: (mnemonic: string) => Promise<void>;
  importWalletFromPrivateKey: (priv: string) => Promise<void>;
  refreshBalanceNow: () => Promise<void>;
  sendTransaction: (to: string, amount: number) => Promise<string>;
  resetWallet: () => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: null,
    privateKey: null,
    mnemonic: null,
    balance: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  // conexión mainnet real
  const connection = new Connection(MAINNET, "confirmed");

  // ==========================================
  // Cargar wallet guardada al iniciar
  // ==========================================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hairywallet:wallet");
      if (stored) {
        const w = JSON.parse(stored) as WalletInfo;
        setWallet(w);
      }
    } catch (err) {
      console.error("Error loading wallet:", err);
    }
  }, []);

  // ==========================================
  // Guardar wallet en localStorage
  // ==========================================
  useEffect(() => {
    try {
      localStorage.setItem("hairywallet:wallet", JSON.stringify(wallet));
    } catch {}
  }, [wallet]);

  // ==========================================
  // Obtener saldo real
  // ==========================================
  const refreshBalance = async (address: string): Promise<number> => {
    try {
      const pubKey = new PublicKey(address);
      const lamports = await connection.getBalance(pubKey);
      return lamports / LAMPORTS_PER_SOL;
    } catch (err) {
      console.error("Error refreshing balance:", err);
      return 0;
    }
  };

  const refreshBalanceNow = async () => {
    if (!wallet.address) return;
    const b = await refreshBalance(wallet.address);
    setWallet((w) => ({ ...w, balance: b }));
  };

  // ==========================================
  // CREAR WALLET NUEVA REAL
  // ==========================================
  const createNewWallet = async () => {
    setIsLoading(true);
    try {
      const mnemonic = bip39.generateMnemonic(128);
      const seed = await bip39.mnemonicToSeed(mnemonic);

      const path = `m/44'/501'/0'/0'`;
      const derived = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derived);

      const balance = await refreshBalance(keypair.publicKey.toBase58());

      setWallet({
        address: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        mnemonic,
        balance,
      });
    } catch (err) {
      console.error("Error creating wallet:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // IMPORTAR DESDE MNEMONIC REAL
  // ==========================================
  const importWalletFromMnemonic = async (mnemonic: string) => {
    setIsLoading(true);
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Frase semilla inválida");
      }

      const seed = await bip39.mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/0'/0'`;
      const derived = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derived);

      const balance = await refreshBalance(keypair.publicKey.toBase58());

      setWallet({
        address: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        mnemonic,
        balance,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // IMPORTAR DESDE PRIVATE KEY REAL
  // ==========================================
  const importWalletFromPrivateKey = async (priv: string) => {
    setIsLoading(true);
    try {
      let keypair: Keypair;

      if (priv.trim().startsWith("[")) {
        const arr = JSON.parse(priv);
        keypair = Keypair.fromSecretKey(Uint8Array.from(arr));
      } else {
        const decoded = bs58.decode(priv);
        keypair = Keypair.fromSecretKey(decoded);
      }

      const balance = await refreshBalance(keypair.publicKey.toBase58());

      setWallet({
        address: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        mnemonic: null,
        balance,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ENVIAR TRANSACCIÓN REAL
  // ==========================================
  const sendTransaction = async (to: string, amount: number): Promise<string> => {
    if (!wallet.privateKey) throw new Error("Wallet no cargada");

    const fromKeypair = Keypair.fromSecretKey(bs58.decode(wallet.privateKey));
    const toPubkey = new PublicKey(to);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    try {
      const signature = await sendAndConfirmTransaction(connection, tx, [
        fromKeypair,
      ]);

      await refreshBalanceNow();

      return signature;
    } catch (err) {
      console.error("Error sending transaction:", err);
      throw new Error("No se pudo enviar la transacción");
    }
  };

  // ==========================================
  // RESETEAR WALLET
  // ==========================================
  const resetWallet = () => {
    setWallet({
      address: null,
      privateKey: null,
      mnemonic: null,
      balance: 0,
    });
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connection,
        isLoading,
        createNewWallet,
        importWalletFromMnemonic,
        importWalletFromPrivateKey,
        refreshBalanceNow,
        sendTransaction,
        resetWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet debe usarse dentro de <WalletProvider>");
  return ctx;
};
