require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ScrollEdgeBar"
  s.module_name  = "RNScrollEdgeBar"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/jensvansteen/react-native-scroll-edge-bar.git", :tag => "#{s.version}" }

  s.source_files = [
    "common/cpp/**/*.{cpp,h}",
    "ios/**/*.{swift}",
    "ios/**/*.{m,mm}",
  ]
  s.project_header_files = "common/cpp/**/*.h"
  s.pod_target_xcconfig = {
    "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\""
  }

  s.dependency 'React-Core'
  install_modules_dependencies(s)
end
