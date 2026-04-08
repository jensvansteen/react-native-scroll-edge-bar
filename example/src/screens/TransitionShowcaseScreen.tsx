import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../styles/shared';
import { transitionColors } from '../data';

export function TransitionShowcaseScreen() {
  return (
    <ScrollEdgeBar
      style={styles.container}
      estimatedTopBarHeight={48}
      estimatedBottomBarHeight={88}
    >
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <SegmentedControl
          values={['Colors', 'Gradients', 'Patterns']}
          selectedIndex={0}
          style={styles.segmentedControl}
        />
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {transitionColors.map((color, index) => (
          <View
            key={color.name}
            style={[styles.colorBlock, { backgroundColor: color.value }]}
          >
            <Text
              style={[
                styles.colorBlockLabel,
                index % 2 === 0
                  ? styles.colorBlockLabelLight
                  : styles.colorBlockLabelDark,
              ]}
            >
              {color.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
        <View style={sharedStyles.actionBar}>
          <Text style={sharedStyles.bottomLabel}>Test</Text>
          <Switch value />
          <View style={sharedStyles.spacer} />
          <View style={sharedStyles.smallButton}>
            <Text style={sharedStyles.smallButtonText}>Reset</Text>
          </View>
        </View>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}

const styles = StyleSheet.create({
  container: {
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
  segmentedControl: {
    height: 32,
  },
  colorBlock: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBlockLabel: {
    fontSize: 28,
    fontWeight: '700',
  },
  colorBlockLabelLight: {
    color: 'rgba(255,255,255,0.72)',
  },
  colorBlockLabelDark: {
    color: 'rgba(0,0,0,0.32)',
  },
});
