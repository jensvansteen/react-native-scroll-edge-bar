import {
  type ColorValue,
  PlatformColor,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SFSymbolView, SFSymbolWeight } from 'react-native-nitro-sfsymbols';
import { LiquidGlassView } from '@callstack/liquid-glass';
import { ScrollEdgeBar } from 'react-native-scroll-edge-bar';

const conversationItems = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  text: `Comment ${index + 1} — Discussion about the implementation details`,
}));

export function PrDetailScreen() {
  return (
    <ScrollEdgeBar
      style={styles.container}
      estimatedTopBarHeight={86}
      estimatedBottomBarHeight={62}
    >
      <ScrollEdgeBar.TopBar style={styles.topBar}>
        <GlassSurface
          style={styles.reviewBanner}
          tintColor="rgba(66,132,67,0.30)"
        >
          <SFSymbolView
            name="person.crop.circle.badge.plus"
            size={18}
            tintColor="#FF9F0A"
            weight={SFSymbolWeight.REGULAR}
          />
          <Text style={styles.reviewBannerText}>
            alexjohnson requested your review
          </Text>
          <View style={styles.reviewButton}>
            <Text style={styles.reviewButtonText}>Review</Text>
          </View>
        </GlassSurface>
      </ScrollEdgeBar.TopBar>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SectionHeader title="Changes" />
        <CardGroup>
          <DetailRow
            icon="doc.badge.plus"
            title="3 files changed"
            detail="+52 -40"
            detailColor={PlatformColor('label')}
          />
          <Divider />
          <DetailRow
            icon="circle.and.line.horizontal"
            title="1 commit"
            detail="10 days ago"
            detailColor={PlatformColor('secondaryLabel')}
          />
        </CardGroup>

        <SectionHeader title="Status" />
        <CardGroup>
          <ReviewsBlock />
          <Divider />
          <MergeBlock />
        </CardGroup>

        <SectionHeader title="Conversation" />
        <CardGroup>
          {conversationItems.map((item, index) => (
            <View key={item.id}>
              <ConversationRow text={item.text} />
              {index < conversationItems.length - 1 ? <Divider /> : null}
            </View>
          ))}
        </CardGroup>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <ScrollEdgeBar.BottomBar style={styles.bottomBar}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignSelf: 'flex-end',
          }}
        >
          <GlassButton
            title="Comment"
            icon="bubble.left"
            tintColor="rgba(0,122,255,0.18)"
          />
          <GlassButton icon="info.circle" />
        </View>
      </ScrollEdgeBar.BottomBar>
    </ScrollEdgeBar>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function CardGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.cardGroup}>{children}</View>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function DetailRow({
  icon,
  title,
  detail,
  detailColor,
}: {
  icon: string;
  title: string;
  detail: string;
  detailColor: ColorValue;
}) {
  return (
    <View style={styles.row}>
      <SFSymbolView
        name={icon}
        size={18}
        tintColor="secondaryLabel"
        weight={SFSymbolWeight.REGULAR}
      />
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.rowSpacer} />
      <Text style={[styles.rowDetail, { color: detailColor }]}>{detail}</Text>
      <SFSymbolView
        name="chevron.right"
        size={12}
        tintColor="tertiaryLabel"
        weight={SFSymbolWeight.SEMIBOLD}
      />
    </View>
  );
}

function ReviewsBlock() {
  return (
    <View style={styles.reviewsBlock}>
      <View style={styles.row}>
        <View style={styles.reviewsDot} />
        <Text style={styles.rowTitle}>Reviews</Text>
        <View style={styles.rowSpacer} />
        <SFSymbolView
          name="chevron.up"
          size={12}
          tintColor="tertiaryLabel"
          weight={SFSymbolWeight.SEMIBOLD}
        />
      </View>
      <View style={styles.addReviewButton}>
        <Text style={styles.addReviewButtonText}>Add Your Review</Text>
      </View>
    </View>
  );
}

function MergeBlock() {
  return (
    <View style={styles.mergeBlock}>
      <View style={styles.mergeHeader}>
        <SFSymbolView
          name="checkmark.circle.fill"
          size={22}
          tintColor="#34C759"
          weight={SFSymbolWeight.REGULAR}
        />
        <View style={styles.mergeTextColumn}>
          <Text style={styles.mergeTitle}>Ready to merge</Text>
          <Text style={styles.mergeSubtitle}>
            This branch has no conflicts with the base branch.
          </Text>
        </View>
      </View>

      <View style={styles.mergeActions}>
        <View style={styles.mergeButton}>
          <Text style={styles.mergeButtonText}>Merge Pull Request</Text>
        </View>
        <View style={styles.settingsButton}>
          <SFSymbolView
            name="gearshape"
            size={18}
            tintColor="secondaryLabel"
            weight={SFSymbolWeight.REGULAR}
          />
        </View>
      </View>
    </View>
  );
}

function ConversationRow({ text }: { text: string }) {
  return (
    <View style={styles.conversationRow}>
      <View style={styles.avatar} />
      <Text style={styles.conversationText}>{text}</Text>
    </View>
  );
}

function GlassButton({
  title,
  icon,
  tintColor,
}: {
  title?: string;
  icon: string;
  tintColor?: string;
}) {
  return (
    <Pressable>
      <GlassSurface
        style={styles.glassButton}
        tintColor={tintColor}
        interactive
      >
        <SFSymbolView
          name={icon}
          size={16}
          tintColor="label"
          weight={SFSymbolWeight.REGULAR}
        />
        {title ? <Text style={styles.glassButtonText}>{title}</Text> : null}
      </GlassSurface>
    </Pressable>
  );
}

function GlassSurface({
  children,
  style,
  tintColor,
  interactive = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  interactive?: boolean;
}) {
  if (__DEV__) {
    return (
      <View
        style={[
          style,
          styles.devGlassFallback,
          tintColor ? { backgroundColor: tintColor } : null,
        ]}
        pointerEvents={interactive ? 'auto' : 'box-none'}
      >
        {children}
      </View>
    );
  }

  return (
    <LiquidGlassView
      interactive={interactive}
      effect="clear"
      style={style}
      tintColor={tintColor}
    >
      {children}
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
  reviewBanner: {
    minHeight: 54,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewBannerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: PlatformColor('label'),
  },
  reviewButton: {
    minHeight: 30,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('secondarySystemGroupedBackground'),
  },
  reviewButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: PlatformColor('systemGroupedBackground'),
  },
  scrollContent: {
    paddingBottom: 36,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    marginHorizontal: 16,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    color: PlatformColor('label'),
  },
  cardGroup: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: PlatformColor('secondarySystemGroupedBackground'),
  },
  divider: {
    marginLeft: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: PlatformColor('separator'),
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowTitle: {
    fontSize: 15,
    lineHeight: 20,
    color: PlatformColor('label'),
  },
  rowSpacer: {
    flex: 1,
  },
  rowDetail: {
    fontSize: 15,
    lineHeight: 20,
  },
  reviewsBlock: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reviewsDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: PlatformColor('systemGray4'),
  },
  addReviewButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('secondarySystemFill'),
  },
  addReviewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  mergeBlock: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(52,199,89,0.08)',
  },
  mergeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  mergeTextColumn: {
    flex: 1,
  },
  mergeTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: PlatformColor('label'),
  },
  mergeSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: PlatformColor('secondaryLabel'),
  },
  mergeActions: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  mergeButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
  },
  mergeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PlatformColor('secondarySystemFill'),
  },
  conversationRow: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PlatformColor('systemGray3'),
  },
  conversationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: PlatformColor('secondaryLabel'),
  },
  bottomSpacer: {
    height: 200,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  glassButton: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  glassButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: PlatformColor('label'),
  },
  devGlassFallback: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60,60,67,0.18)',
  },
});
