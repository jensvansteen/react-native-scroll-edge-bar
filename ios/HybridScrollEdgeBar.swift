import UIKit
import SwiftUI
import NitroModules

// MARK: - Marker Views

/// Marker view for top bar content
class ScrollEdgeBarTopBarView: UIView {}

/// Marker view for bottom bar content
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
}

// MARK: - Container View

class ScrollEdgeBarContainerView: UIView {

    var estimatedTopBarHeight: CGFloat = 60
    var estimatedBottomBarHeight: CGFloat = 60

    private var edgeBarController: AnyObject?
    private weak var parentViewController: UIViewController?
    private var isSetup = false

    private var detectedTopBarView: UIView?
    private var detectedBottomBarView: UIView?
    private var detectedScrollView: UIScrollView?
    private var didAttachControllerView = false
    private var attachAttempts = 0

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

        if #available(iOS 26.0, *) {
            if let controller = edgeBarController as? ScrollEdgeBarController {
                controller.view.frame = bounds
            }
        }

        if detectedScrollView == nil {
            detectChildViews()
        }

        if !isSetup {
            trySetup()
        }
    }

    private func detectChildViews() {
        for subview in subviews {
            if let topBarView = findView(ofType: ScrollEdgeBarTopBarView.self, in: subview) {
                detectedTopBarView = topBarView
            } else if let bottomBarView = findView(ofType: ScrollEdgeBarBottomBarView.self, in: subview) {
                detectedBottomBarView = bottomBarView
            } else if detectedScrollView == nil,
                      let scrollView = findScrollView(in: subview) {
                detectedScrollView = scrollView
            }
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
        if let scrollView = view as? UIScrollView { return scrollView }
        for subview in view.subviews {
            if let found = findScrollView(in: subview) { return found }
        }
        return nil
    }

    private func findScrollViewInParent(parentView: UIView) -> UIScrollView? {
        let containerFrameInWindow = convert(bounds, to: nil)
        var bestMatch: UIScrollView?
        var bestIntersectionArea: CGFloat = 0

        func walk(_ view: UIView) {
            if let scrollView = view as? UIScrollView {
                let frameInWindow = scrollView.convert(scrollView.bounds, to: nil)
                let intersection = frameInWindow.intersection(containerFrameInWindow)
                let area = intersection.width * intersection.height
                if area > bestIntersectionArea {
                    bestIntersectionArea = area
                    bestMatch = scrollView
                }
            }
            for subview in view.subviews {
                walk(subview)
            }
        }

        walk(parentView)
        return bestMatch
    }

    private func findViewController() -> UIViewController? {
        var responder: UIResponder? = self
        while let nextResponder = responder?.next {
            if let vc = nextResponder as? UIViewController { return vc }
            responder = nextResponder
        }
        return nil
    }

    private func trySetup() {
        guard !isSetup,
              let parent = parentViewController else { return }

        if detectedScrollView == nil {
            detectedScrollView = findScrollViewInParent(parentView: parent.view)
        }

        guard let scrollView = detectedScrollView else { return }

        isSetup = true

        if #available(iOS 26.0, *) {
            let controller = ScrollEdgeBarController(scrollView: scrollView)
            controller.estimatedTopBarHeight = estimatedTopBarHeight
            controller.estimatedBottomBarHeight = estimatedBottomBarHeight

            if let topBarView = detectedTopBarView {
                controller.setTopBar(topBarView)
            }
            if let bottomBarView = detectedBottomBarView {
                controller.setBottomBar(bottomBarView)
            }

            let containerVC = parent.navigationController ?? parent
            containerVC.addChild(controller)

            if !didAttachControllerView {
                didAttachControllerView = true
                guard let hostView = containerVC.view else { return }
                DispatchQueue.main.async {
                    if hostView.window == nil, self.attachAttempts < 3 {
                        self.attachAttempts += 1
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                            self.trySetup()
                        }
                        return
                    }

                    if let currentSuperview = controller.view.superview, currentSuperview !== hostView {
                        controller.view.removeFromSuperview()
                    }

                    controller.view.translatesAutoresizingMaskIntoConstraints = false
                    guard controller.view.superview == nil else { return }
                    hostView.addSubview(controller.view)
                    hostView.bringSubviewToFront(controller.view)
                    NSLayoutConstraint.activate([
                        controller.view.topAnchor.constraint(equalTo: hostView.topAnchor),
                        controller.view.leadingAnchor.constraint(equalTo: hostView.leadingAnchor),
                        controller.view.trailingAnchor.constraint(equalTo: hostView.trailingAnchor),
                        controller.view.bottomAnchor.constraint(equalTo: hostView.bottomAnchor),
                    ])
                    controller.didMove(toParent: containerVC)
                }
            }

            edgeBarController = controller
        }
    }
}

// MARK: - ScrollEdgeBarController (iOS 26+)

@available(iOS 26.0, *)
final class ScrollEdgeBarController: UIViewController {

    let scrollView: UIScrollView
    var estimatedTopBarHeight: CGFloat = 60
    var estimatedBottomBarHeight: CGFloat = 60

    private var topBarView: UIView?
    private var bottomBarView: UIView?
    private var hostingController: UIHostingController<ScrollEdgeBarWrapperView>?
    private var didSetup = false
    private var lastTopInset: CGFloat = 0
    private var lastBottomInset: CGFloat = 0
    private var displayLink: CADisplayLink?

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
        topBarView = view
        updateHostingControllerIfNeeded()
    }

    func setBottomBar(_ view: UIView) {
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
        if didSetup { startDisplayLink() }
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        guard !didSetup else { return }
        didSetup = true
        setupHostingController()
    }

    private func makeBarContent(_ uiView: UIView?) -> AnyView? {
        guard let uiView else { return nil }
        return AnyView(BarViewWrapper(barView: uiView))
    }

    private func setupHostingController() {
        scrollView.removeFromSuperview()

        let wrapperView = ScrollEdgeBarWrapperView(
            scrollView: scrollView,
            topBarContent: makeBarContent(topBarView),
            bottomBarContent: makeBarContent(bottomBarView)
        )

        let hosting = UIHostingController(rootView: wrapperView)
        hosting.view.backgroundColor = .clear
        hosting.view.isUserInteractionEnabled = false

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

  
        scrollView.contentInset = UIEdgeInsets(top: estimatedTopBarHeight, left: 0, bottom: estimatedBottomBarHeight, right: 0)
        scrollView.verticalScrollIndicatorInsets = scrollView.contentInset
        scrollView.contentOffset = CGPoint(x: 0, y: -estimatedTopBarHeight)
        scrollView.alpha = 1

        DispatchQueue.main.async {
            self.applyInsets()
            self.startDisplayLink()
        }
    }

    private func updateHostingControllerIfNeeded() {
        guard didSetup else { return }

        let wrapperView = ScrollEdgeBarWrapperView(
            scrollView: scrollView,
            topBarContent: makeBarContent(topBarView),
            bottomBarContent: makeBarContent(bottomBarView)
        )
        hostingController?.rootView = wrapperView

        DispatchQueue.main.async { self.applyInsets() }
    }

    private func applyInsets() {
        let (topInset, bottomInset) = findEdgeBarInsets()
        lastTopInset = topInset
        lastBottomInset = bottomInset

        scrollView.contentInset = UIEdgeInsets(top: topInset, left: 0, bottom: bottomInset, right: 0)
        scrollView.verticalScrollIndicatorInsets = UIEdgeInsets(top: topInset, left: 0, bottom: bottomInset, right: 0)
        scrollView.contentOffset = CGPoint(x: 0, y: -topInset)
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
        guard topInset != lastTopInset || bottomInset != lastBottomInset else { return }

        lastTopInset = topInset
        lastBottomInset = bottomInset

        let newInsets = UIEdgeInsets(top: topInset, left: 0, bottom: bottomInset, right: 0)
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

// MARK: - SwiftUI Views (iOS 26+)

@available(iOS 26.0, *)
struct BarViewWrapper: UIViewRepresentable {
    let barView: UIView

    func makeUIView(context: Context) -> UIView {
        let container = UIView()
        barView.removeFromSuperview()
        barView.isHidden = false
        barView.translatesAutoresizingMaskIntoConstraints = false
        container.addSubview(barView)

        NSLayoutConstraint.activate([
            barView.topAnchor.constraint(equalTo: container.topAnchor),
            barView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            barView.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            barView.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])

        return container
    }

    func sizeThatFits(_ proposal: ProposedViewSize, uiView: UIView, context: Context) -> CGSize? {
        let width = proposal.width ?? UIView.layoutFittingExpandedSize.width
        let size = barView.systemLayoutSizeFitting(
            CGSize(width: width, height: UIView.layoutFittingCompressedSize.height),
            withHorizontalFittingPriority: .required,
            verticalFittingPriority: .fittingSizeLevel
        )
        return CGSize(width: width, height: size.height)
    }

    func updateUIView(_ uiView: UIView, context: Context) {}
}

@available(iOS 26.0, *)
struct ScrollEdgeBarWrapperView: View {
    let scrollView: UIScrollView
    let topBarContent: AnyView?
    let bottomBarContent: AnyView?

    var body: some View {
        let base = ScrollViewWrapper(scrollView: scrollView)
           .ignoresSafeArea(.all)
        applyBars(to: base)
    }

    @ViewBuilder
    private func applyBars<V: View>(to view: V) -> some View {
        switch (topBarContent, bottomBarContent) {
        case let (top?, bottom?):
            view
                .safeAreaBar(edge: .top) { top }
                .safeAreaBar(edge: .bottom) { bottom }
        case let (top?, nil):
            view.safeAreaBar(edge: .top) { top }
        case let (nil, bottom?):
            view.safeAreaBar(edge: .bottom) { bottom }
        case (nil, nil):
            view
        }
    }
}

@available(iOS 26.0, *)
struct ScrollViewWrapper: UIViewRepresentable {
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
