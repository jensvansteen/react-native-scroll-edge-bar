import {
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../styles/shared';

export function SearchBarScreen() {
  return (
    <ScrollEdgeBar style={styles.container} estimatedTopBarHeight={48}>
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <SegmentedControl
          values={['All', 'Recent', 'Favorites']}
          selectedIndex={0}
          style={styles.segmentedControl}
        />
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {Array.from({ length: 30 }).map((_, index) => (
          <View key={index} style={styles.searchResultRow}>
            <Text style={sharedStyles.cardTitle}>Result {index + 1}</Text>
          </View>
        ))}
      </ScrollView>
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
  segmentedControl: {
    height: 32,
  },
  searchResultRow: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
});
