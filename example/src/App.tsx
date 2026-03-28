import React from 'react';
import {
  DynamicColorIOS,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

enableScreens();

const Stack = createNativeStackNavigator();
const Tabs = createNativeBottomTabNavigator();

function ExampleScreen() {
  return (
    <ScrollEdgeBar
      style={styles.scrollEdgeBar}
      estimatedTopBarHeight={48}
      estimatedBottomBarHeight={96}
    >
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <SegmentedControl
          values={['Free', 'Paid', 'Freemium']}
          selectedIndex={0}
          style={styles.segmented}
        />
      </ScrollEdgeBar.TopBar>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {Array.from({ length: 50 }).map((_, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.itemText}>Item {i + 1}</Text>
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
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
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
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }),
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
    paddingVertical: 24,
    backgroundColor: 'transparent',
  },
  bottomBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarText: {
    fontSize: 16,
    color: DynamicColorIOS({
      light: '#111111',
      dark: '#f5f5f5',
    }),
  },
  item: {
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({
      light: '#ffffff',
      dark: '#1b1b1d',
    }),
  },
  itemText: {
    fontSize: 22,
    color: DynamicColorIOS({
      light: '#111111',
      dark: '#f5f5f5',
    }),
  },
});
