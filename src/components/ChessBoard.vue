<script setup lang="ts">
import { makePiece, vec2, type Color, type Piece, type Vector2 } from '@/chess/types';
import ChessPiece from './ChessPiece.vue';
import { computed, inject, onMounted, onUnmounted, provide, ref, useTemplateRef, watch, watchEffect, type ShallowRef } from 'vue';
import { useChessGame } from '@/chess';
import useWindowEvent from '@/tools/use_window_event';
import ChessTargetSquare from './ChessTargetSquare.vue';
import ChessMoveSuggestion from './ChessMoveSuggestion.vue';
import type { BoardData } from '@/tools/use_chess_board_context';

const props = defineProps<{
  game: ReturnType<typeof useChessGame>,
  side: Color,
}>();

const selectedPiece = ref<Piece | null>(null);
const board_ref = useTemplateRef("board") as Readonly<ShallowRef<HTMLDivElement>>;

provide<BoardData>("board", {
  getSide: () => props.side,
  screenPosToGamePos,
  gamePosToScreenPos,
  getBoundingClientRect: () => board_ref.value.getBoundingClientRect(),
})

function screenPosToGamePos(pos: Vector2): Vector2 {
  if (props.side == "white") return vec2(pos.x + 1, 8 - pos.y);
  else return vec2(8 - pos.x, pos.y + 1);
}

function gamePosToScreenPos(pos: Vector2): Vector2 {
  if (props.side == "white") return vec2(pos.x - 1, 8 - pos.y);
  else return vec2(8 - pos.x, pos.y - 1);
}

function handlePieceUnselect(piece: Piece, newPos: Vector2) {
  selectedPiece.value = null;
  props.game.requestMove(piece, newPos);
}
</script>

<template>
  <div ref="board" class="board">
    <!-- Square info -->
    <div class="files">
      <div class="square" :class="i % 2 == 1 ? 'black' : 'white'" v-for="i in 8">
        <div>{{ "0abcdefgh"[screenPosToGamePos(vec2(i - 1, 0)).x] }}</div>
      </div>
    </div>
    <div class="ranks">
      <div class="square" :class="i % 2 == 1 ? 'white' : 'black'" v-for="i in 8">
        <div>{{ screenPosToGamePos(vec2(0, i - 1)).y }}</div>
      </div>
    </div>

    <!-- Target square -->
    <ChessTargetSquare :visible="selectedPiece != null" :get-bounding-client-rect="() => board_ref.getBoundingClientRect()" />

    <!-- Pieces -->
    <ChessPiece v-for="piece in game.pieces.value" :piece @select="selectedPiece = piece" @unselect="(newPos) => handlePieceUnselect(piece, newPos)" />

    <!-- Move suggestions -->
    <ChessMoveSuggestion v-for="move in game.suggestions.value.filter((m) => m.piece == selectedPiece)" :position="move.to" :capture="move.capture != null" />
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

.target_square {
  position: absolute;
  width: 12.5%;
  height: 12.5%;

  border: calc(0.008 * var(--chess-board-size)) solid rgba(255, 255, 255, 0.65);
  box-sizing: border-box;
}

.target_square.hidden {
  visibility: hidden;
}
</style>