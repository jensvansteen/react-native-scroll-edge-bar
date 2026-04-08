#pragma once

#include <react/renderer/components/scrolledgebar/EventEmitters.h>
#include <react/renderer/components/scrolledgebar/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

extern const char RNScrollEdgeBarTopBarComponentName[];

class RNScrollEdgeBarTopBarShadowNode final
    : public ConcreteViewShadowNode<
          RNScrollEdgeBarTopBarComponentName,
          RNScrollEdgeBarTopBarProps,
          RNScrollEdgeBarTopBarEventEmitter> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
