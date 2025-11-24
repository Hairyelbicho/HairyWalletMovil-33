import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const getRandomIndexes = (length: number, count: number) => {
  const indexes = new Set<number>();
  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * length));
  }
  return Array.from(indexes);
};

const VerifyMnemonicScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mnemonic } = route.params as { mnemonic: string };

  const words = mnemonic.split(' ');
  const [questions, setQuestions] = useState<
    { index: number; options: string[]; correct: string }[]
  >([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const questionIndexes = getRandomIndexes(words.length, 3);
    const generated = questionIndexes.map((index) => {
      const correct = words[index];
      const wrong = words.filter((w) => w !== correct).sort(() => 0.5 - Math.random()).slice(0, 2);
      const options = [correct, ...wrong].sort(() => 0.5 - Math.random());
      return { index, options, correct };
    });
    setQuestions(generated);
  }, []);

  const handleSelect = (qIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const allCorrect = questions.every((q, i) => answers[i] === q.correct);
    if (allCorrect) {
      Alert.alert('✅ Verificado', 'Has guardado tu frase correctamente.');
      navigation.navigate('WalletDashboard');
    } else {
      Alert.alert('❌ Error', 'Algunas respuestas son incorrectas. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Verifica tu frase semilla</Text>

      {questions.map((q, i) => (
        <View key={i} style={styles.questionBox}>
          <Text style={styles.label}>
            ¿Cuál es la palabra número {q.index + 1}?
          </Text>
          {q.options.map((opt, j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.option,
                answers[i] === opt && styles.optionSelected,
              ]}
              onPress={() => handleSelect(i, opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <Button title="Verificar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 10 },
  questionBox: { marginBottom: 30 },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 5,
  },
  optionSelected: {
    backgroundColor: '#cce5ff',
    borderColor: '#3399ff',
  },
  optionText: { fontSize: 16 },
});

export default VerifyMnemonicScreen;
