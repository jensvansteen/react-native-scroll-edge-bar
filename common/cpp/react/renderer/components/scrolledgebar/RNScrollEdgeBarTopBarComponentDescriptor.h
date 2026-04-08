#pragma once

#include "RNScrollEdgeBarTopBarShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

class RNScrollEdgeBarTopBarComponentDescriptor final
    : public ConcreteComponentDescriptor<RNScrollEdgeBarTopBarShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
