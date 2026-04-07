import { StyleSheet, Switch, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ExampleLayout, segmentedStyle } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';
import { transitionColors } from '../data';

export function TransitionShowcaseScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={48}
      estimatedBottomBarHeight={88}
      topBar={
        <SegmentedControl
          values={['Colors', 'Gradients', 'Patterns']}
          selectedIndex={0}
          style={segmentedStyle}
        />
      }
      bottomBar={
        <View style={sharedStyles.actionBar}>
          <Text style={sharedStyles.bottomLabel}>Test</Text>
          <Switch value />
          <View style={sharedStyles.spacer} />
          <View style={sharedStyles.smallButton}>
            <Text style={sharedStyles.smallButtonText}>Reset</Text>
          </View>
        </View>
      }
    >
      {transitionColors.map((color, index) => (
        <View
          key={color.name}
          style={[styles.colorBlock, { backgroundColor: color.value }]}
        >
          <Text
            style={[
              styles.colorBlockLabel,
              {
                color:
                  index % 2 === 0
                    ? 'rgba(255,255,255,0.72)'
                    : 'rgba(0,0,0,0.32)',
              },
            ]}
          >
            {color.name}
          </Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  colorBlock: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBlockLabel: {
    fontSize: 28,
    fontWeight: '700',
  },
});
