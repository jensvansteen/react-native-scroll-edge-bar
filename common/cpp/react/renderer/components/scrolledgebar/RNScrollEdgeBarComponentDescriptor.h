#pragma once

#include "RNScrollEdgeBarShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

class RNScrollEdgeBarComponentDescriptor final
    : public ConcreteComponentDescriptor<RNScrollEdgeBarShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
