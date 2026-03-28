# Example App

This example app is the current manual testbed for `react-native-scroll-edge-bar`.

## What it demonstrates

- React Navigation native stack header
- React Navigation native bottom tabs
- `ScrollEdgeBar.TopBar` with a segmented control
- `ScrollEdgeBar.BottomBar` with a text label and switch
- A standard React Native `ScrollView` rendered inside `ScrollEdgeBar`

## Notes

- The example targets iOS first.
- The library implementation currently depends on iOS 26 APIs.
- If you update CocoaPods dependencies, rerun `pod install` inside `example/ios/`.

## Run

From the repo root:

```sh
yarn install
cd example/ios
pod install
cd ..
yarn ios
```
