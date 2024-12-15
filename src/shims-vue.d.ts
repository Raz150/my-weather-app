// shims-vue.d.ts
import { ComponentCustomProperties } from 'vue';
import * as helpers from '@/helpers/utils';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    _gFunc: typeof helpers; // This will make _gFunc accessible in all components
  }
}
