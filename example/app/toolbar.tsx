import { Stack } from 'expo-router';
import {
  Alert,
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../src/styles/shared';

export default function ToolbarScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 44;

  return (
    <>
      <Stack.Toolbar>
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          onPress={() => Alert.alert('Share')}
        >
          Share
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon="trash"
          onPress={() => Alert.alert('Delete')}
        >
          Delete
        </Stack.Toolbar.Button>
      </Stack.Toolbar>

      <ScrollEdgeBar
        style={styles.container}
        estimatedTopBarHeight={headerHeight}
        estimatedBottomBarHeight={72}
      >
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
    </>
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
