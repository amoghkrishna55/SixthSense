import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue, update, off} from 'firebase/database';

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

  unsubscribe = onValue(rootRef, snapshot => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log('No data available');
    }
  });
};

export const runSOS = () => {
  const rootRef = ref(database);
  update(rootRef, {sos: 0})
    .catch(error => console.error('Update failed:', error))
    .then(() => console.log('SOS sent from firebase.mjs'));
};

export const detachListener = () => {
  const rootRef = ref(database);
  if (unsubscribe) {
    console.log('Detaching listener');
    unsubscribe();
    unsubscribe = null;
  } else {
    console.log('No active listener to detach');
  }
};
