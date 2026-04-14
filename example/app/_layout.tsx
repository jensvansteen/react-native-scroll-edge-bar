import { DynamicColorIOS, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

enableScreens();

function examplesTintColor() {
  return DynamicColorIOS({
    light: 'black',
    dark: 'white',
  }) as string;
}

const transparentHeaderOptions = {
  headerShadowVisible: false,
  headerTransparent: true,
  headerBackButtonDisplayMode: 'minimal' as const,
  headerTintColor: examplesTintColor(),
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'ScrollEdgeBar',
              headerShadowVisible: false,
              headerLargeTitleEnabled: true,
              headerTintColor: examplesTintColor(),
            }}
          />
          <Stack.Screen
            name="app-store"
            options={{
              ...transparentHeaderOptions,
              title: 'App Store Listing',
              headerLargeTitleEnabled: false,
            }}
          />
          <Stack.Screen
            name="pull-requests"
            options={{
              ...transparentHeaderOptions,
              title: 'Pull Requests',
              headerLargeTitleEnabled: true,
            }}
          />
          <Stack.Screen
            name="pr-detail"
            options={{
              ...transparentHeaderOptions,
              title: 'PR Detail',
            }}
          />
          <Stack.Screen
            name="transition-showcase"
            options={{
              ...transparentHeaderOptions,
              title: 'Transition Showcase',
            }}
          />
          <Stack.Screen
            name="toolbar"
            options={{
              ...transparentHeaderOptions,
              title: 'Toolbar',
            }}
          />
          <Stack.Screen
            name="search-bar"
            options={{
              ...transparentHeaderOptions,
              title: 'Search Bar',
              headerSearchBarOptions: {
                placement: 'stacked',
                allowToolbarIntegration: false,
              },
            }}
          />
          <Stack.Screen
            name="tab-accessory"
            options={{
              ...transparentHeaderOptions,
              title: 'Tab Accessory',
              headerLargeTitleEnabled: true,
            }}
          />
          <Stack.Screen
            name="calendar"
            options={{
              ...transparentHeaderOptions,
              title: 'February',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
