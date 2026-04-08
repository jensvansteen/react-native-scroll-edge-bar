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
      <ScrollEdgeBar.TopBar style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <SegmentedControl values={['Free', 'Paid']} selectedIndex={0} />
      </ScrollEdgeBar.TopBar>

      <ScrollView>
        {Array.from({ length: 30 }).map((_, index) => (
          <View key={index} style={{ padding: 20 }}>
            <Text>Item {index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text>Bottom Bar</Text>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}
```

If your navigation header or tab bar is external to the scroll-edge-bar container, you can provide explicit offsets:

```tsx
<ScrollEdgeBar
  topBarOffset={headerOffset}
  bottomBarOffset={tabBarOffset}
>
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
- a native bottom tab bar via React Navigation native bottom tabs
- a `ScrollEdgeBar.TopBar` with a segmented control
- a `ScrollEdgeBar.BottomBar` with a label and switch

## Current Limitations

- iOS-only in practice
- relies on view discovery and reparenting in Fabric, which is more fragile than a pure UIKit setup
- the implementation is currently tuned around iOS 26 APIs

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
