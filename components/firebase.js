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
import {FIREBASE_CONFIG} from '@env';

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

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

export const getAdminPassword = async () => {
  const passwordRef = ref(database, '/adminPassword');
  try {
    const snapshot = await get(passwordRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No password found');
      return '';
    }
  } catch (error) {
    console.error('Error getting password:', error);
    throw error;
  }
};

export const updateAdminPassword = password => {
  const passwordRef = ref(database);
  try {
    update(passwordRef, {adminPassword: password}).then(() =>
      console.log('Password updated successfully'),
    );
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
