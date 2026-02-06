import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

enableScreens();

const Stack = createNativeStackNavigator();
const Tabs = createNativeBottomTabNavigator();

function ExampleScreen() {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = React.useContext(BottomTabBarHeightContext) ?? 0;
  const insets = useSafeAreaInsets();
  const topOffset = Math.max(0, headerHeight - insets.top);
  const bottomOffset = Math.max(0, tabBarHeight - insets.bottom);

  React.useEffect(() => {
    console.log(
      '[ScrollEdgeBar][JS]',
      JSON.stringify({
        headerHeight,
        tabBarHeight,
        insetsTop: insets.top,
        insetsBottom: insets.bottom,
        topOffset,
        bottomOffset,
      })
    );
  }, [
    headerHeight,
    tabBarHeight,
    insets.bottom,
    insets.top,
    topOffset,
    bottomOffset,
  ]);

  return (
    <View style={styles.container}>
      <ScrollEdgeBar
        style={styles.scrollEdgeBar}
        topBarOffset={topOffset}
        bottomBarOffset={bottomOffset}
      >
        <ScrollEdgeBar.TopBar style={styles.topBar}>
          <SegmentedControl
            values={['Free', 'Paid']}
            selectedIndex={0}
            style={styles.segmented}
          />
        </ScrollEdgeBar.TopBar>

        <ScrollView>
          {Array.from({ length: 50 }).map((_, i) => (
            <View key={i} style={styles.item}>
              <Text>Item {i + 1}</Text>
            </View>
          ))}
        </ScrollView>

        <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
          <View style={styles.bottomBarRow}>
            <Text style={styles.bottomBarText}>Bottom Bar</Text>
            <Switch />
          </View>
        </ScrollEdgeBar.BottomBar>
      </ScrollEdgeBar>
    </View>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="Example"
        component={ExampleScreen}
        options={{ title: 'Example' }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={TabsScreen}
              options={{
                title: 'Scroll Edge',
                headerTransparent: true,
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollEdgeBar: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  segmented: {
    height: 32,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
