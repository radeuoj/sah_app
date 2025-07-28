<script setup lang="ts">
import type { Vector2 } from '@/chess/types';
import useChessBoardContext from '@/tools/use_chess_board_context';
import { computed, inject } from 'vue';

const props = defineProps<{
  position: Vector2,
  capture: boolean,
}>();

const { gamePosToScreenPos } = useChessBoardContext();

const screen_pos = computed(() => gamePosToScreenPos(props.position));
</script>

<template>
  <div class="suggestion" :style="{
    translate: `${screen_pos.x * 100}% ${screen_pos.y * 100}%`,
  }">
    <div :class="props.capture ? 'big_circle' : 'small_circle'"></div>
  </div>
</template>

<style scoped>
.suggestion {
  height: 12.5%;
  width: 12.5%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.small_circle {
  width: 33%;
  height: 33%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.14);
}

.big_circle {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  border-style: solid;
  border-width: 6px;
  border-color: rgba(0, 0, 0, 0.14);
}
</style>