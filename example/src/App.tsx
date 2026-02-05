import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollEdgeBar style={styles.scrollEdgeBar}>
        <ScrollEdgeBar.TopBar>
          <View style={styles.topBar}>
            <SegmentedControl
              values={['Free', 'Paid']}
              selectedIndex={0}
              style={styles.segmented}
            />
          </View>
        </ScrollEdgeBar.TopBar>

        <ScrollView>
          {Array.from({ length: 50 }).map((_, i) => (
            <View key={i} style={styles.item}>
              <Text>Item {i + 1}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollEdgeBar.BottomBar>
          <View style={styles.bottomBar}>
            <Text style={styles.bottomBarText}>Bottom Bar</Text>
          </View>
        </ScrollEdgeBar.BottomBar>
      </ScrollEdgeBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollEdgeBar: {
    flex: 1,
  },
  topBar: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'red',
  },
  segmented: {
    height: 32,
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  bottomBarText: {
    fontSize: 16,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
