import {
  FlatList,
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SFSymbolView, SFSymbolWeight } from 'react-native-nitro-sfsymbols';
import { exampleList } from '../data';

export function ExampleMenuScreen({ navigation }: { navigation: any }) {
  return (
    <FlatList
      data={exampleList}
      keyExtractor={(item) => item.key}
      style={styles.menuList}
      contentContainerStyle={styles.menuContent}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.push('Example', { key: item.key })}
          style={({ pressed }) => [
            styles.menuItem,
            pressed && styles.menuItemPressed,
          ]}
        >
          <SFSymbolView
            name={item.symbol}
            size={24}
            tintColor="#007AFF"
            weight={SFSymbolWeight.REGULAR}
          />
          <View style={styles.menuTextColumn}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.menuChevronWrap}>
            <SFSymbolView
              name="chevron.right"
              size={13}
              tintColor="tertiaryLabel"
              weight={SFSymbolWeight.REGULAR}
            />
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  menuList: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  menuContent: {
    paddingBottom: 24,
  },
  menuItem: {
    minHeight: 78,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PlatformColor('separator'),
    backgroundColor: PlatformColor('systemBackground'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemPressed: {
    opacity: 0.72,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  menuTextColumn: {
    flex: 1,
    paddingRight: 12,
    paddingLeft: 16,
  },
  menuTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  menuSubtitle: {
    marginTop: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: PlatformColor('secondaryLabel'),
  },
  menuChevronWrap: {
    width: 24,
    alignItems: 'flex-end',
  },
});
