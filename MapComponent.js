import React from 'react';
import { Platform, View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

// Web平台使用简单的地图组件
const WebMap = ({ region, style }) => {
  // 为Web平台创建一个简单的地图视图
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${region.longitude - region.longitudeDelta}%2C${region.latitude - region.latitudeDelta}%2C${region.longitude + region.longitudeDelta}%2C${region.latitude + region.latitudeDelta}&layer=mapnik&marker=${region.latitude}%2C${region.longitude}`;
  
  if (Platform.OS === 'web') {
    // 对于Web平台，我们需要使用一个原生的iframe
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e1f5fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }
    }, React.createElement('iframe', {
      src: openStreetMapUrl,
      style: {
        width: '100%',
        height: '100%',
        border: 'none',
      },
      title: '地图'
    }));
  }

  return (
    <View style={[styles.map, { backgroundColor: '#e1f5fe', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: 18, color: '#333' }}>地图加载中...</Text>
      <Text style={{ fontSize: 14, color: '#666', marginTop: 10 }}>
        坐标: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
      </Text>
    </View>
  );
};

const MapComponent = ({ initialRegion, ...props }) => {
  const defaultRegion = {
    latitude: 39.9042,
    longitude: 116.4074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const region = initialRegion || defaultRegion;

  if (Platform.OS === 'web') {
    return <WebMap region={region} style={styles.map} />;
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsCompass={true}
      showsScale={true}
      showsBuildings={true}
      showsTraffic={false}
      showsIndoors={true}
      mapType="standard"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
  },
});

export default MapComponent; 