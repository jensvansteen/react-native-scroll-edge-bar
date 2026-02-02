import { getHostComponent } from 'react-native-nitro-modules';
const ScrollEdgeBarConfig = require('../nitrogen/generated/shared/json/ScrollEdgeBarConfig.json');
import type {
  ScrollEdgeBarMethods,
  ScrollEdgeBarProps,
} from './ScrollEdgeBar.nitro';

export const ScrollEdgeBarView = getHostComponent<
  ScrollEdgeBarProps,
  ScrollEdgeBarMethods
>('ScrollEdgeBar', () => ScrollEdgeBarConfig);
