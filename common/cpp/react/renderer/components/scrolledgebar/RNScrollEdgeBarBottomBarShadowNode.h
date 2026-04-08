#pragma once

#include <react/renderer/components/scrolledgebar/EventEmitters.h>
#include <react/renderer/components/scrolledgebar/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

extern const char RNScrollEdgeBarBottomBarComponentName[];

class RNScrollEdgeBarBottomBarShadowNode final
    : public ConcreteViewShadowNode<
          RNScrollEdgeBarBottomBarComponentName,
          RNScrollEdgeBarBottomBarProps,
          RNScrollEdgeBarBottomBarEventEmitter> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
