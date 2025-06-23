import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import MapComponent from './MapComponent';

export default function App() {
  // 默认显示北京的坐标
  const initialRegion = {
    latitude: 39.9042,
    longitude: 116.4074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapComponent initialRegion={initialRegion} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
