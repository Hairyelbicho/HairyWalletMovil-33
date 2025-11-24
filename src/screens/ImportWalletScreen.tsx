import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { importWalletFromMnemonic, saveWallet } from '../services/wallet';

const ImportWalletScreen = ({ navigation }) => {
  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState('');

  const handleImport = async () => {
    try {
      const keypair = importWalletFromMnemonic(mnemonic.trim());
      await saveWallet(keypair.publicKey.toBase58(), mnemonic.trim());
      alert('Wallet importada correctamente');
      navigation.navigate('WalletDashboard');
    } catch (err) {
      console.error(err);
      setError('Frase inválida. Asegúrate de que esté bien copiada.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Importar Wallet</Text>
      <TextInput
        style={styles.input}
        placeholder="Pega tu clave privada o semilla"
        value={mnemonic}
        onChangeText={setMnemonic}
        multiline
      />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Button title="Importar" onPress={handleImport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
    height: 100,
    textAlignVertical: 'top'
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
});

export default ImportWalletScreen;


