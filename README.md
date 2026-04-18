# react-native-scroll-edge-bar

React Native scroll edge bars for iOS — floating top and bottom bars that blend with the navigation bar or tab bar as the user scrolls.

---

## Why This Library Exists

As of iOS 26, there is no direct way from React Native to attach a custom bar to a scroll view that blends with the system navigation or tab bar blur. The underlying mechanics live in SwiftUI's [`safeAreaBar`](https://developer.apple.com/documentation/swiftui/view/safeareabar(_:content:)), which coordinates with the system bars without requiring shared view hierarchy.

This library bridges that gap by wrapping the native [`ScrollEdgeBar`](https://github.com/jensvansteen/ScrollEdgeBar) UIKit package, which itself drives the effect through SwiftUI. On iOS 16–25 it falls back to [`safeAreaInset`](https://developer.apple.com/documentation/swiftui/view/safeareainset(edge:alignment:spacing:content:))-style bars with the same layout, without the blur.

## Features

- **Seamless glass blur** — top and bottom bars extend the navigation bar and tab bar Liquid Glass (iOS 26+)
- **Graceful fallback** — uses `safeAreaInset` on iOS 16–25, same layout without the blur
- **Top & bottom bars** — attach a bar to either scroll edge, or both
- **React Native Fabric** — full New Architecture support
- **Compound component API** — `ScrollEdgeBar`, `ScrollEdgeBar.TopBar`, `ScrollEdgeBar.BottomBar`

## Requirements

- iOS 16.0+
- React Native New Architecture (Fabric)

## Installation

```sh
npm install react-native-scroll-edge-bar
```

Then install iOS pods in your app:

```sh
cd ios && pod install
```

### Expo prebuild apps

Set the iOS deployment target in your Expo config so regenerated native projects keep the required minimum:

```sh
npx expo install expo-build-properties
```

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "16.0"
          }
        }
      ]
    ]
  }
}
```

Then regenerate and run:

```sh
npx expo prebuild --platform ios
npx expo run:ios
```

## Usage

```tsx
import { ScrollView, Text, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function Example() {
  return (
    <ScrollEdgeBar style={{ flex: 1 }}>
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

## API Reference

### `ScrollEdgeBar`

| Prop | Type | Default | Description |
|---|---|---|---|
| `prefersGlassEffect` | `boolean` | `true` | When `false`, uses plain `safeAreaInset` bars on all OS versions. |
| `topEdgeEffectStyle` | `'automatic' \| 'soft' \| 'hard'` | `'automatic'` | iOS 26 scroll-edge effect intensity for the top edge. |
| `bottomEdgeEffectStyle` | `'automatic' \| 'soft' \| 'hard'` | `'automatic'` | iOS 26 scroll-edge effect intensity for the bottom edge. |
| `style` | `StyleProp<ViewStyle>` | — | Standard RN view style. |

#### Advanced

These props are not needed in most cases. The native package measures bar content automatically before the first frame.

| Prop | Type | Default | Description |
|---|---|---|---|
| `estimatedTopBarHeight` | `number` | `0` | Layout hint before top bar is measured. Reduces first-frame flicker. |
| `estimatedBottomBarHeight` | `number` | `0` | Layout hint before bottom bar is measured. Reduces first-frame flicker. |

### `ScrollEdgeBar.TopBar` / `ScrollEdgeBar.BottomBar`

Accept standard RN view props (`style`, `children`).

## Examples

### App Store Listing

Segmented control as a top bar above a ranked app list. The bar blends with the navigation bar as content scrolls beneath it.

<video src="https://github.com/user-attachments/assets/6622db2d-2eb8-4baa-82de-c96a36f248de" autoplay loop muted playsinline></video>

### App Store (No Glass)

Same screen with `prefersGlassEffect={false}`, showing the plain `safeAreaInset` bar without the blur effect.

<video src="https://github.com/user-attachments/assets/4fd15cd2-ed58-48a9-ad4c-9762cdf055c3" autoplay loop muted playsinline></video>

### Pull Requests

Horizontally scrolling filter chips as a top bar with a large title navigation bar.

<video src="https://github.com/user-attachments/assets/95c26a8b-7a3b-46b8-b026-c583d8fde743" autoplay loop muted playsinline></video>

> **Note:** When a `safeAreaBar` is present alongside a large title navigation bar, SwiftUI applies the scroll edge blur effect to the navigation bar even when the content is at rest, causing it to appear blurry on first appearance. This is a known SwiftUI behavior ([FB21613303](https://developer.apple.com/forums/thread/812480)).

### PR Detail

Glass-effect review banner as a top bar and action buttons as a bottom bar.

<video src="https://github.com/user-attachments/assets/e9673186-9362-4906-8f07-417b6e0d597c" autoplay loop muted playsinline></video>

### Transition Showcase

Large colored blocks demonstrating how the glass blur color transitions as you scroll past different background colors.

<video src="https://github.com/user-attachments/assets/c0993fc1-e394-4885-8ac0-cc5440fa9745" autoplay loop muted playsinline></video>

### Toolbar

Bottom edge bar positioned above the system toolbar.

<video src="https://github.com/user-attachments/assets/b0d6bff8-27f5-458f-8cfc-24137c68cfdc" autoplay loop muted playsinline></video>

### Search Bar

`UISearchController` in the navigation bar with a segmented control edge bar below it.

<video src="https://github.com/user-attachments/assets/bac1b32f-8cb7-4177-aee1-6b78b2590d0d" autoplay loop muted playsinline></video>

### Calendar

Week day selector as a top bar with a stronger scroll-edge effect. The effect intensity is controlled via `topEdgeEffectStyle`:

```tsx
<ScrollEdgeBar topEdgeEffectStyle="hard">
  ...
</ScrollEdgeBar>
```

<video src="https://github.com/user-attachments/assets/aec6a4dd-56a3-4dd0-ae0b-acbc0455b17f" autoplay loop muted playsinline></video>

## Adaptive Bar Content

The bar material/blur adapts to the content scrolling beneath it. However, React Native views rendered *inside* the bar do not automatically inherit the scroll-edge color transition — their colors stay as styled by React Native.

This matters most in a standalone bottom bar with no system `UITabBar` to merge into. When a bar merges with a `UINavigationBar` or `UITabBar`, RN content tends to integrate better due to the stronger system scroll-edge context. SwiftUI-backed content (e.g. via `@expo/ui`) adapts correctly in both cases because it is hosted through SwiftUI's own rendering path.

Regular RN children are flexible and require no extra dependency:

```tsx
import { PlatformColor, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function RNBottomBarExample() {
  return (
    <ScrollEdgeBar style={{ flex: 1 }}>
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
  bottomBar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: 'transparent' },
  label: { fontSize: 15, fontWeight: '600', color: PlatformColor('label') },
  spacer: { flex: 1 },
  button: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: PlatformColor('secondarySystemFill') },
  buttonText: { fontSize: 13, fontWeight: '600', color: PlatformColor('label') },
});
```

SwiftUI-backed controls participate in the scroll-edge transition more like native UIKit/SwiftUI controls. [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/) is one option:

```tsx
import { ScrollView } from 'react-native';
import { Button, HStack, Host, Spacer, Text, Toggle } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

export function SwiftUIBottomBarExample() {
  return (
    <ScrollEdgeBar style={{ flex: 1 }}>
      <ScrollView>{/* content */}</ScrollView>

      <ScrollEdgeBar.BottomBar style={{ width: '100%' }}>
        <Host matchContents={{ vertical: true }} style={{ width: '100%' }}>
          <HStack spacing={12} alignment="center" modifiers={[padding({ horizontal: 16, vertical: 12 })]}>
            <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle({ type: 'hierarchical', style: 'primary' })]}>
              Test
            </Text>
            <Toggle isOn />
            <Spacer />
            <Button label="Reset" modifiers={[buttonStyle('bordered'), controlSize('small')]} />
          </HStack>
        </Host>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}
```

`@expo/ui` is not a dependency of this library. If you use it in a bare React Native app, follow Expo's setup for Expo modules.

## Current Limitations

- iOS only
- Requires React Native New Architecture (Fabric)
- Glass scroll-edge effect requires iOS 26; earlier versions use non-glass inset bars
- Arbitrary RN-rendered bar children do not inherit the same adaptive scroll-edge color transitions as native UIKit/SwiftUI controls

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## Author

Created by [Jens Van Steen](https://github.com/jensvansteen)

## License

MIT
