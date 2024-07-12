import {initializeApp} from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  update,
  child,
  get,
  push,
} from 'firebase/database';
import {getStorage} from 'firebase/storage';
import {Alert} from 'react-native';
import * as Device from 'expo-device';

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
export const storage = getStorage(app);
let unsubscribe = null;

export const attachListener = () => {
  const rootRef = ref(database);
  console.log('Attaching listener');

  try {
    unsubscribe = onValue(rootRef, snapshot => {
      if (snapshot.exists()) {
        console.log('Data Updated running on Admin');
        if (snapshot.val().sos === 1) {
          console.log('SOS received');
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
export const updateStatus = () => {
  const db = getDatabase();
  const messagesRef = ref(db, 'messages');

  get(child(messagesRef, '/'))
    .then(snapshot => {
      if (snapshot.exists()) {
        const updates = {};
        snapshot.forEach(childSnapshot => {
          const key = childSnapshot.key;
          updates[`/messages/${key}/status`] = 'unread';
        });

        update(ref(db), updates)
          .then(() => console.log('All messages updated to read.'))
          .catch(error =>
            console.error('Error updating message statuses: ', error),
          );
      } else {
        console.log('No messages found.');
      }
    })
    .catch(error => {
      console.error('Error reading messages: ', error);
    });
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

export const uploadedAudio = async uri => {
  const audioRef = ref(database, '/audio');

  try {
    const newAudioRef = await push(audioRef, {
      uri,
      date: new Date().getTime(),
      status: 'unread',
    });
    console.log('Audio uploaded with key to database:', newAudioRef.key);
  } catch (error) {
    console.error('Failed to upload audio to database:', error);
    throw error;
  }
};

export const updateDevice = stat => {
  if (stat === true) {
    const deviceRef = ref(database, '/device');
    update(deviceRef, {
      deviceName: Device.deviceName,
      modelName: Device.modelName,
    })
      .then(() => console.log('Device status updated to online'))
      .catch(error => console.error('Error updating device status:', error));
  } else {
    const deviceRef = ref(database, '/device');
    update(deviceRef, {
      deviceName: '',
      modelName: '',
    })
      .then(() => console.log('Device status updated to online'))
      .catch(error => console.error('Error updating device status:', error));
  }
};
