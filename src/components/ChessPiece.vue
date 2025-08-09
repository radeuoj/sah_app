<script setup lang="ts">
import { numberToVec2, vec2ToNumber, type Square } from '@/chess/notation';
import type { InternalPieceColor, InternalPieceType, PieceColor, PieceType } from '@/chess/piece';
import { vec2, type Vector2 } from '@/chess/vector';
import useChessBoardContext from '@/tools/use_chess_board_context';
import useWindowEvent from '@/tools/use_window_event';
import { onUpdated, ref, watch, watchEffect } from 'vue';

const props = defineProps<{
  type: PieceType,
  color: PieceColor,
  position: Square,
  canMove: boolean,
}>();

const board = useChessBoardContext();

const emit = defineEmits<{
  select: [],
  unselect: [newPos: Square],
}>();

const mouse_down = ref(false);
const screenPos = ref(board.gamePosToScreenPos(props.position));

watch([() => props.position, board.getSide], () => {
  screenPos.value = board.gamePosToScreenPos(props.position);
})

useWindowEvent("mouseup", handleMouseUp);
useWindowEvent("mousemove", handleMouseMove);
useWindowEvent("touchend", handleMouseUp)
useWindowEvent("touchmove", handleMouseMove)

function handleMouseDown() {
  if (!props.canMove) return;

  mouse_down.value = true;
  emit('select');
}

function handleMouseUp() {
  if (!mouse_down.value) return;

  mouse_down.value = false;
  const gamePos = board.screenPosToGamePos(vec2(Math.floor(screenPos.value.x + 0.5), Math.floor(screenPos.value.y + 0.5)));
  screenPos.value = board.gamePosToScreenPos(props.position);
  emit('unselect', gamePos);
}

function handleMouseMove(event: MouseEvent | TouchEvent) {
  if (!mouse_down.value) return;

  event.preventDefault();
  event.stopPropagation();

  const rect = board.getBoundingClientRect();
  const x = (("clientX" in event ? event : event.touches[0]).clientX - rect.x) / rect.width * 8;
  const y = (("clientY" in event ? event : event.touches[0]).clientY - rect.y) / rect.height * 8;

  screenPos.value = vec2(x - 0.5, y - 0.5);
}
</script>

<template>
  <div class="piece" :class="props.color, props.type, {
    selected: mouse_down,
  }" @mousedown="handleMouseDown" @touchstart="handleMouseDown" :style="{
    translate: `${screenPos.x * 100}% ${screenPos.y * 100}%`,
  }"></div>
</template>

<style scoped>
.piece {
  /* background: red; */
  background-size: 100%;

  position: absolute;
  width: 12.5%;
  height: 12.5%;
}

.selected {
  z-index: 2;
}

.piece:not(.selected) {
  transition: translate 0.1s ease-in-out;
}

.black.king {
  background-image: url(/assets/chess_pieces/king-b.svg);
}

.black.queen {
  background-image: url(/assets/chess_pieces/queen-b.svg);
}

.black.rook {
  background-image: url(/assets/chess_pieces/rook-b.svg);
}

.black.knight {
  background-image: url(/assets/chess_pieces/knight-b.svg);
}

.black.bishop {
  background-image: url(/assets/chess_pieces/bishop-b.svg);
}

.black.pawn {
  background-image: url(/assets/chess_pieces/pawn-b.svg);
}

.white.king {
  background-image: url(/assets/chess_pieces/king-w.svg);
}

.white.queen {
  background-image: url(/assets/chess_pieces/queen-w.svg);
}

.white.rook {
  background-image: url(/assets/chess_pieces/rook-w.svg);
}

.white.knight {
  background-image: url(/assets/chess_pieces/knight-w.svg);
}

.white.bishop {
  background-image: url(/assets/chess_pieces/bishop-w.svg);
}

.white.pawn {
  background-image: url(/assets/chess_pieces/pawn-w.svg);
}
</style>