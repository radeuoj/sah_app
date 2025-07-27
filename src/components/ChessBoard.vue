<script setup lang="ts">
import { makePiece, vec2, type Color, type Piece, type Vector2 } from '@/chess/types';
import ChessPiece from './ChessPiece.vue';
import { onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect, type ShallowRef } from 'vue';
import { useChessGame } from '@/chess';

const props = defineProps<{
  game: ReturnType<typeof useChessGame>,
  playingAsWhite: boolean,
  fen: string,
}>();

const selectedPiece = ref<Piece | null>(null);
const boardRef = useTemplateRef("board") as Readonly<ShallowRef<HTMLDivElement>>;

watch(() => props.fen, () => {
  props.game.loadFen(props.fen);
}, {
  immediate: true,
});

function screenPosToGamePos(pos: Vector2): Vector2 {
  if (props.playingAsWhite) return vec2(pos.x + 1, 8 - pos.y);
  else return vec2(8 - pos.x, pos.y + 1);
}

function gamePosToScreenPos(pos: Vector2): Vector2 {
  if (props.playingAsWhite) return vec2(pos.x - 1, 8 - pos.y);
  else return vec2(8 - pos.x, pos.y - 1);
}

function handlePieceUnselect(piece: Piece, newPos: Vector2) {
  selectedPiece.value = null;
  piece.position = newPos;
}
</script>

<template>
  <div ref="board" class="board">
    <!-- Square info -->
    <div class="files">
      <div class="square" :class="i % 2 == 0 ? 'black' : 'white'" v-for="i in Array(8).keys()">
        <div>{{ "0abcdefgh"[screenPosToGamePos(vec2(i, 0)).x] }}</div>
      </div>
    </div>
    <div class="ranks">
      <div class="square" :class="i % 2 == 0 ? 'white' : 'black'" v-for="i in Array(8).keys()">
        <div>{{ screenPosToGamePos(vec2(0, i)).y }}</div>
      </div>
    </div>

    <!-- Pieces -->
    <ChessPiece v-for="piece in game.pieces.value" :piece @select="selectedPiece = piece" @unselect="(newPos) => handlePieceUnselect(piece, newPos)" :screen-pos-to-game-pos="screenPosToGamePos" :game-pos-to-screen-pos="gamePosToScreenPos" :get-bounding-client-rect="() => boardRef.getBoundingClientRect()" />
  </div>
</template>

<style scoped>
.board {
  width: var(--chess-board-size);
  height: var(--chess-board-size);
  background-image: url(/assets/chess_board_big.png); /* magick chess_board.png -filter box -resize 2048x2048 chess_board_big.png */
  background-size: 100%;
  
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);

  user-select: none;
}

.square {
  font-size: calc(0.025 * var(--chess-board-size));
  font-weight: 900;
  font-style: italic;
}

.square.white {
  color: var(--chess-square-black-color);
}

.square.black {
  color: var(--chess-square-white-color);
}

.files {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 12.5%;
  display: flex;
  flex-direction: row;
}

.ranks {
  position: absolute;
  left: 0;
  height: 100%;
  width: 12.5%;
  display: flex;
  flex-direction: column;
}

.files > div, .ranks > div {
  flex-grow: 1;
  position: relative;
}

.files > div > div {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5%;
}

.ranks > div > div {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5%;
}
</style>