<script setup lang="ts">
import { vec2 } from '@/chess/vector';
import useChessBoardContext from '@/tools/use_chess_board_context';
import useWindowEvent from '@/tools/use_window_event';
import { ref } from 'vue';

const props = defineProps<{
  visible: boolean,
}>();

const board = useChessBoardContext();

const screen_pos = ref(vec2(0, 0));
const mouse_down = ref(false);

useWindowEvent("mousedown", event => {
  mouse_down.value = true;

  const rect = board.getBoundingClientRect();
  const x = (event.clientX - rect.x) / rect.width * 8;
  const y = (event.clientY - rect.y) / rect.height * 8;

  screen_pos.value = vec2(x, y);
});

useWindowEvent("mouseup", () => {
  mouse_down.value = false;
  screen_pos.value = vec2(0, 0);
});

useWindowEvent("mousemove", event => {
  if (!mouse_down.value || !props.visible) return;

  const rect = board.getBoundingClientRect();
  const x = (event.clientX - rect.x) / rect.width * 8;
  const y = (event.clientY - rect.y) / rect.height * 8;

  screen_pos.value = vec2(x, y);
});
</script>

<template>
  <div class="target_square" :style="{
    translate: `${Math.floor(screen_pos.x) * 100}% ${Math.floor(screen_pos.y) * 100}%`,
    visibility: visible && mouse_down ? 'visible' : 'hidden',
  }"></div> 
</template>