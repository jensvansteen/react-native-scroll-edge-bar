require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "RNScrollEdgeBar"
  s.module_name  = "RNScrollEdgeBar"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "16.0" }
  s.source       = { :git => "https://github.com/jensvansteen/react-native-scroll-edge-bar.git", :tag => "#{s.version}" }

  s.source_files = [
    "common/cpp/**/*.{cpp,h}",
    "ios/*.{swift,h,m,mm}",
  ]
  s.private_header_files = "ios/*.h"
  s.project_header_files = "common/cpp/**/*.h"
  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "NO",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/common/cpp\""
  }

  s.dependency 'React-Core'
  s.dependency 'ScrollEdgeBar', '~> 1.2'
  install_modules_dependencies(s)
end
