import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import { ExampleLayout } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';

export function ToolbarScreen() {
  return (
    <ExampleLayout
      estimatedBottomBarHeight={72}
      bottomBar={
        <View style={sharedStyles.actionBar}>
          <Text style={sharedStyles.bottomLabel}>30 items</Text>
          <View style={sharedStyles.spacer} />
          <View style={sharedStyles.smallButton}>
            <Text style={sharedStyles.smallButtonText}>Select All</Text>
          </View>
        </View>
      }
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <View key={index} style={styles.toolbarCard}>
          <Text style={sharedStyles.cardTitle}>Item {index + 1}</Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  toolbarCard: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 14,
    backgroundColor: DynamicColorIOS({ light: '#f2f2f4', dark: '#1f1f22' }),
  },
});
