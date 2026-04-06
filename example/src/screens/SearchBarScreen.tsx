import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ExampleLayout, segmentedStyle } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';

export function SearchBarScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={48}
      topBar={
        <SegmentedControl
          values={['All', 'Recent', 'Favorites']}
          selectedIndex={0}
          style={segmentedStyle}
        />
      }
    >
      {Array.from({ length: 30 }).map((_, index) => (
        <View key={index} style={styles.searchResultRow}>
          <Text style={sharedStyles.cardTitle}>Result {index + 1}</Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  searchResultRow: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
});
