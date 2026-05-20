import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExerciseListScreen from './src/screens/ExerciseListScreen';
import ExerciseDetailScreen from './src/screens/ExerciseDetailScreen';

export type RootStackParamList = {
  ExerciseList: undefined;
  ExerciseDetail: { exerciseId: string; index: number; direction?: 'forward' | 'back' };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ExerciseList"
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={{ title: 'Hip Trainer' }}
        />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
            cardStyleInterpolator: () => ({}),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
