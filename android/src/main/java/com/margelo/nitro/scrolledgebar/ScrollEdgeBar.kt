package com.margelo.nitro.scrolledgebar

import android.view.View
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.uimanager.ThemedReactContext

@DoNotStrip
class HybridScrollEdgeBar(private val context: ThemedReactContext) : HybridRNScrollEdgeBarSpec() {

  override val view: View = View(context)

  override var estimatedTopBarHeight: Double? = null
  override var estimatedBottomBarHeight: Double? = null
  override var topBarOffset: Double? = null
  override var bottomBarOffset: Double? = null
  override var topEdgeEffectStyle: String? = null
  override var bottomEdgeEffectStyle: String? = null
}
