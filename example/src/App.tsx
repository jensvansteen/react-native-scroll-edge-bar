import { DynamicColorIOS, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { ExampleMenuScreen } from './components/ExampleMenuScreen';
import { AppStoreScreen } from './screens/AppStoreScreen';
import { PullRequestsScreen } from './screens/PullRequestsScreen';
import { PrDetailScreen } from './screens/PrDetailScreen';
import { TransitionShowcaseScreen } from './screens/TransitionShowcaseScreen';
import { ToolbarScreen } from './screens/ToolbarScreen';
import { SearchBarScreen } from './screens/SearchBarScreen';
import { TabAccessoryScreen } from './screens/TabAccessoryScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import type { RootStackParamList } from './types';

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createNativeBottomTabNavigator();

function HomeTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Examples"
        component={ExampleMenuScreen}
        options={{ title: 'Examples' }}
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
              component={HomeTabs}
              options={{
                title: 'ScrollEdgeBar',
                headerShadowVisible: false,
                headerLargeTitleEnabled: true,
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="AppStore"
              component={AppStoreScreen}
              options={{
                title: 'App Store Listing',
                headerShadowVisible: false,
                headerTransparent: true,
                headerLargeTitleEnabled: false,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="PullRequests"
              component={PullRequestsScreen}
              options={{
                title: 'Pull Requests',
                headerShadowVisible: false,
                headerTransparent: true,
                headerLargeTitleEnabled: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="PrDetail"
              component={PrDetailScreen}
              options={{
                title: 'PR Detail',
                headerShadowVisible: false,
                headerTransparent: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="TransitionShowcase"
              component={TransitionShowcaseScreen}
              options={{
                title: 'Transition Showcase',
                headerShadowVisible: false,
                headerTransparent: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="Toolbar"
              component={ToolbarScreen}
              options={{
                title: 'Toolbar',
                headerShadowVisible: false,
                headerTransparent: true,
                headerLargeTitleEnabled: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="SearchBar"
              component={SearchBarScreen}
              options={{
                title: 'Search Bar',
                headerShadowVisible: false,
                headerTransparent: true,
                headerSearchBarOptions: {
                  placement: 'stacked',
                  allowToolbarIntegration: false,
                },
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="TabAccessory"
              component={TabAccessoryScreen}
              options={{
                title: 'Tab Accessory',
                headerShadowVisible: false,
                headerTransparent: true,
                headerLargeTitleEnabled: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{
                title: 'February',
                headerShadowVisible: false,
                headerTransparent: true,
                headerBackButtonDisplayMode: 'minimal',
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
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
});
