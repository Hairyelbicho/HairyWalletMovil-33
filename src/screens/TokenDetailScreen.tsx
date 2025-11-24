import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-svg-charts';

const TokenDetailScreen = ({ route }: any) => {
  const { symbol, name, logo } = route.params;
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=eur`
      );
      const val = res.data[symbol.toLowerCase()]?.eur;
      setPrice(val ?? 0);
      generateMockChart();
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener precio:', err);
      setLoading(false);
    }
  };

  const generateMockChart = () => {
    const mock = Array.from({ length: 24 }, () => Math.random() * 100 + 20);
    setChartData(mock);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00c2ff" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: logo }} style={styles.logo} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>({symbol})</Text>
        <Text style={styles.price}>€ {price?.toFixed(3)}</Text>
      </View>

      <Text style={styles.chartTitle}>Últimas 24h</Text>
      <LineChart
        style={styles.chart}
        data={chartData}
        svg={{ stroke: '#00c2ff', strokeWidth: 2 }}
        contentInset={{ top: 20, bottom: 20 }}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Comprar</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Vender</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Intercambiar</Text></TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#333' }]}
          onPress={() =>
            console.log(`Abrir en Solscan: https://solscan.io/token/${symbol}`)
          }
        >
          <Text style={styles.buttonText}>Ver en Solscan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 60, height: 60, marginBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  symbol: { fontSize: 14, color: '#aaa' },
  price: { fontSize: 22, color: '#00ffcc', marginTop: 10 },
  chartTitle: { fontSize: 16, color: '#aaa', marginBottom: 10 },
  chart: { height: 150 },
  buttonsContainer: {
    marginTop: 30,
    gap: 12,
  },
  button: {
    backgroundColor: '#00c2ff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default TokenDetailScreen;