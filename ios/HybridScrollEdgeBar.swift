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

    override func willMove(toWindow newWindow: UIWindow?) {
        super.willMove(toWindow: newWindow)
        // Before the view is removed from the window, restore all reparented
        // Fabric views so Fabric's unmount code finds them in the expected parent.
        if newWindow == nil && window != nil {
            cleanupController()
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

        // Always re-detect if any view is missing — React Native may mount
        // component children AFTER the component wrapper is added to the parent.
        if detectedScrollView == nil || detectedTopBarView == nil || detectedBottomBarView == nil {
            detectChildViews()
        }

        if !isSetup {
            trySetup()
        }
    }

    private func detectChildViews() {
        // In Fabric/Nitro, React children are siblings of our view (subviews of the
        // component wrapper), not subviews of our container. Search the parent's children.
        let searchViews = superview?.subviews ?? subviews
        for subview in searchViews where subview !== self {
            if detectedTopBarView == nil,
               let topBarMarker = findView(ofType: ScrollEdgeBarTopBarView.self, in: subview) {
                // Use the component wrapper (superview) which holds both the marker
                // and the actual React content (Fabric adds children as siblings).
                detectedTopBarView = topBarMarker.superview ?? topBarMarker
            } else if detectedBottomBarView == nil,
                      let bottomBarMarker = findView(ofType: ScrollEdgeBarBottomBarView.self, in: subview) {
                detectedBottomBarView = bottomBarMarker.superview ?? bottomBarMarker
            } else if detectedScrollView == nil,
                      let scrollView = findScrollView(in: subview) {
                detectedScrollView = scrollView
            }
        }

        // If already set up, push newly-detected bar views to the controller
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

    // Explicit wiring from the component view (preferred over discovery)
    func setTopBarView(_ view: UIView?) {
        detectedTopBarView = view as? ScrollEdgeBarTopBarView
        trySetup()
    }

    func setBottomBarView(_ view: UIView?) {
        detectedBottomBarView = view as? ScrollEdgeBarBottomBarView
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

        // Walk up the VC parent chain and prefer the direct child of UITabBarController
        // first, then fall back to the direct child of UINavigationController.
        // This keeps the hosting controller close to the system container that owns
        // the relevant safe area and scroll-edge behavior.
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

    /// Called from the generated ObjC++ unmount code to tear down the SwiftUI
    /// hosting controller and restore reparented views before Fabric's assertions.
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
}

// MARK: - ScrollEdgeBarController (iOS 16+, scroll-edge effect requires iOS 26)

@available(iOS 16.0, *)
final class ScrollEdgeBarController: UIViewController {

    let scrollView: UIScrollView
    var estimatedTopBarHeight: CGFloat = 60
    var estimatedBottomBarHeight: CGFloat = 60
    var topBarOffset: CGFloat = 0
    var bottomBarOffset: CGFloat = 0

    private var topBarView: UIView?
    private var bottomBarView: UIView?
    private var hostingController: UIHostingController<ScrollEdgeBarWrapperView>?
    private var didSetup = false
    private var registeredScrollObservation: NSKeyValueObservation?
    private var registeredScrollDebugCount = 0

    // Track original Fabric parents + subview indices for teardown restore
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
            bottomBarContent: bottomContent,
            topBarOffset: topBarOffset,
            bottomBarOffset: bottomBarOffset
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

        // Register the SwiftUI scroll view with the navigation bar so the large
        // title collapses naturally as the user scrolls. Done async so SwiftUI
        // has finished its first layout pass before we search the hierarchy.
        // This API is available on UIViewController and used here so the
        // navigation bar tracks the SwiftUI-hosted scroll view instead of the
        // original reparented React Native scroll view.
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }
            let swiftuiScrollView = self.findSwiftUIScrollView()
            self.logScrollGeometry(label: "rn", scrollView: self.scrollView)
            if let swiftuiScrollView {
                self.logScrollGeometry(label: "swiftui", scrollView: swiftuiScrollView)
            }
            self.startRegisteredScrollDebug(label: "registered", on: self.scrollView)
            self.parent?.setContentScrollView(self.scrollView, for: .top)
        }
    }

    private func logScrollGeometry(label: String, scrollView: UIScrollView) {
        print("[ScrollEdgeBar][NavTrack][\(label)] class=\(NSStringFromClass(type(of: scrollView))) contentInset.top=\(scrollView.contentInset.top) adjustedTop=\(scrollView.adjustedContentInset.top) offsetY=\(scrollView.contentOffset.y)")
    }

    private func startRegisteredScrollDebug(label: String, on scrollView: UIScrollView) {
        registeredScrollObservation = nil
        registeredScrollDebugCount = 0

        print("[ScrollEdgeBar][NavTrack][\(label)] register class=\(NSStringFromClass(type(of: scrollView))) contentInset.top=\(scrollView.contentInset.top) adjustedTop=\(scrollView.adjustedContentInset.top) offsetY=\(scrollView.contentOffset.y)")

        registeredScrollObservation = scrollView.observe(\.contentOffset, options: [.new]) { [weak self] sv, _ in
            guard let self else { return }
            guard self.registeredScrollDebugCount < 20 else { return }
            self.registeredScrollDebugCount += 1
            print("[ScrollEdgeBar][NavTrack][\(label)] offsetY=\(sv.contentOffset.y) contentInset.top=\(sv.contentInset.top) adjustedTop=\(sv.adjustedContentInset.top)")
        }
    }

    private func findSwiftUIScrollView() -> UIScrollView? {
        guard let hostingView = hostingController?.view else { return nil }
        return firstScrollView(in: hostingView)
    }

    private func firstScrollView(in view: UIView) -> UIScrollView? {
        if let sv = view as? UIScrollView { return sv }
        for sub in view.subviews {
            if let found = firstScrollView(in: sub) { return found }
        }
        return nil
    }

    private func updateHostingControllerIfNeeded() {
        guard didSetup else { return }

        let wrapperView = ScrollEdgeBarWrapperView(
            scrollView: scrollView,
            topBarContent: makeBarContent(topBarView, estimatedHeight: estimatedTopBarHeight),
            bottomBarContent: makeBarContent(bottomBarView, estimatedHeight: estimatedBottomBarHeight),
            topBarOffset: topBarOffset,
            bottomBarOffset: bottomBarOffset
        )
        hostingController?.rootView = wrapperView
    }

    func setOffsets(top: CGFloat, bottom: CGFloat) {
        topBarOffset = top
        bottomBarOffset = bottom
        updateHostingControllerIfNeeded()
    }

    /// Restore all reparented views to their original Fabric parents so
    /// Fabric's unmount logic finds them in the expected location.
    func cleanup() {
        // Tear down hosting controller first
        hostingController?.willMove(toParent: nil)
        hostingController?.view.removeFromSuperview()
        hostingController?.removeFromParent()
        hostingController = nil
        didSetup = false
        registeredScrollObservation = nil
        registeredScrollDebugCount = 0

        // Restore scroll view at its original index
        scrollView.removeFromSuperview()
        scrollView.isScrollEnabled = true
        scrollView.contentInsetAdjustmentBehavior = .automatic
        scrollView.showsVerticalScrollIndicator = true
        scrollView.showsHorizontalScrollIndicator = true
        if let parent = scrollViewOriginalParent {
            let idx = min(scrollViewOriginalIndex, parent.subviews.count)
            parent.insertSubview(scrollView, at: idx)
        }

        // Restore bar views at their original indices
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

        // Deregister the scroll view from the navigation bar
        if #available(iOS 26.0, *) {
            parent?.setContentScrollView(nil, for: .top)
        }

        // Remove self from parent VC
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

// MARK: - SwiftUI Views (iOS 16+, scroll-edge effect requires iOS 26)

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
        // Prefer the bounds height set by React Native's layout engine
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
    let topBarOffset: CGFloat
    let bottomBarOffset: CGFloat
    @State private var contentHeight: CGFloat = 5000

    var body: some View {
        applyBars(to:
            ScrollView {
                ScrollContentBridge(scrollView: scrollView, contentHeight: $contentHeight)
                    .frame(height: contentHeight)
            }
        )
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

/// Embeds the RN scroll view (with scrolling disabled) inside a native SwiftUI
/// ScrollView. SwiftUI handles scrolling so `safeAreaBar` works correctly.
/// The scroll view is kept intact (no content extraction) so it survives
/// rootView updates when bars are detected late.
@available(iOS 16.0, *)
struct ScrollContentBridge: UIViewRepresentable {
    let scrollView: UIScrollView
    @Binding var contentHeight: CGFloat

    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> UIScrollView {
        scrollView.isScrollEnabled = false
        scrollView.contentInsetAdjustmentBehavior = .never
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false

        // Observe content size changes to update SwiftUI layout
        context.coordinator.observation = scrollView.observe(\.contentSize, options: [.new]) { sv, _ in
            let newHeight = sv.contentSize.height
            if newHeight > 0 && newHeight != contentHeight {
                DispatchQueue.main.async {
                    contentHeight = newHeight
                }
            }
        }

        if scrollView.contentSize.height > 0 {
            DispatchQueue.main.async {
                contentHeight = scrollView.contentSize.height
            }
        }

        return scrollView
    }

    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UIScrollView, context: Context) -> CGSize? {
        let width = proposal.width ?? uiView.bounds.width
        return CGSize(width: width, height: max(contentHeight, 1))
    }

    func updateUIView(_ uiView: UIScrollView, context: Context) {}

    class Coordinator: NSObject {
        var observation: NSKeyValueObservation?
    }
}
