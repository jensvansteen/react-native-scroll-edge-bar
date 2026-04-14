# react-native-scroll-edge-bar

`react-native-scroll-edge-bar` is a Fabric-based React Native view for attaching custom top and bottom bars to a scroll view on iOS.

It currently targets the iOS 26 `safeAreaBar` APIs and is implemented only on iOS.

## Current Scope

- iOS implementation: present
- Android implementation: not implemented
- Fabric / New Architecture: required
- Native dependency: none beyond standard React Native Fabric/codegen on iOS

## Public API

The library exports a compound component:

```tsx
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';
```

Available components:

- `ScrollEdgeBar`
- `ScrollEdgeBar.TopBar`
- `ScrollEdgeBar.BottomBar`

### `ScrollEdgeBar` props

- `estimatedTopBarHeight?: number`
  - Fallback height used before the top bar has a measured layout.
- `estimatedBottomBarHeight?: number`
  - Fallback height used before the bottom bar has a measured layout.
- `topBarOffset?: number`
  - Extra offset to push the top bar below an external header.
- `bottomBarOffset?: number`
  - Extra offset to lift the bottom bar above an external tab bar.
- Standard RN view props such as `style`

### `ScrollEdgeBar.TopBar` props

- Standard RN view props such as `style`
- `children`

### `ScrollEdgeBar.BottomBar` props

- Standard RN view props such as `style`
- `children`

## Usage

Basic usage:

```tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function Example() {
  return (
    <ScrollEdgeBar
      style={{ flex: 1 }}
      estimatedTopBarHeight={48}
      estimatedBottomBarHeight={56}
    >
      <ScrollEdgeBar.TopBar
        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
        <SegmentedControl values={['Free', 'Paid']} selectedIndex={0} />
      </ScrollEdgeBar.TopBar>

      <ScrollView>
        {Array.from({ length: 30 }).map((_, index) => (
          <View key={index} style={{ padding: 20 }}>
            <Text>Item {index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar
        style={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <Text>Bottom Bar</Text>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}
```

If your navigation header or tab bar is external to the scroll-edge-bar container, you can provide explicit offsets:

```tsx
<ScrollEdgeBar topBarOffset={headerOffset} bottomBarOffset={tabBarOffset}>
  ...
</ScrollEdgeBar>
```

## Installation

```sh
npm install react-native-scroll-edge-bar
```

Then install iOS pods in your app:

```sh
cd ios
pod install
```

## Example App

The example app in `example/` currently demonstrates:

- a native stack header via React Navigation native stack
- a `ScrollEdgeBar.TopBar` with a segmented control
- a `ScrollEdgeBar.BottomBar` with a label and switch

## Adaptive Bar Content

`ScrollEdgeBar` uses the native iOS scroll-edge bar surface, so the bar material/blur itself follows the content underneath the scroll view.

There is one important distinction between the bar surface and the content you render inside it:

- Native UIKit/SwiftUI controls participate in the system scroll-edge appearance environment.
- Arbitrary React Native children are hosted as Fabric/RN views inside that native bar surface.

This means RN-rendered content, such as `Text` or `View` with JS-defined colors, may not automatically adapt its foreground and fill colors during the local scroll-edge transition in the same way native UIKit/SwiftUI controls do. The bar material can transition correctly while RN child colors remain as styled by React Native.

This behavior is context-sensitive:

- When a bar merges with an existing system `UINavigationBar` or `UITabBar`, iOS already provides a stronger system scroll-edge context. In those cases, RN child content can appear to integrate better with the system bar’s material transition.
- In a standalone bottom `safeAreaBar`, with no system `UITabBar` to merge into, arbitrary RN children may not receive the same adaptive foreground/fill treatment.
- SwiftUI-backed content does adapt correctly in the standalone bottom bar case.

This is why the same visual example can behave differently depending on whether it is attached to a navigation bar, attached to a tab bar, or rendered as a standalone bottom safe-area bar.

We investigated whether the standalone bottom-bar behavior could be fixed by adding hidden native/SwiftUI content internally. In local testing, the following did **not** reproduce the adaptive behavior for RN-rendered labels/buttons:

- a hidden SwiftUI view inside the bottom safe-area bar
- a layout-participating SwiftUI sibling inside the bar
- a nested `UIHostingController` probe
- visible native SwiftUI controls inserted as UIKit subviews inside the RN bottom-bar marker

That suggests the behavior is not triggered simply by “some SwiftUI view exists nearby.” It appears to depend on the actual rendering/hosting model of the bar content. For example, SwiftUI-backed Expo UI content has been observed to adapt correctly because Expo UI mounts SwiftUI content through its own Fabric/SwiftUI virtual-view host, while regular RN/Fabric text and views remain ordinary UIKit views with JS-defined styling.

### RN children vs SwiftUI-backed children

The following example shows both approaches. The first bottom bar uses regular React Native primitives. The second uses SwiftUI-backed controls from `@expo/ui/swift-ui`.

Regular RN children are flexible and require no extra dependency:

```tsx
import {
  PlatformColor,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function RNBottomBarExample() {
  return (
    <ScrollEdgeBar style={{ flex: 1 }} estimatedBottomBarHeight={64}>
      <ScrollView>{/* content */}</ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
        <Text style={styles.label}>Test</Text>
        <Switch value />
        <View style={styles.spacer} />
        <View style={styles.button}>
          <Text style={styles.buttonText}>Reset</Text>
        </View>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  spacer: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: PlatformColor('secondarySystemFill'),
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
});
```

SwiftUI-backed controls can participate in the standalone scroll-edge transition more like native UIKit/SwiftUI controls:

```tsx
import { ScrollView } from 'react-native';
import { Button, HStack, Host, Spacer, Text, Toggle } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  controlSize,
  font,
  foregroundStyle,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function SwiftUIBottomBarExample() {
  return (
    <ScrollEdgeBar style={{ flex: 1 }} estimatedBottomBarHeight={64}>
      <ScrollView>{/* content */}</ScrollView>

      <ScrollEdgeBar.BottomBar style={{ width: '100%' }}>
        <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
          <HStack
            spacing={12}
            alignment="center"
            modifiers={[padding({ horizontal: 16, vertical: 12 })]}
          >
            <Text
              modifiers={[
                font({ size: 15, weight: 'semibold' }),
                foregroundStyle({ type: 'hierarchical', style: 'primary' }),
              ]}
            >
              Test
            </Text>
            <Toggle isOn />
            <Spacer />
            <Button
              label="Reset"
              modifiers={[buttonStyle('bordered'), controlSize('small')]}
            />
          </HStack>
        </Host>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}
```

`@expo/ui` is not a dependency of this library. It is one optional way to render SwiftUI-backed controls from JSX. If you use it in a bare React Native app, follow Expo’s setup for Expo modules.

For full UIKit-level adaptive behavior in standalone bars, prefer native/adaptive controls where possible. Future versions of this library may expose first-class native bar primitives for labels, buttons, switches, and similar controls.

## Current Limitations

- iOS-only in practice
- relies on view discovery and reparenting in Fabric, which is more fragile than a pure UIKit setup
- the implementation is currently tuned around iOS 26 APIs
- arbitrary RN-rendered bar children do not always inherit the same adaptive scroll-edge foreground/color transitions as native UIKit/SwiftUI controls

## Repo Notes

Relevant files:

- API surface: `src/index.tsx`
- Fabric specs: `src/fabric/*.ts`
- iOS implementation: `ios/HybridScrollEdgeBar.swift`
- example app: `example/src/App.tsx`

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT
