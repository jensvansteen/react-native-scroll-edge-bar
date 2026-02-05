import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "ScrollEdgeBarExample",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  private weak var tabsController: UITabBarController?
  private weak var navigationController: UINavigationController?
  private weak var hostViewController: UIViewController?

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func createRootViewController() -> UIViewController {
    let hostVC = UIViewController()
    hostVC.title = "Scroll Edge"

    let nav = UINavigationController(rootViewController: hostVC)
    let navAppearance = UINavigationBarAppearance()
    navAppearance.configureWithTransparentBackground()
    navAppearance.shadowColor = .clear
    nav.navigationBar.standardAppearance = navAppearance
    nav.navigationBar.scrollEdgeAppearance = navAppearance
    nav.navigationBar.compactAppearance = navAppearance
    nav.navigationBar.isTranslucent = true
    nav.tabBarItem = UITabBarItem(
      title: "Example",
      image: UIImage(systemName: "square.stack"),
      tag: 0
    )

    let tabs = UITabBarController()
    let tabAppearance = UITabBarAppearance()
    tabAppearance.configureWithTransparentBackground()
    tabAppearance.shadowColor = .clear
    tabs.tabBar.standardAppearance = tabAppearance
    if #available(iOS 15.0, *) {
      tabs.tabBar.scrollEdgeAppearance = tabAppearance
    }
    tabs.viewControllers = [nav]

    hostViewController = hostVC
    navigationController = nav
    tabsController = tabs

    return tabs
  }

  override func setRootView(_ rootView: UIView, toRootViewController rootViewController: UIViewController) {
    let targetHost = resolveHostViewController(from: rootViewController)

    rootView.translatesAutoresizingMaskIntoConstraints = false
    targetHost.view.addSubview(rootView)

    NSLayoutConstraint.activate([
      rootView.topAnchor.constraint(equalTo: targetHost.view.topAnchor),
      rootView.leadingAnchor.constraint(equalTo: targetHost.view.leadingAnchor),
      rootView.trailingAnchor.constraint(equalTo: targetHost.view.trailingAnchor),
      rootView.bottomAnchor.constraint(equalTo: targetHost.view.bottomAnchor)
    ])
  }

  private func resolveHostViewController(from root: UIViewController) -> UIViewController {
    if let hostVC = hostViewController {
      return hostVC
    }
    if let tabs = root as? UITabBarController,
       let nav = tabs.viewControllers?.first as? UINavigationController,
       let hostVC = nav.viewControllers.first {
      return hostVC
    }
    return root
  }
}
