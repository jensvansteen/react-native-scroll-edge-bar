#pragma once

#include "RNScrollEdgeBarBottomBarShadowNode.h"

#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

class RNScrollEdgeBarBottomBarComponentDescriptor final
    : public ConcreteComponentDescriptor<RNScrollEdgeBarBottomBarShadowNode> {
 public:
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
};

} // namespace facebook::react
