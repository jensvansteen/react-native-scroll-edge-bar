import UIKit
import SwiftUI
import ScrollEdgeBar

// MARK: - Marker Views

/// Marker view for top bar content
@objc(ScrollEdgeBarTopBarView)
class ScrollEdgeBarTopBarView: UIView {}

/// Marker view for bottom bar content
@objc(ScrollEdgeBarBottomBarView)
class ScrollEdgeBarBottomBarView: UIView {}

// MARK: - Container View

@objc(ScrollEdgeBarContainerView)
@objcMembers
class ScrollEdgeBarContainerView: UIView {
    var estimatedTopBarHeight: CGFloat = 0
    var estimatedBottomBarHeight: CGFloat = 0
    var prefersGlassEffect: Bool = true
    var topEdgeEffectStyle: String = "automatic" {
        didSet { edgeEffectStylesDidChange() }
    }
    var bottomEdgeEffectStyle: String = "automatic" {
        didSet { edgeEffectStylesDidChange() }
    }
    private var edgeBarController: AnyObject?
    private weak var parentViewController: UIViewController?
    private var isSetup = false

    private var detectedTopBarView: UIView?
    private var detectedBottomBarView: UIView?
    private var detectedScrollView: UIScrollView?
    private var didAttachControllerView = false

    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        return false
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil {
            parentViewController = findViewController()
            trySetup()
        }
    }

    override func layoutSubviews() {
        super.layoutSubviews()

        if detectedScrollView == nil || detectedTopBarView == nil || detectedBottomBarView == nil {
            detectChildViews()
        }

        if !isSetup {
            trySetup()
        }
    }

    private func detectChildViews() {
        let searchViews = superview?.subviews ?? subviews
        for subview in searchViews where subview !== self {
            if detectedTopBarView == nil,
               let topBarMarker = findView(ofType: ScrollEdgeBarTopBarView.self, in: subview) {
                detectedTopBarView = topBarMarker
            } else if detectedBottomBarView == nil,
                      let bottomBarMarker = findView(ofType: ScrollEdgeBarBottomBarView.self, in: subview) {
                detectedBottomBarView = bottomBarMarker
            } else if detectedScrollView == nil,
                      let scrollView = findScrollView(in: subview) {
                detectedScrollView = scrollView
            }
        }

        // Bars can appear after initial setup.
        if #available(iOS 16.0, *), isSetup,
           let controller = edgeBarController as? ScrollEdgeBarController {
            if let topBarView = detectedTopBarView {
                controller.setTopBar(topBarView)
            }
            if let bottomBarView = detectedBottomBarView {
                controller.setBottomBar(bottomBarView)
            }
        }

        trySetup()
    }

    // Explicit wiring from the generated component view.
    func setTopBarView(_ view: UIView?) {
        if let view {
            let marker = findView(ofType: ScrollEdgeBarTopBarView.self, in: view)
            detectedTopBarView = marker
        } else {
            detectedTopBarView = nil
        }
        trySetup()
    }

    func setBottomBarView(_ view: UIView?) {
        if let view {
            let marker = findView(ofType: ScrollEdgeBarBottomBarView.self, in: view)
            detectedBottomBarView = marker
        } else {
            detectedBottomBarView = nil
        }
        trySetup()
    }

    func setScrollView(_ view: UIView?) {
        if let view {
            detectedScrollView = findScrollView(in: view)
        } else {
            detectedScrollView = nil
        }
        trySetup()
    }

    private func findView<T: UIView>(ofType type: T.Type, in view: UIView) -> T? {
        if let found = view as? T { return found }
        for subview in view.subviews {
            if let found = findView(ofType: type, in: subview) { return found }
        }
        return nil
    }

    private func findScrollView(in view: UIView) -> UIScrollView? {
        if view is ScrollEdgeBarTopBarView || view is ScrollEdgeBarBottomBarView { return nil }
        if let scrollView = extractScrollView(from: view) { return scrollView }
        for subview in view.subviews {
            if let found = findScrollView(in: subview) { return found }
        }
        return nil
    }

    private func extractScrollView(from view: UIView) -> UIScrollView? {
        if let scrollView = view as? UIScrollView { return scrollView }
        let selector = NSSelectorFromString("scrollView")
        if view.responds(to: selector),
           let unmanaged = view.perform(selector),
           let scrollView = unmanaged.takeUnretainedValue() as? UIScrollView {
            return scrollView
        }
        let privateSelector = NSSelectorFromString("_scrollView")
        if view.responds(to: privateSelector),
           let unmanaged = view.perform(privateSelector),
           let scrollView = unmanaged.takeUnretainedValue() as? UIScrollView {
            return scrollView
        }
        return nil
    }

    private func findViewController() -> UIViewController? {
        var responder: UIResponder? = self
        var nearestVC: UIViewController?
        while let nextResponder = responder?.next {
            if let vc = nextResponder as? UIViewController {
                nearestVC = vc
                break
            }
            responder = nextResponder
        }

        guard let startVC = nearestVC else { return nil }

        var candidate = startVC
        while let parentVC = candidate.parent {
            if parentVC is UITabBarController {
                return candidate
            }
            if parentVC is UINavigationController {
                return candidate
            }
            candidate = parentVC
        }

        return startVC
    }

    private func trySetup() {
        guard !isSetup,
              let parent = parentViewController,
              let scrollView = detectedScrollView else {
            if !isSetup && detectedScrollView == nil {
                DispatchQueue.main.async { self.detectChildViews() }
            }
            return
        }

        isSetup = true

        if #available(iOS 16.0, *) {
            let controller = RNScrollEdgeBarController(scrollView: scrollView, prefersGlassEffect: prefersGlassEffect)
            controller.estimatedTopBarHeight = estimatedTopBarHeight
            controller.estimatedBottomBarHeight = estimatedBottomBarHeight

            if let topBarView = detectedTopBarView {
                controller.setTopBar(topBarView)
            }
            if let bottomBarView = detectedBottomBarView {
                controller.setBottomBar(bottomBarView)
            }

            applyEdgeEffectStyles(to: scrollView)

            parent.addChild(controller)

            if !didAttachControllerView {
                didAttachControllerView = true
                guard let hostView = parent.view else { return }
                controller.view.frame = hostView.bounds
                controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                hostView.addSubview(controller.view)
                controller.didMove(toParent: parent)
            }

            edgeBarController = controller
        }
    }

    /// Called from generated ObjC++ unmount code before Fabric tears down children.
    @objc func prepareForFabricUnmount() {
        cleanupController()
    }

    private func cleanupController() {
        if #available(iOS 16.0, *),
           let controller = edgeBarController as? RNScrollEdgeBarController {
            controller.fabricCleanup()
        }
        edgeBarController = nil
        isSetup = false
        didAttachControllerView = false
    }

    private func edgeEffectStylesDidChange() {
        applyEdgeEffectStyles(to: detectedScrollView)
    }

    private func applyEdgeEffectStyles(to scrollView: UIScrollView?) {
        guard #available(iOS 26.0, *), let scrollView else { return }
        scrollView.topEdgeEffect.style = mapEdgeEffectStyle(topEdgeEffectStyle)
        scrollView.bottomEdgeEffect.style = mapEdgeEffectStyle(bottomEdgeEffectStyle)
    }

    @available(iOS 26.0, *)
    private func mapEdgeEffectStyle(_ style: String) -> UIScrollEdgeEffect.Style {
        switch style.lowercased() {
        case "hard": return .hard
        case "soft": return .soft
        default: return .automatic
        }
    }
}

// MARK: - PassthroughView

// Forwards touches to subviews, passes through anything that lands on the
// view itself with no subview hit - so RN UI behind the overlay is not blocked.
final class PassthroughView: UIView {
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let result = super.hitTest(point, with: event)
        return result === self ? nil : result
    }
}

// MARK: - RNScrollEdgeBarController

/// Subclass of `ScrollEdgeBarController` that integrates with React Native Fabric.
///
/// Responsibilities on top of the base class:
/// - `BarViewWrapper` with RN-specific sizing (uses Fabric-laid-out height first).
/// - Tracks bar view and scroll view original parents so `fabricCleanup()` can
///   restore them to the Fabric hierarchy before the framework tears it down.
@available(iOS 16.0, *)
final class RNScrollEdgeBarController: ScrollEdgeBarController {

    // MARK: - Fabric restore state

    private var rnTopBarView: UIView?
    private var rnBottomBarView: UIView?
    private let topSlotHostView = ScrollEdgeBarSlotHostView()
    private let bottomSlotHostView = ScrollEdgeBarSlotHostView()
    private var adoptedViewControllers: [UIViewController] = []
    private weak var topBarOriginalParent: UIView?
    private var topBarOriginalIndex: Int = 0
    private weak var bottomBarOriginalParent: UIView?
    private var bottomBarOriginalIndex: Int = 0
    private weak var rnScrollViewOriginalParent: UIView?
    private var rnScrollViewOriginalIndex: Int = 0

    // MARK: - Overrides

    override func loadView() {
        view = PassthroughView()
    }

    /// Capture the scroll view's Fabric parent before `setupHostingController`
    /// reparents it into SwiftUI. `viewDidLoad` fires after `addChild` but
    /// before `viewDidLayoutSubviews`, so the scroll view is still in place.
    override func viewDidLoad() {
        rnScrollViewOriginalParent = scrollView.superview
        rnScrollViewOriginalIndex = scrollView.superview?.subviews.firstIndex(of: scrollView) ?? 0
        super.viewDidLoad()
    }

    override func setTopBar(_ view: UIView) {
        if topBarOriginalParent == nil, let parent = view.superview {
            topBarOriginalParent = parent
            topBarOriginalIndex = parent.subviews.firstIndex(of: view) ?? 0
        }
        rnTopBarView = view
        topSlotHostView.setContentView(view)
        super.setTopBar(topSlotHostView)
    }

    override func setBottomBar(_ view: UIView) {
        if bottomBarOriginalParent == nil, let parent = view.superview {
            bottomBarOriginalParent = parent
            bottomBarOriginalIndex = parent.subviews.firstIndex(of: view) ?? 0
        }
        rnBottomBarView = view
        bottomSlotHostView.setContentView(view)
        super.setBottomBar(bottomSlotHostView)
    }

    override func makeBarContent(for uiView: UIView?) -> AnyView? {
        guard let uiView else { return nil }
        let estimated = uiView === topSlotHostView ? estimatedTopBarHeight : estimatedBottomBarHeight
        let measuredView = uiView === topSlotHostView ? topBarOriginalParent : bottomBarOriginalParent
        return AnyView(BarViewWrapper(
            barView: uiView,
            measuredView: measuredView,
            estimatedHeight: estimated
        ))
    }

    // MARK: - Fabric teardown

    /// Restores all reparented views to their Fabric parents and removes this
    /// controller. `beginAppearanceTransition(false:)` fires `viewWillDisappear`
    /// inside the package, which stops the display link without needing to expose
    /// any private state.
    func fabricCleanup() {
        topSlotHostView.setContentView(nil)
        bottomSlotHostView.setContentView(nil)

        if let topBar = rnTopBarView, let parent = topBarOriginalParent {
            topBar.removeFromSuperview()
            let idx = min(topBarOriginalIndex, parent.subviews.count)
            parent.insertSubview(topBar, at: idx)
        }
        if let bottomBar = rnBottomBarView, let parent = bottomBarOriginalParent {
            bottomBar.isHidden = false
            bottomBar.removeFromSuperview()
            let idx = min(bottomBarOriginalIndex, parent.subviews.count)
            parent.insertSubview(bottomBar, at: idx)
        }

        scrollView.removeFromSuperview()
        scrollView.isScrollEnabled = true
        scrollView.contentInsetAdjustmentBehavior = .automatic
        scrollView.showsVerticalScrollIndicator = true
        scrollView.showsHorizontalScrollIndicator = true
        scrollView.alpha = 1
        if let parent = rnScrollViewOriginalParent {
            let idx = min(rnScrollViewOriginalIndex, parent.subviews.count)
            parent.insertSubview(scrollView, at: idx)
        }

        if #available(iOS 26.0, *) {
            parent?.setContentScrollView(nil, for: .top)
        }

        willMove(toParent: nil)
        beginAppearanceTransition(false, animated: false)
        view.removeFromSuperview()
        endAppearanceTransition()
        removeFromParent()
    }
}

// MARK: - BarViewWrapper

/// React Native-specific bar content wrapper. Unlike the package's default
/// `BarViewWrapper`, this version:
/// - Uses autoresizing mask for Fabric marker views (whose frames are set by RN layout)
/// - Reports the RN-laid-out `barView.bounds.height` before falling back to
///   `estimatedHeight` or `systemLayoutSizeFitting`.
@available(iOS 16.0, *)
struct BarViewWrapper: UIViewRepresentable {
    let barView: UIView
    weak var measuredView: UIView?
    let estimatedHeight: CGFloat

    func makeUIView(context: Context) -> UIView {
        let container = UIView()
        barView.removeFromSuperview()
        barView.isHidden = false
        if barView is ScrollEdgeBarTopBarView || barView is ScrollEdgeBarBottomBarView {
            barView.translatesAutoresizingMaskIntoConstraints = true
            barView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            barView.frame = container.bounds
            container.addSubview(barView)
        } else {
            barView.translatesAutoresizingMaskIntoConstraints = false
            container.addSubview(barView)

            NSLayoutConstraint.activate([
                barView.topAnchor.constraint(equalTo: container.topAnchor),
                barView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
                barView.trailingAnchor.constraint(equalTo: container.trailingAnchor),
                barView.bottomAnchor.constraint(equalTo: container.bottomAnchor)
            ])
        }

        return container
    }

    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UIView, context: Context) -> CGSize? {
        let width = proposal.width ?? UIView.layoutFittingExpandedSize.width
        if let measuredHeight = measuredView?.bounds.height, measuredHeight > 0 {
            return CGSize(width: width, height: measuredHeight)
        }
        let height = barView.bounds.height
        if height > 0 {
            return CGSize(width: width, height: height)
        }
        if estimatedHeight > 0 {
            return CGSize(width: width, height: estimatedHeight)
        }
        let size = barView.systemLayoutSizeFitting(
            CGSize(width: width, height: UIView.layoutFittingCompressedSize.height),
            withHorizontalFittingPriority: .required,
            verticalFittingPriority: .fittingSizeLevel
        )
        return CGSize(width: width, height: size.height)
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        if barView is ScrollEdgeBarTopBarView || barView is ScrollEdgeBarBottomBarView {
            barView.frame = uiView.bounds
        }
    }
}
