import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ControlPanel({
  exploredArea = 0,
  trackPoints = 0,
  explorationTime = '00:00',
  totalDistance = 0,
  gpsAccuracy = '未知',
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>探索统计</Text>
      <View style={styles.row}><Text>已探索区域:</Text><Text style={styles.value}>{exploredArea.toFixed(1)}%</Text></View>
      <View style={styles.row}><Text>足迹点数:</Text><Text style={styles.value}>{trackPoints}</Text></View>
      <View style={styles.row}><Text>探索时长:</Text><Text style={styles.value}>{explorationTime}</Text></View>
      <View style={styles.row}><Text>移动距离:</Text><Text style={styles.value}>{totalDistance.toFixed(2)} km</Text></View>
      <View style={styles.row}><Text>GPS精度:</Text><Text style={styles.value}>{gpsAccuracy}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 16,
    minWidth: 220,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  value: {
    color: '#00ff88',
    fontWeight: 'bold',
  },
}); 