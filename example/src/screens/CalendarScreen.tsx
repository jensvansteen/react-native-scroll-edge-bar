import {
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

const hours = Array.from(
  { length: 24 },
  (_, hour) => `${String(hour).padStart(2, '0')}:00`
);

const events = [
  {
    title: 'Morning Run',
    startHour: 7,
    durationHours: 1,
    color: '#34C759',
  },
  {
    title: 'Team Standup',
    startHour: 9,
    durationHours: 1,
    color: '#007AFF',
  },
  {
    title: 'Design Review',
    startHour: 11,
    durationHours: 2,
    color: '#AF52DE',
  },
  // {
  //   title: 'Lunch',
  //   startHour: 13,
  //   durationHours: 1,
  //   color: '#FF9F0A',
  // },
  {
    title: 'Focus Time',
    startHour: 15,
    durationHours: 2,
    color: '#5AC8FA',
  },
  {
    title: 'Gym',
    startHour: 18,
    durationHours: 1,
    color: '#FF3B30',
  },
];

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const weekDates = [2, 3, 4, 5, 6, 7, 8];
const todayIndex = 1;

export function CalendarScreen() {
  return (
    <ScrollEdgeBar
      style={styles.container}
      estimatedTopBarHeight={94}
      topEdgeEffectStyle="hard"
    >
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <View style={styles.calendarTopBar}>
          <View style={styles.weekRow}>
            {weekDays.map((day, index) => {
              const isToday = index === todayIndex;
              const isSunday = index === 0;

              return (
                <View key={`${day}-${weekDates[index]}`} style={styles.weekDay}>
                  <Text
                    style={[
                      styles.weekDayLabel,
                      isSunday && styles.weekDayLabelSunday,
                    ]}
                  >
                    {day}
                  </Text>
                  {isToday ? (
                    <View style={styles.todayCircle}>
                      <Text style={styles.todayDateText}>
                        {weekDates[index]}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.weekDayNumber,
                        isSunday && styles.weekDayNumberSunday,
                      ]}
                    >
                      {weekDates[index]}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <Text style={styles.calendarDateLabel}>Tuesday – Feb 3, 2026</Text>
          <View style={styles.separator} />
        </View>
      </ScrollEdgeBar.TopBar>

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.timeline}>
          {hours.map((hour, index) => {
            const event = events.find((item) => item.startHour === index);

            return (
              <View key={hour} style={styles.hourRow}>
                <Text style={styles.hourLabel}>{hour}</Text>
                <View style={styles.hourTrack}>
                  <View style={styles.hourDivider} />
                  {event ? (
                    <View
                      style={[
                        styles.eventBlock,
                        {
                          borderColor: event.color,
                          backgroundColor: `${event.color}26`,
                          height: event.durationHours * 44 - 4,
                        },
                      ]}
                    >
                      <Text style={[styles.eventTitle, { color: event.color }]}>
                        {event.title}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScrollEdgeBar>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  calendarTopBar: {
    backgroundColor: 'transparent',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  weekDayLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: PlatformColor('secondaryLabel'),
  },
  weekDayLabelSunday: {
    color: '#FF3B30',
  },
  weekDayNumber: {
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 32,
    fontSize: 17,
    color: PlatformColor('label'),
  },
  weekDayNumberSunday: {
    color: '#FF3B30',
  },
  todayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PlatformColor('label'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDateText: {
    fontSize: 17,
    fontWeight: '700',
    color: PlatformColor('systemBackground'),
  },
  calendarDateLabel: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  separator: {
    marginTop: 8,
    height: StyleSheet.hairlineWidth,
    backgroundColor: PlatformColor('separator'),
  },
  scrollView: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackground'),
  },
  timeline: {
    backgroundColor: PlatformColor('systemBackground'),
  },
  hourRow: {
    minHeight: 44,
    flexDirection: 'row',
    backgroundColor: PlatformColor('systemBackground'),
  },
  hourLabel: {
    width: 60,
    paddingTop: 12,
    paddingLeft: 16,
    fontSize: 12,
    lineHeight: 16,
    fontVariant: ['tabular-nums'],
    color: PlatformColor('secondaryLabel'),
  },
  hourTrack: {
    flex: 1,
    paddingRight: 16,
    position: 'relative',
    overflow: 'visible',
  },
  hourDivider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: PlatformColor('separator'),
  },
  eventBlock: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 16,
    borderRadius: 6,
    borderWidth: 2,
    paddingTop: 6,
    paddingHorizontal: 8,
    zIndex: 2,
  },
  eventTitle: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
  },
});
