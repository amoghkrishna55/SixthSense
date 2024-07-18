import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

const PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
];

const PERMISSION_MESSAGES = {
  [PermissionsAndroid.PERMISSIONS.CAMERA]: {
    title: 'Camera Permission',
    message:
      'This app needs access to your camera to capture images and video.',
    icon: 'camera-outline',
  },
  [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO]: {
    title: 'Microphone Permission',
    message: 'This app needs access to your microphone to record audio.',
    icon: 'mic-outline',
  },
  [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]: {
    title: 'Precise Location Permission',
    message:
      'This app needs access to your precise location for location-based features.',
    icon: 'location-outline',
  },
  [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]: {
    title: 'Approximate Location Permission',
    message:
      'This app needs access to your approximate location for location-based features.',
    icon: 'navigate-outline',
  },
};

const requestPermission = async permission => {
  try {
    const granted = await PermissionsAndroid.request(permission, {
      title: PERMISSION_MESSAGES[permission].title,
      message: PERMISSION_MESSAGES[permission].message,
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export default function PermissionsHandler({children}) {
  const [permissionStatus, setPermissionStatus] = useState({});

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const status = {};
    for (const permission of PERMISSIONS) {
      status[permission] = await PermissionsAndroid.check(permission);
    }
    setPermissionStatus(status);
  };

  const handlePermissionRequest = async permission => {
    const granted = await requestPermission(permission);
    setPermissionStatus(prev => ({...prev, [permission]: granted}));
  };

  const allPermissionsGranted = Object.values(permissionStatus).every(
    status => status === true,
  );

  if (!allPermissionsGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.pipingTop} />
        <View style={styles.pipingBottom} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>App Permissions</Text>
          {PERMISSIONS.map(permission => (
            <View key={permission} style={styles.permissionItem}>
              <Ionicons
                name={PERMISSION_MESSAGES[permission].icon}
                size={40}
                color="#4A90E2"
              />
              <View style={styles.permissionText}>
                <Text style={styles.title}>
                  {PERMISSION_MESSAGES[permission].title}
                </Text>
                <Text style={styles.message}>
                  {PERMISSION_MESSAGES[permission].message}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.grantButton,
                  permissionStatus[permission] ? styles.grantedButton : {},
                ]}
                onPress={() => handlePermissionRequest(permission)}
                disabled={permissionStatus[permission]}>
                <Text style={styles.buttonText}>
                  {permissionStatus[permission] ? 'Granted' : 'Grant'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  permissionText: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  grantButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  grantedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pipingTop: {
    height: 5,
    backgroundColor: '#4A90E2',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  pipingBottom: {
    height: 5,
    backgroundColor: '#4A90E2',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
