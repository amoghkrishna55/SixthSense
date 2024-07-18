import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './app/index';
import {Admin} from './app/admin';
import Client from './app/client';
import {Check} from './app/check';
import Location from './app/location/index';
import Boundary from './app/boundary';
import Message from './app/message';
import ReadMessage from './app/readMessage';
import SendMessage from './app/sendMessage';
import Inbox from './app/inbox';
import Vision from './app/vision';
import PermissionsHandler from './components/permissionHandler';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PermissionsHandler>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Intersection" component={Main} />
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="Client" component={Client} />
          <Stack.Screen name="Check" component={Check} />
          <Stack.Screen name="Location" component={Location} />
          <Stack.Screen name="Boundary" component={Boundary} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="ReadMessage" component={ReadMessage} />
          <Stack.Screen name="SendMessage" component={SendMessage} />
          <Stack.Screen name="Inbox" component={Inbox} />
          <Stack.Screen name="Vision" component={Vision} />
        </Stack.Navigator>
      </NavigationContainer>
    </PermissionsHandler>
  );
}

export default App;
