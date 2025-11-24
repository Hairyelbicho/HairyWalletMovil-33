import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

type ReceiveRouteProp = RouteProp<RootStackParamList, 'Receive'>;

const ReceiveScreen: React.FC = () => {
  const route = useRoute<ReceiveRouteProp>();
  const address = route.params.address;

  const handleCopy = () => {
    Clipboard.setString(address);
    Alert.alert('Copiado', 'Dirección copiada al portapapeles');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recibir fondos</Text>
      <QRCode value={address} size={200} />
      <Text style={styles.address}>{address}</Text>
      <TouchableOpacity onPress={handleCopy} style={styles.button}>
        <Text style={styles.buttonText}>Copiar dirección</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  address: { fontSize: 14, marginVertical: 20, textAlign: 'center' },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  buttonText: { color: 'white', fontWeight: 'bold' }
});

export default ReceiveScreen;


