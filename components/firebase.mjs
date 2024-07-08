import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDaCUDrdkmsUqED8YP2Or9g1U4UPeMIfD4",
  authDomain: "sixthsense-3d1cb.firebaseapp.com",
  databaseURL: "https://sixthsense-3d1cb-default-rtdb.firebaseio.com",
  projectId: "sixthsense-3d1cb",
  storageBucket: "sixthsense-3d1cb.appspot.com",
  messagingSenderId: "659842524114",
  appId: "1:659842524114:web:671461303ec47986905e0b",
  measurementId: "G-ESGWHET67E",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

const readWholeData = () => {
  const rootRef = ref(database); // Reference to the root of the database
  // get(rootRef)
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val()); // This will log the entire database
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  onValue(rootRef, (snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val()); // This will log the entire database
    } else {
      console.log("No data available");
    }
  });
};

// Example usage
readWholeData();
