import {
  DynamicColorIOS,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../styles/shared';
import { appColors } from '../data';

export function AppStoreScreen() {
  return (
    <ScrollEdgeBar style={styles.container} estimatedTopBarHeight={48}>
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <SegmentedControl
          values={['Free Apps', 'Paid Apps']}
          selectedIndex={0}
          style={styles.segmentedControl}
        />
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.screenBackground}>
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
        </View>
      </ScrollView>
    </ScrollEdgeBar>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  segmentedControl: {
    height: 32,
  },
  screenBackground: {
    flex: 1,
    backgroundColor: PlatformColor('systemGroupedBackground'),
  },
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
