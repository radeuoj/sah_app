<script setup lang="ts">
import type { Piece, Vector2 } from '@/chess/types';
import { computed } from 'vue';

const props = defineProps<{
  piece: Piece,
  gamePosToScreenPos(pos: Vector2): Vector2,
  screenPosToGamePos(pos: Vector2): Vector2,
}>();

const screen_pos = computed(() => props.gamePosToScreenPos(props.piece.position));
</script>

<template>
  <div class="piece" :class="props.piece.color, props.piece.type" :style="{
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
  background-image: url(/public/assets/chess_pieces/king-b.svg);
}

.black.queen {
  background-image: url(/public/assets/chess_pieces/queen-b.svg);
}

.black.rook {
  background-image: url(/public/assets/chess_pieces/rook-b.svg);
}

.black.knight {
  background-image: url(/public/assets/chess_pieces/knight-b.svg);
}

.black.bishop {
  background-image: url(/public/assets/chess_pieces/bishop-b.svg);
}

.black.pawn {
  background-image: url(/public/assets/chess_pieces/pawn-b.svg);
}

.white.king {
  background-image: url(/public/assets/chess_pieces/king-w.svg);
}

.white.queen {
  background-image: url(/public/assets/chess_pieces/queen-w.svg);
}

.white.rook {
  background-image: url(/public/assets/chess_pieces/rook-w.svg);
}

.white.knight {
  background-image: url(/public/assets/chess_pieces/knight-w.svg);
}

.white.bishop {
  background-image: url(/public/assets/chess_pieces/bishop-w.svg);
}

.white.pawn {
  background-image: url(/public/assets/chess_pieces/pawn-w.svg);
}
</style>