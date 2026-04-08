import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {}

export default codegenNativeComponent<NativeProps>('RNScrollEdgeBarBottomBar', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
