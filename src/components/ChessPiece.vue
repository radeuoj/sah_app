<script setup lang="ts">
import { vec2, type Piece, type Vector2 } from '@/chess/types';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  piece: Piece,
  gamePosToScreenPos(pos: Vector2): Vector2,
  screenPosToGamePos(pos: Vector2): Vector2,
  getBoundingClientRect(): DOMRect,
}>();

const emit = defineEmits<{
  select: [],
  unselect: [newPos: Vector2],
}>();

const mouse_down = ref(false);
const screen_pos = ref(props.gamePosToScreenPos(props.piece.position));

watch([() => props.piece.position.x, () => props.piece.position.y], () => {
  screen_pos.value = props.gamePosToScreenPos(props.piece.position);
})

onMounted(() => {
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("mousemove", handleMouseMove);
});

function handleMouseDown() {
  mouse_down.value = true;
  emit('select');
}

function handleMouseUp() {
  if (!mouse_down.value) return;

  mouse_down.value = false;
  const gamePos = props.screenPosToGamePos(vec2(Math.floor(screen_pos.value.x + 0.5), Math.floor(screen_pos.value.y + 0.5)));
  emit('unselect', gamePos);
}

function handleMouseMove(event: MouseEvent) {
  const rect = props.getBoundingClientRect();
  const x = (event.clientX - rect.x) / rect.width * 8;
  const y = (event.clientY - rect.y) / rect.height * 8;

  handleMovePiece(vec2(x, y));
}

function handleMovePiece(pos: Vector2) {
  if (!mouse_down.value) return;

  screen_pos.value = vec2(pos.x - 0.5, pos.y - 0.5);
}
</script>

<template>
  <div class="piece" :class="props.piece.color, props.piece.type" @mousedown="handleMouseDown" :style="{
    translate: `${screen_pos.x * 100}% ${screen_pos.y * 100}%`,
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