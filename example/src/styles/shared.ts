import { DynamicColorIOS, StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: DynamicColorIOS({ light: '#666666', dark: '#a1a1aa' }),
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  spacer: {
    flex: 1,
  },
  smallButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: DynamicColorIOS({ light: '#ececec', dark: '#2a2a2d' }),
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  smallButtonPrimary: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#007aff',
  },
  smallButtonPrimaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  badgeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: DynamicColorIOS({ light: '#ececec', dark: '#2a2a2d' }),
  },
  badgeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007aff',
  },
});
