#import "RNScrollEdgeBarComponentView.h"

#import <react/renderer/components/scrolledgebar/RNScrollEdgeBarComponentDescriptor.h>
#import <react/renderer/components/scrolledgebar/Props.h>
#import <React/RCTConversions.h>

#import "RNScrollEdgeBarTopBarComponentView.h"
#import "RNScrollEdgeBarBottomBarComponentView.h"

@interface ScrollEdgeBarContainerView : UIView
- (void)prepareForFabricUnmount;
- (void)setTopBarView:(UIView *)view;
- (void)setBottomBarView:(UIView *)view;
- (void)setScrollView:(UIView *)view;
@property (nonatomic, assign) CGFloat estimatedTopBarHeight;
@property (nonatomic, assign) CGFloat estimatedBottomBarHeight;
@property (nonatomic, assign) CGFloat topBarOffset;
@property (nonatomic, assign) CGFloat bottomBarOffset;
@property (nonatomic, copy) NSString *topEdgeEffectStyle;
@property (nonatomic, copy) NSString *bottomEdgeEffectStyle;
@end

using namespace facebook::react;

static NSString *RCTNSStringFromStdString(const std::string &value)
{
  return [NSString stringWithUTF8String:value.c_str()] ?: @"";
}

static NSString *RCTNSStringFromTopEdgeEffectStyle(const facebook::react::RNScrollEdgeBarTopEdgeEffectStyle &value)
{
  return RCTNSStringFromStdString(facebook::react::toString(value));
}

static NSString *RCTNSStringFromBottomEdgeEffectStyle(
    const facebook::react::RNScrollEdgeBarBottomEdgeEffectStyle &value)
{
  return RCTNSStringFromStdString(facebook::react::toString(value));
}

@implementation RNScrollEdgeBarComponentView

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNScrollEdgeBarComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNScrollEdgeBarProps>();
    _props = defaultProps;
    [self setContentView:[ScrollEdgeBarContainerView new]];
  }
  return self;
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (ScrollEdgeBarContainerView *)scrollEdgeBarContainerView
{
  return (ScrollEdgeBarContainerView *)self.contentView;
}

- (UIView *)resolvedContentViewForChild:(UIView<RCTComponentViewProtocol> *)childComponentView
{
  if ([childComponentView isKindOfClass:[RCTViewComponentView class]]) {
    RCTViewComponentView *viewComponent = (RCTViewComponentView *)childComponentView;
    return viewComponent.contentView ?: childComponentView;
  }
  return childComponentView;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newProps = *std::static_pointer_cast<const RNScrollEdgeBarProps>(props);
  ScrollEdgeBarContainerView *view = [self scrollEdgeBarContainerView];

  view.estimatedTopBarHeight = newProps.estimatedTopBarHeight;
  view.estimatedBottomBarHeight = newProps.estimatedBottomBarHeight;
  view.topBarOffset = newProps.topBarOffset;
  view.bottomBarOffset = newProps.bottomBarOffset;
  view.topEdgeEffectStyle = RCTNSStringFromTopEdgeEffectStyle(newProps.topEdgeEffectStyle);
  view.bottomEdgeEffectStyle = RCTNSStringFromBottomEdgeEffectStyle(newProps.bottomEdgeEffectStyle);

  [super updateProps:props oldProps:oldProps];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                          index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];

  UIView *resolvedView = [self resolvedContentViewForChild:childComponentView];
  ScrollEdgeBarContainerView *container = [self scrollEdgeBarContainerView];

  if ([childComponentView isKindOfClass:[RNScrollEdgeBarTopBarComponentView class]]) {
    [container setTopBarView:resolvedView];
  } else if ([childComponentView isKindOfClass:[RNScrollEdgeBarBottomBarComponentView class]]) {
    [container setBottomBarView:resolvedView];
  } else {
    [container setScrollView:resolvedView];
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView
                            index:(NSInteger)index
{
  [[self scrollEdgeBarContainerView] prepareForFabricUnmount];
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)invalidate
{
  [[self scrollEdgeBarContainerView] prepareForFabricUnmount];
  [super invalidate];
}

@end
