import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue, update} from 'firebase/database';
import Toast from 'react-native-toast-message';
import {Alert} from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyDaCUDrdkmsUqED8YP2Or9g1U4UPeMIfD4',
  authDomain: 'sixthsense-3d1cb.firebaseapp.com',
  databaseURL: 'https://sixthsense-3d1cb-default-rtdb.firebaseio.com',
  projectId: 'sixthsense-3d1cb',
  storageBucket: 'sixthsense-3d1cb.appspot.com',
  messagingSenderId: '659842524114',
  appId: '1:659842524114:web:671461303ec47986905e0b',
  measurementId: 'G-ESGWHET67E',
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
let unsubscribe = null;

export const attachListener = () => {
  const rootRef = ref(database);
  console.log('Attaching listener');

  try {
    unsubscribe = onValue(rootRef, snapshot => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        if (snapshot.val().sos === 1) {
          console.log('SOS received');
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'SOS received',
            text2: 'Please check the location',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
          });
          Alert.alert(
            'SOS received',
            'Please check the location',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('OK Pressed');
                  update(rootRef, {sos: 0})
                    .catch(error => console.error('Update failed:', error))
                    .then(() => console.log('SOS received from firebase.mjs'));
                },
              },
            ],
            {cancelable: false},
          );
        }
      } else {
        console.log('No data available');
      }
    });
  } catch (e) {
    console.log(e);
  }
};

export const runSOS = () => {
  const rootRef = ref(database);
  update(rootRef, {sos: 1})
    .catch(error => console.error('Update failed:', error))
    .then(() => console.log('SOS sent from firebase.mjs'));
};

export const detachListener = () => {
  if (unsubscribe) {
    console.log('Detaching listener');
    try {
      unsubscribe();
    } catch (e) {
      console.log(e);
    }
    unsubscribe = null;
  } else {
    console.log('No active listener to detach');
  }
};
