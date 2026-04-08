import {
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SFSymbolView, SFSymbolWeight } from 'react-native-nitro-sfsymbols';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

const prItems = [
  {
    title: 'Feat - 134 refactor onboarding flow',
    repo: 'acme / webapp',
    age: '3d',
  },
  {
    title: 'Add automated welcome email on signup',
    repo: 'acme / webapp',
    age: '5d',
  },
  {
    title: 'Settings - redesign preferences page',
    repo: 'acme / webapp',
    age: '8d',
  },
  {
    title: 'User profile editing and avatar upload',
    repo: 'acme / webapp',
    age: '12d',
  },
  { title: 'Feat/add-event-filters', repo: 'acme / webapp', age: '14d' },
  {
    title: 'Feat: add blur effect to navigation bar',
    repo: 'acme / webapp',
    age: '18d',
  },
  {
    title: 'Integrate rate limiting middleware',
    repo: 'acme / backend',
    age: '22d',
  },
];

const filterChips = ['Open', 'Involved', 'Visibility', 'Org'];

export function PullRequestsScreen() {
  return (
    <ScrollEdgeBar style={styles.container} estimatedTopBarHeight={56}>
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <View style={styles.filterIconWrap}>
            <SFSymbolView
              name="line.3.horizontal.decrease.circle"
              size={20}
              tintColor="#007aff"
              weight={SFSymbolWeight.REGULAR}
            />
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>1</Text>
            </View>
          </View>
          {filterChips.map((chip, index) => (
            <View
              key={chip}
              style={[styles.chip, index === 1 ? styles.chipActive : undefined]}
            >
              <Text
                style={[
                  styles.chipText,
                  index === 1 ? styles.chipTextActive : undefined,
                ]}
              >
                {chip}
              </Text>
              <SFSymbolView
                name="chevron.down"
                size={10}
                tintColor={index === 1 ? '#34c759' : '#8e8e93'}
                weight={SFSymbolWeight.SEMIBOLD}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {prItems.map((item, index) => (
          <View key={index} style={styles.prRow}>
            <SFSymbolView
              name="arrow.triangle.pull"
              size={16}
              tintColor="#34c759"
              weight={SFSymbolWeight.MEDIUM}
            />
            <View style={styles.prContent}>
              <Text style={styles.prTitle}>{item.title}</Text>
              <Text style={styles.prMeta}>
                {item.repo} · {item.age}
              </Text>
            </View>
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
  chipsRow: {
    gap: 8,
    paddingRight: 16,
    alignItems: 'center',
  },
  filterIconWrap: {
    marginRight: 4,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: DynamicColorIOS({ light: '#d1d5db', dark: '#3a3a3c' }),
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
  chipActive: {
    backgroundColor: 'rgba(52,199,89,0.12)',
    borderColor: '#34c759',
  },
  chipText: {
    fontSize: 14,
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  chipTextActive: {
    color: '#34c759',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DynamicColorIOS({ light: '#e5e5ea', dark: '#2c2c2e' }),
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
  prContent: {
    flex: 1,
    gap: 3,
  },
  prTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  prMeta: {
    fontSize: 13,
    color: DynamicColorIOS({ light: '#666666', dark: '#a1a1aa' }),
  },
});
