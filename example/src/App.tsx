import { DynamicColorIOS, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { ExampleMenuScreen } from './components/ExampleMenuScreen';
import { ExampleScreen } from './screens/ExampleScreen';
import { navigationByKey, titleByKey } from './data';
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
              name="Example"
              component={ExampleScreen}
              options={({ route }) => ({
                title: titleByKey[route.params.key],
                headerShadowVisible: false,
                headerTransparent: true,
                headerLargeTitleEnabled: true,
                headerBackButtonDisplayMode: 'minimal',
                ...navigationByKey[route.params.key],
                headerTintColor: DynamicColorIOS({
                  light: 'black',
                  dark: 'white',
                }) as string,
              })}
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
