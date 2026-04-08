import {
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../styles/shared';

export function ToolbarScreen() {
  return (
    <ScrollEdgeBar style={styles.container} estimatedBottomBarHeight={72}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {Array.from({ length: 24 }).map((_, index) => (
          <View key={index} style={styles.toolbarCard}>
            <Text style={sharedStyles.cardTitle}>Item {index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
        <View style={sharedStyles.actionBar}>
          <Text style={sharedStyles.bottomLabel}>30 items</Text>
          <View style={sharedStyles.spacer} />
          <View style={sharedStyles.smallButton}>
            <Text style={sharedStyles.smallButtonText}>Select All</Text>
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
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  toolbarCard: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 14,
    backgroundColor: DynamicColorIOS({ light: '#f2f2f4', dark: '#1f1f22' }),
  },
});
