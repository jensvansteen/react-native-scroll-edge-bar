import { DynamicColorIOS, StyleSheet, Text, View } from 'react-native';
import { ExampleLayout } from '../components/ExampleLayout';

export function CalendarScreen() {
  return (
    <ExampleLayout
      estimatedTopBarHeight={92}
      topBar={
        <View style={styles.calendarTopBar}>
          <View style={styles.weekRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={`${day}-${index}`} style={styles.weekDay}>
                <Text style={styles.weekDayLabel}>{day}</Text>
                <Text
                  style={[
                    styles.weekDayNumber,
                    index === 1 ? styles.weekDayNumberActive : undefined,
                  ]}
                >
                  {index + 2}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.calendarDateLabel}>Tuesday - Feb 3, 2026</Text>
        </View>
      }
    >
      {Array.from({ length: 24 }).map((_, index) => (
        <View key={index} style={styles.calendarRow}>
          <Text style={styles.calendarHour}>
            {String(index).padStart(2, '0')}:00
          </Text>
          <Text style={styles.calendarEvent}>Event slot {index + 1}</Text>
        </View>
      ))}
    </ExampleLayout>
  );
}

const styles = StyleSheet.create({
  calendarTopBar: {
    gap: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    alignItems: 'center',
    flex: 1,
  },
  weekDayLabel: {
    fontSize: 12,
    color: DynamicColorIOS({ light: '#666666', dark: '#a1a1aa' }),
  },
  weekDayNumber: {
    marginTop: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 28,
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  weekDayNumberActive: {
    backgroundColor: '#007aff',
    color: '#ffffff',
  },
  calendarDateLabel: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 72,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9d9d9',
    backgroundColor: DynamicColorIOS({ light: '#ffffff', dark: '#1b1b1d' }),
  },
  calendarHour: {
    width: 56,
    fontSize: 13,
    color: DynamicColorIOS({ light: '#666666', dark: '#a1a1aa' }),
  },
  calendarEvent: {
    fontSize: 15,
    color: DynamicColorIOS({ light: '#111111', dark: '#f5f5f5' }),
  },
});
