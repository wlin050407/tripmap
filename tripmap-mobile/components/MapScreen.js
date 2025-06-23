import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import ControlPanel from './ControlPanel';

const { width, height } = Dimensions.get('window');
const MAX_INTERVAL = 60 * 1000; // 60秒断点
const MAX_SEGMENT_POINTS = 200; // 每段最多200个点，防止极端情况

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackSegments, setTrackSegments] = useState([[]]); // 轨迹分段
  const watchId = useRef(null);
  // 统计数据
  const [explorationTime, setExplorationTime] = useState('00:00');
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('权限被拒绝', '需要定位权限才能使用地图功能');
          setLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High, timeout: 10000 });
        if (isMounted) {
          setLocation(loc.coords);
          setLoading(false);
        }
        // 启动持续定位监听
        watchId.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 1 },
          (pos) => {
            setLocation(pos.coords);
            setTrackSegments((prev) => {
              const now = Date.now();
              let segments = [...prev];
              let lastSegment = segments[segments.length - 1];
              if (!lastSegment) lastSegment = [];
              const lastPoint = lastSegment.length > 0 ? lastSegment[lastSegment.length - 1] : null;
              const newPoint = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                timestamp: now,
                accuracy: pos.coords.accuracy
              };
              // 只记录精度较好且移动超过5米的点，过滤极端坐标
              if (
                pos.coords.accuracy > 50 ||
                Math.abs(newPoint.latitude) > 90 ||
                Math.abs(newPoint.longitude) > 180
              ) return segments;
              if (lastPoint) {
                const dist = getDistance(lastPoint, newPoint);
                if (dist < 5 || dist > 2000) return segments; // 过滤极端跳变
                // 断点分段
                if (now - lastPoint.timestamp > MAX_INTERVAL) {
                  segments.push([newPoint]);
                } else {
                  if (lastSegment.length < MAX_SEGMENT_POINTS) {
                    lastSegment.push(newPoint);
                    segments[segments.length - 1] = lastSegment;
                  } else {
                    // 超过最大点数自动新开一段
                    segments.push([newPoint]);
                  }
                }
              } else {
                lastSegment.push(newPoint);
                segments[segments.length - 1] = lastSegment;
              }
              return segments;
            });
          }
        );
      } catch (e) {
        Alert.alert('定位失败', '无法获取当前位置，请检查定位权限或模拟器设置。');
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
      if (watchId.current) watchId.current.remove();
    };
  }, []);

  // 计算两点距离（米）
  function getDistance(p1, p2) {
    const R = 6371000;
    const dLat = (p2.latitude - p1.latitude) * Math.PI / 180;
    const dLng = (p2.longitude - p1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(p1.latitude * Math.PI / 180) * Math.cos(p2.latitude * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setExplorationTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // 统计点数、距离、已探索区域、精度
  let totalPoints = 0, totalDistance = 0, lastPoint = null, gpsAccuracy = '未知';
  trackSegments.forEach(segment => {
    totalPoints += segment.length;
    for (let i = 1; i < segment.length; i++) {
      totalDistance += getDistance(segment[i - 1], segment[i]) / 1000;
    }
    if (segment.length > 0) lastPoint = segment[segment.length - 1];
  });
  const exploredArea = Math.min(100, totalPoints * 0.1); // 简化算法
  if (lastPoint && lastPoint.accuracy !== undefined) {
    const acc = lastPoint.accuracy;
    if (acc > 50) gpsAccuracy = `${acc.toFixed(1)}米 (差)`;
    else if (acc > 20) gpsAccuracy = `${acc.toFixed(1)}米 (一般)`;
    else if (acc > 10) gpsAccuracy = `${acc.toFixed(1)}米 (良好)`;
    else gpsAccuracy = `${acc.toFixed(1)}米 (优秀)`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: location ? location.latitude : 39.9042,
          longitude: location ? location.longitude : 116.4074,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* 渲染分段轨迹，过滤异常段 */}
        {trackSegments.map((segment, idx) =>
          segment.length > 1 && segment.length < MAX_SEGMENT_POINTS ? (
            <Polyline
              key={idx}
              coordinates={segment}
              strokeColor="#00d4ff"
              strokeWidth={5}
            />
          ) : null
        )}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="当前位置"
            pinColor="#00d4ff"
          />
        )}
      </MapView>
      <Text style={{
        position: 'absolute',
        top: 200,
        left: 20,
        zIndex: 3000,
        color: 'red',
        fontSize: 32,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'red',
        padding: 8
      }}>
        TEST
      </Text>
      <ControlPanel
        exploredArea={exploredArea}
        trackPoints={totalPoints}
        explorationTime={explorationTime}
        totalDistance={totalDistance}
        gpsAccuracy={gpsAccuracy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 