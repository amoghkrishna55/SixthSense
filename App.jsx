import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './app/index';
import {Admin} from './app/admin';
import Client from './app/client';
import {Check} from './app/check';
import Location from './app/location/index';
// import Vision from './app/vision';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Intersection" component={Main} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="Client" component={Client} />
        <Stack.Screen name="Check" component={Check} />
        <Stack.Screen name="Location" component={Location} />
        {/* <Stack.Screen name="Vision" component={Vision} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;