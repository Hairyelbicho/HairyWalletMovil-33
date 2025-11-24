import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as bip39 from 'bip39';
import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';

const CreateWalletScreen = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const generateWallet = async () => {
    try {
      const phrase = bip39.generateMnemonic();
      setMnemonic(phrase);

      const seed = await bip39.mnemonicToSeed(phrase);
      const derived = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;
      const keypair = Keypair.fromSeed(derived);
      const pubKey = keypair.publicKey.toBase58();
      setPublicKey(pubKey);

      await EncryptedStorage.setItem('mnemonic', phrase);
      await EncryptedStorage.setItem('publicKey', pubKey);

      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      try {
        const sig = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(sig, 'confirmed');
      } catch (airdropErr) {
        console.warn('⚠️ Error en airdrop:', airdropErr.message);
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Error generando wallet:', err);
      Alert.alert('Error', 'No se pudo crear la wallet');
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWallet();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={{ marginTop: 10 }}>Generando wallet...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✅ Wallet creada</Text>
      <Text style={styles.label}>Frase semilla:</Text>
      <Text selectable style={styles.text}>{mnemonic}</Text>

      <Text style={styles.label}>Dirección pública:</Text>
      <Text selectable style={styles.text}>{publicKey}</Text>

      <Button
        title="Guardar y continuar"
        onPress={() => navigation.navigate('VerifyMnemonic', { mnemonic })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  label: { fontWeight: '600', marginTop: 10 },
  text: { marginBottom: 20, color: '#333' },
});

export default CreateWalletScreen;
