#import "RNScrollEdgeBarTopBarComponentView.h"

#import <react/renderer/components/scrolledgebar/RNScrollEdgeBarTopBarComponentDescriptor.h>
#import <react/renderer/components/scrolledgebar/Props.h>

@interface ScrollEdgeBarTopBarView : UIView
@end

using namespace facebook::react;

@implementation RNScrollEdgeBarTopBarComponentView
{
  ScrollEdgeBarTopBarView *_markerView;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNScrollEdgeBarTopBarComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNScrollEdgeBarTopBarProps>();
    _props = defaultProps;
    _markerView = [ScrollEdgeBarTopBarView new];
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
