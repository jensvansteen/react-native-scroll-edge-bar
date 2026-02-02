#include <jni.h>
#include "scrolledgebarOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::scrolledgebar::initialize(vm);
}
