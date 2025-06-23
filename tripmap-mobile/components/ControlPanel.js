import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ControlPanel({
  exploredArea = 0,
  trackPoints = 0,
  explorationTime = '00:00',
  totalDistance = 0,
  gpsAccuracy = '未知',
}) {
  return (
    <SafeAreaView pointerEvents="box-none" style={styles.safeArea}>
      <View style={styles.panel}>
        <Text style={styles.title}>探索统计</Text>
        <View style={styles.row}><Text>已探索区域:</Text><Text style={styles.value}>{exploredArea.toFixed(1)}%</Text></View>
        <View style={styles.row}><Text>足迹点数:</Text><Text style={styles.value}>{trackPoints}</Text></View>
        <View style={styles.row}><Text>探索时长:</Text><Text style={styles.value}>{explorationTime}</Text></View>
        <View style={styles.row}><Text>移动距离:</Text><Text style={styles.value}>{totalDistance.toFixed(2)} km</Text></View>
        <View style={styles.row}><Text>GPS精度:</Text><Text style={styles.value}>{gpsAccuracy}</Text></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: undefined,
    zIndex: 1001,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  panel: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 10,
    marginRight: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: 14,
    padding: 18,
    minWidth: 220,
    borderWidth: 2,
    borderColor: '#00d4ff',
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