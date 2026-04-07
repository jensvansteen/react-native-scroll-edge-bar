import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ExampleLayout, segmentedStyle } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';

export function TabAccessoryScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={48}
      estimatedBottomBarHeight={120}
      topBar={
        <SegmentedControl
          values={['All Songs', 'Albums', 'Artists']}
          selectedIndex={0}
          style={segmentedStyle}
        />
      }
      bottomBar={
        <View style={styles.tabAccessoryBar}>
          <Text style={sharedStyles.bottomLabel}>Now Playing</Text>
          <Text style={styles.accessorySubtitle}>Neon Skyline - Luna Park</Text>
          <View style={styles.accessoryControls}>
            <View style={sharedStyles.smallButton}>
              <Text style={sharedStyles.smallButtonText}>Shuffle</Text>
            </View>
            <View style={sharedStyles.smallButtonPrimary}>
              <Text style={sharedStyles.smallButtonPrimaryText}>Play</Text>
            </View>
          </View>
        </View>
      }
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <View key={index} style={styles.songRow}>
          <Text style={sharedStyles.cardTitle}>Track {index + 1}</Text>
          <Text style={sharedStyles.cardSubtitle}>Artist name</Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  tabAccessoryBar: {
    gap: 10,
  },
  accessorySubtitle: {
    fontSize: 13,
    color: DynamicColorIOS({ light: '#666666', dark: '#a1a1aa' }),
  },
  accessoryControls: {
    flexDirection: 'row',
    gap: 10,
  },
  songRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
});
