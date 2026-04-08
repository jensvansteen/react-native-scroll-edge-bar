#import "RNScrollEdgeBarBottomBarComponentView.h"

#import <react/renderer/components/scrolledgebar/RNScrollEdgeBarBottomBarComponentDescriptor.h>
#import <react/renderer/components/scrolledgebar/Props.h>

@interface ScrollEdgeBarBottomBarView : UIView
@end

using namespace facebook::react;

@implementation RNScrollEdgeBarBottomBarComponentView
{
  ScrollEdgeBarBottomBarView *_markerView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNScrollEdgeBarBottomBarComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNScrollEdgeBarBottomBarProps>();
    _props = defaultProps;
    _markerView = [ScrollEdgeBarBottomBarView new];
    [self addSubview:_markerView];
  }
  return self;
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (UIView *)currentContainerView
{
  return _markerView ?: self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _markerView.frame = self.bounds;
}

@end
