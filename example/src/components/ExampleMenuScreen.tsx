import {
  DynamicColorIOS,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SFSymbolView, SFSymbolWeight } from 'react-native-nitro-sfsymbols';
import { exampleList } from '../data';

export function ExampleMenuScreen({ navigation }: { navigation: any }) {
  return (
    <ScrollView style={styles.menuScrollView}>
      {exampleList.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => navigation.push('Example', { key: item.key })}
          style={styles.menuItem}
        >
          <View
            style={[styles.menuIconWrap, { borderColor: `${item.tint}33` }]}
          >
            <SFSymbolView
              name={item.symbol}
              size={18}
              tintColor={item.tint}
              weight={SFSymbolWeight.REGULAR}
            />
          </View>
          <View style={styles.menuTextColumn}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          <Text style={styles.menuChevron}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuScrollView: {
    flex: 1,
    backgroundColor: DynamicColorIOS({ light: '#f2f2f7', dark: '#000000' }),
  },
  menuItem: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DynamicColorIOS({ light: '#d1d1d6', dark: '#2c2c2e' }),
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1c1c1e' }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrap: {
    width: 30,
    height: 30,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: DynamicColorIOS({ light: '#f8f8f8', dark: '#2a2a2d' }),
  },
  menuTextColumn: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  menuSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: DynamicColorIOS({ light: '#6d6d72', dark: '#8e8e93' }),
  },
  menuChevron: {
    marginLeft: 12,
    fontSize: 24,
    lineHeight: 24,
    color: DynamicColorIOS({ light: '#c7c7cc', dark: '#636366' }),
  },
});
