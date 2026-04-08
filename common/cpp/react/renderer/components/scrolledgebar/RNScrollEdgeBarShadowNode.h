#pragma once

#include <react/renderer/components/scrolledgebar/EventEmitters.h>
#include <react/renderer/components/scrolledgebar/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

extern const char RNScrollEdgeBarComponentName[];

class RNScrollEdgeBarShadowNode final
    : public ConcreteViewShadowNode<
          RNScrollEdgeBarComponentName,
          RNScrollEdgeBarProps,
          RNScrollEdgeBarEventEmitter> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
};

} // namespace facebook::react
