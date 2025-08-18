import { onMounted, onUnmounted } from "vue";

export default function useWindowEvent<T extends keyof WindowEventMap>(type: T, listener: (this: Window, ev: WindowEventMap[T]) => any) {
  onMounted(() => window.addEventListener(type, listener));
  onUnmounted(() => window.removeEventListener(type, listener));
} 