# Changelog

## 0.1.0

### Added
- `ScrollEdgeBar` — a React Native container component that wraps any scroll view with sticky top and/or bottom bars
- `ScrollEdgeBar.TopBar` and `ScrollEdgeBar.BottomBar` slot components for placing bar content
- iOS 26+: bars use the system glass blur effect via `safeAreaBar`, seamlessly extending the navigation bar or tab bar
- iOS 16–25: bars are displayed using `safeAreaInset` (same layout, no blur effect)
- `estimatedTopBarHeight` / `estimatedBottomBarHeight` props to prevent flicker before layout
- TypeScript types and a compound React component API
- Full Fabric (New Architecture) support
