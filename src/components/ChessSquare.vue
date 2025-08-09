<script setup lang="ts">
import type { Square } from '@/chess/notation';
import type { PieceColor } from '@/chess/piece';
import useChessBoardContext from '@/tools/use_chess_board_context';
import { computed, ref } from 'vue';

const props = defineProps<{
  position: Square,
  color: PieceColor,
}>();

const board = useChessBoardContext();

const screenPos = computed(() => board.gamePosToScreenPos(props.position));
</script>

<template>
  <div class="square" :class="color" :style="{
    translate: `${screenPos.x * 100}% ${screenPos.y * 100}%`,
  }"></div>
</template>

<style scoped>
.square {
  position: absolute;
  height: 12.5%;
  width: 12.5%;
}

.square.white {
  background: var(--chess-square-white-highlight-color);
}

.square.black {
  background: var(--chess-square-black-highlight-color);
}
</style>