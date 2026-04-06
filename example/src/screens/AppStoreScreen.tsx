import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ExampleLayout, segmentedStyle } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';
import { appColors } from '../data';

export function AppStoreScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={48}
      topBar={
        <SegmentedControl
          values={['Free Apps', 'Paid Apps']}
          selectedIndex={0}
          style={segmentedStyle}
        />
      }
    >
      {Array.from({ length: 16 }).map((_, index) => (
        <View key={index} style={styles.listCard}>
          <View
            style={[
              styles.appIcon,
              { backgroundColor: appColors[index % appColors.length] },
            ]}
          />
          <View style={styles.appTextColumn}>
            <Text style={sharedStyles.cardTitle}>App {index + 1}</Text>
            <Text style={sharedStyles.cardSubtitle}>
              Top downloaded this week
            </Text>
          </View>
          <View style={sharedStyles.badgeButton}>
            <Text style={sharedStyles.badgeButtonText}>
              {index % 4 === 0 ? 'GET' : 'OPEN'}
            </Text>
          </View>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  listCard: {
    height: 92,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  appTextColumn: {
    flex: 1,
  },
});
