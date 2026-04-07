import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function ExampleLayout({
  children,
  topBar,
  bottomBar,
  estimatedTopBarHeight,
  estimatedBottomBarHeight,
}: {
  children: React.ReactNode;
  topBar?: React.ReactNode;
  bottomBar?: React.ReactNode;
  estimatedTopBarHeight?: number;
  estimatedBottomBarHeight?: number;
}) {
  return (
    <ScrollEdgeBar
      style={styles.scrollEdgeBar}
      estimatedTopBarHeight={estimatedTopBarHeight}
      estimatedBottomBarHeight={estimatedBottomBarHeight}
    >
      {topBar ? (
        <ScrollEdgeBar.TopBar style={styles.topBar}>
          {topBar}
        </ScrollEdgeBar.TopBar>
      ) : null}

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {children}
      </ScrollView>

      {bottomBar ? (
        <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
          {bottomBar}
        </ScrollEdgeBar.BottomBar>
      ) : null}
    </ScrollEdgeBar>
  );
}

export const segmentedStyle = StyleSheet.create({
  segmented: { height: 32 },
}).segmented;

const styles = StyleSheet.create({
  scrollEdgeBar: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
});
