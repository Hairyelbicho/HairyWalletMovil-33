import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreateWalletScreen from '../screens/CreateWalletScreen';
import VerifyMnemonicScreen from '../screens/VerifyMnemonicScreen';
import WalletDashboardScreen from '../screens/WalletDashboardScreen';
import TokenDetailScreen from '../screens/TokenDetailScreen';
import ImportWalletScreen from '../screens/ImportWalletScreen'; // ✅ NUEVO
import ReceiveScreen from '../screens/ReceiveScreen'; // ✅ NUEVO

export type RootStackParamList = {
  CreateWallet: undefined;
  VerifyMnemonic: { mnemonic: string };
  WalletDashboard: undefined;
  TokenDetail: { name: string; symbol: string; logo: string };
  ImportWallet: undefined; // ✅ AÑADIDO
  Receive: { address: string }; // ✅ AÑADIDO
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CreateWallet"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="VerifyMnemonic" component={VerifyMnemonicScreen} />
      <Stack.Screen name="WalletDashboard" component={WalletDashboardScreen} />
      <Stack.Screen name="TokenDetail" component={TokenDetailScreen} />
      <Stack.Screen name="ImportWallet" component={ImportWalletScreen} /> {/* ✅ */}
      <Stack.Screen name="Receive" component={ReceiveScreen} /> {/* ✅ */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
