import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import { ExampleLayout } from '../components/ExampleLayout';
import { sharedStyles } from '../styles/shared';

export function PrDetailScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={70}
      estimatedBottomBarHeight={88}
      topBar={
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            alexjohnson requested your review
          </Text>
          <View style={sharedStyles.badgeButton}>
            <Text style={sharedStyles.badgeButtonText}>Review</Text>
          </View>
        </View>
      }
      bottomBar={
        <View style={sharedStyles.actionBar}>
          <Text style={sharedStyles.bottomLabel}>2 comments</Text>
          <View style={styles.actionButtons}>
            <View style={sharedStyles.smallButton}>
              <Text style={sharedStyles.smallButtonText}>Info</Text>
            </View>
            <View style={sharedStyles.smallButtonPrimary}>
              <Text style={sharedStyles.smallButtonPrimaryText}>Comment</Text>
            </View>
          </View>
        </View>
      }
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <View key={index} style={styles.detailBlock}>
          <Text style={styles.sectionTitle}>Section {index + 1}</Text>
          <Text style={styles.sectionBody}>
            This is placeholder content for the PR detail example. The goal is
            to verify top and bottom edge bars against long scrolling content.
          </Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  actionButtons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 10,
  },
  detailBlock: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#f7f7f8', dark: '#17171a' }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  sectionBody: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: DynamicColorIOS({ light: '#444444', dark: '#d4d4d8' }),
  },
});
