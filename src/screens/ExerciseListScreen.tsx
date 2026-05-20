import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import exercises from '../../data/exercises.json';
import { Exercise } from '../types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ExerciseList'>;
};

const exerciseList = exercises as Exercise[];

export default function ExerciseListScreen({ navigation }: Props) {
  const navigateToExercise = (index: number) => {
    navigation.navigate('ExerciseDetail', {
      exerciseId: exerciseList[index].id,
      index,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={exerciseList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigateToExercise(index)}
          >
            <Text style={styles.indexText}>{index + 1}</Text>
            <View style={styles.rowContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.muscles}>{item.targetMuscles.join(', ')}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigateToExercise(0)}
        >
          <Text style={styles.startButtonText}>Start Routine</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  indexText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#aaa',
    width: 28,
  },
  rowContent: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
  },
  muscles: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: '#ccc',
  },
  separator: {
    height: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f8f8f8',
  },
  startButton: {
    backgroundColor: '#2a7aef',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
