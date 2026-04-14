import { ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Button, HStack, Host, Spacer, Text, Toggle } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
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
            <RNText
              style={[
                styles.colorBlockLabel,
                index % 2 === 0
                  ? styles.colorBlockLabelLight
                  : styles.colorBlockLabelDark,
              ]}
            >
              {color.name}
            </RNText>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBarHost}>
        <Host matchContents={{ vertical: true }} style={styles.bottomBarHost}>
          <HStack
            spacing={12}
            alignment="center"
            modifiers={[padding({ horizontal: 16, vertical: 12 })]}
          >
            <Text
              modifiers={[
                font({ size: 15, weight: 'semibold' }),
                foregroundStyle({ type: 'hierarchical', style: 'primary' }),
              ]}
            >
              Test
            </Text>
            <Toggle isOn />
            <Spacer />
            <Button
              label="Reset"
              modifiers={[buttonStyle('bordered'), controlSize('small')]}
            />
          </HStack>
        </Host>
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
  bottomBarHost: {
    width: '100%',
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
