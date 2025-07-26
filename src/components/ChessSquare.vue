<script setup lang="ts">
import type { Color, Vector2 } from '@/chess/types';

export type ChessSquareData = {
  color: Color,
  position: Vector2,
};

const props = defineProps<ChessSquareData>();

const files = "0abcdefgh";
</script>

<template>
  <div class="square" :class="props.color">
    <div v-if="props.position.y == 1" class="file">{{ files[props.position.x] }}</div>
    <div v-if="props.position.x == 1" class="rank">{{ props.position.y }}</div>
  </div>
</template>

<style scoped>
.square {
  position: relative;
  font-size: calc(0.025 * var(--chess-board-size));
  font-weight: 900;
  font-style: italic;
}

.square.white {
  background: var(--chess-square-white-color);
  color: var(--chess-square-black-color);
}

.square.black {
  background: var(--chess-square-black-color);
  color: var(--chess-square-white-color);
}

.square > div {
  position: absolute;
  padding: 5%;
}

.file {
  right: 0;
  bottom: 0;
}

.rank {
  left: 0;
  top: 0;
}
</style>