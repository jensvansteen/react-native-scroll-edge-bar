import {
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { sharedStyles } from '../styles/shared';

export function PrDetailScreen() {
  return (
    <ScrollEdgeBar
      style={styles.container}
      estimatedTopBarHeight={70}
      estimatedBottomBarHeight={88}
    >
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            alexjohnson requested your review
          </Text>
          <View style={sharedStyles.badgeButton}>
            <Text style={sharedStyles.badgeButtonText}>Review</Text>
          </View>
        </View>
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {Array.from({ length: 10 }).map((_, index) => (
          <View key={index} style={styles.detailBlock}>
            <Text style={styles.sectionTitle}>Section {index + 1}</Text>
            <Text style={styles.sectionBody}>
              This is placeholder content for the PR detail example. The goal is
              to verify top and bottom edge bars against long scrolling content.
            </Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
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
      </ScrollEdgeBar.BottomBar>
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
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
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
