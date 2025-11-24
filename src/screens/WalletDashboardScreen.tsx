import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

const tokensMock = [
  {
    name: 'Solana',
    symbol: 'SOL',
    balance: 2.45,
    price: 145.23,
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    balance: 120.0,
    price: 1.0,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026',
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: 0.0032,
    price: 63000.75,
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026',
  },
];

const WalletDashboardScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderToken = ({ item }: { item: typeof tokensMock[0] }) => (
    <TouchableOpacity style={styles.tokenCard}>
      <View style={styles.tokenLeft}>
        <Image source={{ uri: item.logo }} style={styles.logo} />
        <View>
          <Text style={styles.tokenName}>{item.name}</Text>
          <Text style={styles.tokenSymbol}>{item.symbol}</Text>
        </View>
      </View>
      <View style={styles.tokenRight}>
        <Text style={styles.balance}>{item.balance} {item.symbol}</Text>
        <Text style={styles.price}>€ {(item.balance * item.price).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>?? Mi Wallet</Text>

      <FlatList
        data={tokensMock}
        keyExtractor={(item) => item.symbol}
        renderItem={renderToken}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Recibir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  tokenCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  tokenName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenSymbol: {
    color: '#aaa',
    fontSize: 12,
  },
  balance: {
    color: '#fff',
    fontSize: 14,
  },
  price: {
    color: '#4caf50',
    fontSize: 12,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#00c2ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 4,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WalletDashboardScreen;


