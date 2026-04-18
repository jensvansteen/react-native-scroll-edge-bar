import {
  codegenNativeComponent,
  type CodegenTypes as CT,
  type HostComponent,
  type ViewProps,
} from 'react-native';

type ScrollEdgeEffectStyle = 'automatic' | 'soft' | 'hard';

export interface NativeProps extends ViewProps {
  estimatedTopBarHeight?: CT.WithDefault<CT.Double, 60>;
  estimatedBottomBarHeight?: CT.WithDefault<CT.Double, 60>;
  topEdgeEffectStyle?: CT.WithDefault<ScrollEdgeEffectStyle, 'automatic'>;
  bottomEdgeEffectStyle?: CT.WithDefault<ScrollEdgeEffectStyle, 'automatic'>;
  prefersGlassEffect?: CT.WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNScrollEdgeBar', {
  interfaceOnly: true,
}) as HostComponent<NativeProps>;
