import UIKit
import SwiftUI
import NitroModules

// MARK: - Marker Views

/// Marker view for top bar content
@objc(ScrollEdgeBarTopBarView)
class ScrollEdgeBarTopBarView: UIView {}

/// Marker view for bottom bar content
@objc(ScrollEdgeBarBottomBarView)
class ScrollEdgeBarBottomBarView: UIView {}

// MARK: - Nitro Hybrid Views

class HybridScrollEdgeBarTopBar: HybridRNScrollEdgeBarTopBarSpec {
    private let containerView = ScrollEdgeBarTopBarView()
    var view: UIView { containerView }
}

class HybridScrollEdgeBarBottomBar: HybridRNScrollEdgeBarBottomBarSpec {
    private let containerView = ScrollEdgeBarBottomBarView()
    var view: UIView { containerView }
}

class HybridScrollEdgeBar: HybridRNScrollEdgeBarSpec {
    private let containerView = ScrollEdgeBarContainerView()

    var view: UIView { containerView }

    var estimatedTopBarHeight: Double? = 60 {
        didSet {
            containerView.estimatedTopBarHeight = CGFloat(estimatedTopBarHeight ?? 60)
        }
    }

    var estimatedBottomBarHeight: Double? = 60 {
        didSet {
            containerView.estimatedBottomBarHeight = CGFloat(estimatedBottomBarHeight ?? 60)
        }
    }

    var topBarOffset: Double? = 0 {
        didSet {
            containerView.topBarOffset = CGFloat(topBarOffset ?? 0)
        }
    }

    var bottomBarOffset: Double? = 0 {
        didSet {
            containerView.bottomBarOffset = CGFloat(bottomBarOffset ?? 0)
        }
    }

    var topEdgeEffectStyle: String? = "automatic" {
        didSet {
            containerView.topEdgeEffectStyle = topEdgeEffectStyle ?? "automatic"
        }
    }

    var bottomEdgeEffectStyle: String? = "automatic" {
        didSet {
            containerView.bottomEdgeEffectStyle = bottomEdgeEffectStyle ?? "automatic"
        }
    }

}

// MARK: - Container View

@objcMembers
class ScrollEdgeBarContainerView: UIView {
    var estimatedTopBarHeight: CGFloat = 60
    var estimatedBottomBarHeight: CGFloat = 60
    var topBarOffset: CGFloat = 0 {
        didSet { offsetsDidChange() }
    }
    var bottomBarOffset: CGFloat = 0 {
        didSet { offsetsDidChange() }
    }
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
    private var didNotifyOffsets: Bool = false

    override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        return false
    }

    override func didAddSubview(_ subview: UIView) {
        super.didAddSubview(subview)
        detectChildViews()
    }

    override func willRemoveSubview(_ subview: UIView) {
        super.willRemoveSubview(subview)
        if subview === detectedTopBarView {
            detectedTopBarView = nil
        } else if subview === detectedBottomBarView {
            detectedBottomBarView = nil
        }
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

        // React Native may mount children after the container enters the hierarchy.
        if detectedScrollView == nil || detectedTopBarView == nil || detectedBottomBarView == nil {
            detectChildViews()
        }

        if !isSetup {
            trySetup()
        }
    }

    private func detectChildViews() {
        // In Fabric/Nitro, React children are siblings of this view inside the
        // generated component wrapper, not direct subviews of the container.
        let searchViews = superview?.subviews ?? subviews
        for subview in searchViews where subview !== self {
            if detectedTopBarView == nil,
               let topBarMarker = findView(ofType: ScrollEdgeBarTopBarView.self, in: subview) {
                // Use the wrapper that holds both the marker and the React content.
                detectedTopBarView = topBarMarker.superview ?? topBarMarker
            } else if detectedBottomBarView == nil,
                      let bottomBarMarker = findView(ofType: ScrollEdgeBarBottomBarView.self, in: subview) {
                detectedBottomBarView = bottomBarMarker.superview ?? bottomBarMarker
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
            detectedTopBarView = marker?.superview ?? marker
        } else {
            detectedTopBarView = nil
        }
        trySetup()
    }

    func setBottomBarView(_ view: UIView?) {
        if let view {
            let marker = findView(ofType: ScrollEdgeBarBottomBarView.self, in: view)
            detectedBottomBarView = marker?.superview ?? marker
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
        // Find nearest VC via responder chain
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

        // Prefer the direct child of the nearest system container so safe-area
        // propagation and scroll-edge behavior come from the correct owner.
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

    private func findBestScrollView(in root: UIView?) -> UIScrollView? {
        guard let root = root else { return nil }
        var best: UIScrollView?
        var bestArea: CGFloat = 0
        let containerFrame = convert(bounds, to: root)

        func visit(_ view: UIView) {
            if let scrollView = view as? UIScrollView {
                let frameInRoot = scrollView.convert(scrollView.bounds, to: root)
                let intersection = frameInRoot.intersection(containerFrame)
                let area = intersection.width * intersection.height
                let scrollable = scrollView.contentSize.height > scrollView.bounds.height + 1
                if scrollable && area > bestArea {
                    bestArea = area
                    best = scrollView
                }
            }
            for sub in view.subviews {
                visit(sub)
            }
        }

        visit(root)
        return best
    }

    private func trySetup() {
        guard !isSetup,
              let parent = parentViewController else { return }

        if detectedScrollView == nil {
            if let candidate = findBestScrollView(in: parent.view) {
                detectedScrollView = candidate
            }
        }

        guard let scrollView = detectedScrollView else {
            DispatchQueue.main.async {
                self.detectChildViews()
            }
            return
        }

        isSetup = true

        if #available(iOS 16.0, *) {
            let controller = ScrollEdgeBarController(scrollView: scrollView)
            controller.estimatedTopBarHeight = estimatedTopBarHeight
            controller.estimatedBottomBarHeight = estimatedBottomBarHeight
            controller.setOffsets(top: topBarOffset, bottom: bottomBarOffset)
            controller.setEdgeEffectStyles(top: topEdgeEffectStyle, bottom: bottomEdgeEffectStyle)

            if let topBarView = detectedTopBarView {
                controller.setTopBar(topBarView)
            }
            if let bottomBarView = detectedBottomBarView {
                controller.setBottomBar(bottomBarView)
            }

            let containerVC = parent
            containerVC.addChild(controller)

            if !didAttachControllerView {
                didAttachControllerView = true
                guard let hostView = containerVC.view else { return }
                controller.view.frame = hostView.bounds
                controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                hostView.addSubview(controller.view)
                controller.didMove(toParent: containerVC)
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
           let controller = edgeBarController as? ScrollEdgeBarController {
            controller.cleanup()
        }
        edgeBarController = nil
        isSetup = false
        didAttachControllerView = false
    }

    private func offsetsDidChange() {
        guard #available(iOS 16.0, *),
              let controller = edgeBarController as? ScrollEdgeBarController else { return }
        if !didNotifyOffsets {
            didNotifyOffsets = true
            DispatchQueue.main.async {
                self.didNotifyOffsets = false
                controller.setOffsets(top: self.topBarOffset, bottom: self.bottomBarOffset)
            }
        } else {
            controller.setOffsets(top: topBarOffset, bottom: bottomBarOffset)
        }
    }

    private func edgeEffectStylesDidChange() {
        guard #available(iOS 16.0, *),
              let controller = edgeBarController as? ScrollEdgeBarController else { return }
        controller.setEdgeEffectStyles(top: topEdgeEffectStyle, bottom: bottomEdgeEffectStyle)
    }
}

// MARK: - ScrollEdgeBarController

@available(iOS 16.0, *)
final class ScrollEdgeBarController: UIViewController {

    let scrollView: UIScrollView
    var estimatedTopBarHeight: CGFloat = 60
    var estimatedBottomBarHeight: CGFloat = 60
    var topBarOffset: CGFloat = 0
    var bottomBarOffset: CGFloat = 0
    var topEdgeEffectStyle: String = "automatic"
    var bottomEdgeEffectStyle: String = "automatic"
    private var topBarView: UIView?
    private var bottomBarView: UIView?
    private var hostingController: UIHostingController<ScrollEdgeBarWrapperView>?
    private var didSetup = false
    private var lastTopInset: CGFloat = 0
    private var lastBottomInset: CGFloat = 0
    private var displayLink: CADisplayLink?

    // Original parents and indices for teardown restore.
    private weak var scrollViewOriginalParent: UIView?
    private var scrollViewOriginalIndex: Int = 0
    private weak var topBarOriginalParent: UIView?
    private var topBarOriginalIndex: Int = 0
    private weak var bottomBarOriginalParent: UIView?
    private var bottomBarOriginalIndex: Int = 0

    init(scrollView: UIScrollView) {
        self.scrollView = scrollView
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func loadView() {
        view = PassthroughView()
    }

    func setTopBar(_ view: UIView) {
        if topBarOriginalParent == nil, let parent = view.superview {
            topBarOriginalParent = parent
            topBarOriginalIndex = parent.subviews.firstIndex(of: view) ?? 0
        }
        topBarView = view
        updateHostingControllerIfNeeded()
    }

    func setBottomBar(_ view: UIView) {
        if bottomBarOriginalParent == nil, let parent = view.superview {
            bottomBarOriginalParent = parent
            bottomBarOriginalIndex = parent.subviews.firstIndex(of: view) ?? 0
        }
        bottomBarView = view
        updateHostingControllerIfNeeded()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .clear
        scrollView.alpha = 0
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopDisplayLink()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if didSetup {
            startDisplayLink()
        }
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        guard !didSetup else { return }
        didSetup = true
        setupHostingController()
    }

    private func makeBarContent(_ uiView: UIView?, estimatedHeight: CGFloat) -> AnyView? {
        guard let uiView else { return nil }
        return AnyView(BarViewWrapper(barView: uiView, estimatedHeight: estimatedHeight))
    }

    private func setupHostingController() {
        if let parent = scrollView.superview {
            scrollViewOriginalParent = parent
            scrollViewOriginalIndex = parent.subviews.firstIndex(of: scrollView) ?? 0
        }
        scrollView.removeFromSuperview()

        let topContent = makeBarContent(topBarView, estimatedHeight: estimatedTopBarHeight)
        let bottomContent = makeBarContent(bottomBarView, estimatedHeight: estimatedBottomBarHeight)
        let wrapperView = ScrollEdgeBarWrapperView(
            scrollView: scrollView,
            topBarContent: topContent,
            bottomBarContent: bottomContent
        )

        let hosting = UIHostingController(rootView: wrapperView)
        hosting.view.backgroundColor = .clear
        hosting.view.isUserInteractionEnabled = true

        addChild(hosting)
        view.addSubview(hosting.view)
        hosting.view.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            hosting.view.topAnchor.constraint(equalTo: view.topAnchor),
            hosting.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hosting.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            hosting.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        hosting.didMove(toParent: self)
        hostingController = hosting
        hosting.view.layoutIfNeeded()
        applyEdgeEffectStyles()
        let estimatedInsets = UIEdgeInsets(
            top: estimatedTopBarHeight + topBarOffset,
            left: 0,
            bottom: estimatedBottomBarHeight + bottomBarOffset,
            right: 0
        )
        scrollView.contentInset = estimatedInsets
        scrollView.verticalScrollIndicatorInsets = estimatedInsets
        scrollView.contentOffset = CGPoint(x: 0, y: -estimatedInsets.top)
        scrollView.alpha = 1

        DispatchQueue.main.async {
            if #available(iOS 26.0, *) {
                // In the RN containment hierarchy, navigation tracking does not
                // get inferred automatically. Register the real wrapped scroll view.
                self.parent?.setContentScrollView(self.scrollView, for: .top)
            }
            self.applyInsets()
            self.startDisplayLink()
        }
    }

    private func updateHostingControllerIfNeeded() {
        guard didSetup else { return }

        let wrapperView = ScrollEdgeBarWrapperView(
            scrollView: scrollView,
            topBarContent: makeBarContent(topBarView, estimatedHeight: estimatedTopBarHeight),
            bottomBarContent: makeBarContent(bottomBarView, estimatedHeight: estimatedBottomBarHeight)
        )
        hostingController?.rootView = wrapperView

        DispatchQueue.main.async {
            self.applyInsets()
        }
    }

    func setOffsets(top: CGFloat, bottom: CGFloat) {
        topBarOffset = top
        bottomBarOffset = bottom
        updateHostingControllerIfNeeded()
    }

    func setEdgeEffectStyles(top: String, bottom: String) {
        topEdgeEffectStyle = top
        bottomEdgeEffectStyle = bottom
        applyEdgeEffectStyles()
    }

    private func applyEdgeEffectStyles() {
        guard #available(iOS 26.0, *) else { return }
        scrollView.topEdgeEffect.style = mapEdgeEffectStyle(topEdgeEffectStyle)
        scrollView.bottomEdgeEffect.style = mapEdgeEffectStyle(bottomEdgeEffectStyle)
    }

    @available(iOS 26.0, *)
    private func mapEdgeEffectStyle(_ style: String) -> UIScrollEdgeEffect.Style {
        switch style.lowercased() {
        case "hard":
            return .hard
        case "soft":
            return .soft
        default:
            return .automatic
        }
    }

    private func applyInsets() {
        let (topInset, bottomInset) = findEdgeBarInsets()
        let adjustedTop = topInset + topBarOffset
        let adjustedBottom = bottomInset + bottomBarOffset

        lastTopInset = adjustedTop
        lastBottomInset = adjustedBottom

        scrollView.contentInset = UIEdgeInsets(top: adjustedTop, left: 0, bottom: adjustedBottom, right: 0)
        scrollView.verticalScrollIndicatorInsets = UIEdgeInsets(top: adjustedTop, left: 0, bottom: adjustedBottom, right: 0)
        scrollView.contentOffset = CGPoint(x: 0, y: -adjustedTop)
    }

    private func startDisplayLink() {
        guard displayLink == nil else { return }
        let link = CADisplayLink(target: self, selector: #selector(displayLinkFired))
        link.add(to: .main, forMode: .common)
        displayLink = link
    }

    private func stopDisplayLink() {
        displayLink?.invalidate()
        displayLink = nil
    }

    @objc private func displayLinkFired() {
        let (topInset, bottomInset) = findEdgeBarInsets()
        let adjustedTop = topInset + topBarOffset
        let adjustedBottom = bottomInset + bottomBarOffset

        guard adjustedTop != lastTopInset || adjustedBottom != lastBottomInset else { return }

        lastTopInset = adjustedTop
        lastBottomInset = adjustedBottom

        let newInsets = UIEdgeInsets(top: adjustedTop, left: 0, bottom: adjustedBottom, right: 0)
        UIView.animate(withDuration: 0.3, delay: 0, options: [.beginFromCurrentState, .curveEaseInOut]) {
            self.scrollView.contentInset = newInsets
            self.scrollView.verticalScrollIndicatorInsets = newInsets
        }
    }

    private func findEdgeBarInsets() -> (top: CGFloat, bottom: CGFloat) {
        guard let rootView = navigationController?.view ?? view.window?.rootViewController?.view else {
            return (estimatedTopBarHeight, estimatedBottomBarHeight)
        }

        var topInset: CGFloat = estimatedTopBarHeight
        var bottomInset: CGFloat = estimatedBottomBarHeight
        let screenHeight = view.bounds.height

        findEdgeBarViews(in: rootView) { barView in
            let frameInWindow = barView.convert(barView.bounds, to: nil)

            if frameInWindow.origin.y < screenHeight / 2 {
                topInset = frameInWindow.maxY
            }

            if frameInWindow.maxY > screenHeight / 2 {
                bottomInset = screenHeight - frameInWindow.minY
            }
        }

        return (topInset, bottomInset)
    }

    private func findEdgeBarViews(in view: UIView, handler: (UIView) -> Void) {
        for interaction in view.interactions {
            let className = String(describing: type(of: interaction))
            if className.contains("ScrollPocketBarInteraction") {
                handler(view)
                return
            }
        }

        for subview in view.subviews {
            findEdgeBarViews(in: subview, handler: handler)
        }
    }

    /// Restore all reparented views to their original parents so Fabric unmount
    /// finds the expected hierarchy.
    func cleanup() {
        hostingController?.willMove(toParent: nil)
        hostingController?.view.removeFromSuperview()
        hostingController?.removeFromParent()
        hostingController = nil
        didSetup = false
        stopDisplayLink()

        scrollView.removeFromSuperview()
        scrollView.isScrollEnabled = true
        scrollView.contentInsetAdjustmentBehavior = .automatic
        scrollView.showsVerticalScrollIndicator = true
        scrollView.showsHorizontalScrollIndicator = true
        scrollView.alpha = 1
        if let parent = scrollViewOriginalParent {
            let idx = min(scrollViewOriginalIndex, parent.subviews.count)
            parent.insertSubview(scrollView, at: idx)
        }

        if let topBar = topBarView, let parent = topBarOriginalParent {
            topBar.removeFromSuperview()
            let idx = min(topBarOriginalIndex, parent.subviews.count)
            parent.insertSubview(topBar, at: idx)
        }
        if let bottomBar = bottomBarView, let parent = bottomBarOriginalParent {
            bottomBar.removeFromSuperview()
            let idx = min(bottomBarOriginalIndex, parent.subviews.count)
            parent.insertSubview(bottomBar, at: idx)
        }

        if #available(iOS 26.0, *) {
            parent?.setContentScrollView(nil, for: .top)
        }

        willMove(toParent: nil)
        view.removeFromSuperview()
        removeFromParent()
    }
}


// Allows hit-testing only on actual subviews (e.g. the bars).
final class PassthroughView: UIView {
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        for subview in subviews {
            let converted = subview.convert(point, from: self)
            guard subview.point(inside: converted, with: event) else { continue }
            if hasScrollPocketInteraction(in: subview) {
                return subview.hitTest(converted, with: event)
            }
        }
        return nil
    }

    private func hasScrollPocketInteraction(in view: UIView) -> Bool {
        for interaction in view.interactions {
            let className = String(describing: type(of: interaction))
            if className.contains("ScrollPocketBarInteraction") {
                return true
            }
        }
        for subview in view.subviews {
            if hasScrollPocketInteraction(in: subview) { return true }
        }
        return false
    }
}

// MARK: - SwiftUI Views

@available(iOS 16.0, *)
struct BarViewWrapper: UIViewRepresentable {
    let barView: UIView
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
        // Prefer the height React Native laid out for the wrapped bar view.
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

@available(iOS 16.0, *)
struct ScrollEdgeBarWrapperView: View {
    let scrollView: UIScrollView
    let topBarContent: AnyView?
    let bottomBarContent: AnyView?

    var body: some View {
        let base = DirectScrollViewWrapper(scrollView: scrollView)
            .ignoresSafeArea(.all)

        applyBars(to: base)
    }

    @ViewBuilder
    private func applyBars<V: View>(to view: V) -> some View {
        if #available(iOS 26.0, *) {
            applyScrollEdgeBars(to: view)
        } else {
            applyInsetBars(to: view)
        }
    }

    @available(iOS 26.0, *)
    @ViewBuilder
    private func applyScrollEdgeBars<V: View>(to view: V) -> some View {
        switch (topBarContent, bottomBarContent) {
        case (let top?, let bottom?):
            view
                .safeAreaBar(edge: .top) { top }
                .safeAreaBar(edge: .bottom) { bottom }
        case (let top?, nil):
            view
                .safeAreaBar(edge: .top) { top }
        case (nil, let bottom?):
            view
                .safeAreaBar(edge: .bottom) { bottom }
        case (nil, nil):
            view
        }
    }

    @ViewBuilder
    private func applyInsetBars<V: View>(to view: V) -> some View {
        switch (topBarContent, bottomBarContent) {
        case (let top?, let bottom?):
            view
                .safeAreaInset(edge: .top) { top }
                .safeAreaInset(edge: .bottom) { bottom }
        case (let top?, nil):
            view
                .safeAreaInset(edge: .top) { top }
        case (nil, let bottom?):
            view
                .safeAreaInset(edge: .bottom) { bottom }
        case (nil, nil):
            view
        }
    }
}

@available(iOS 16.0, *)
struct DirectScrollViewWrapper: UIViewRepresentable {
    let scrollView: UIScrollView

    func makeUIView(context: Context) -> UIView {
        let container = UIView()

        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.contentInsetAdjustmentBehavior = .never
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.alwaysBounceHorizontal = false
        scrollView.isDirectionalLockEnabled = true

        container.addSubview(scrollView)

        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: container.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])

        DispatchQueue.main.async {
            if let contentView = scrollView.subviews.first(where: { !($0 is UIImageView) }) {
                contentView.translatesAutoresizingMaskIntoConstraints = false
                NSLayoutConstraint.activate([
                    contentView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor)
                ])
            }
        }

        return container
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}
