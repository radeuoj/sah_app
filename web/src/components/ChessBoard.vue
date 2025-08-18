<script setup lang="ts">
import ChessPiece from './ChessPiece.vue';
import { computed, inject, onMounted, onUnmounted, onUpdated, provide, ref, useTemplateRef, watch, watchEffect, type ShallowRef } from 'vue';
import useWindowEvent from '@/tools/use_window_event';
import ChessTargetSquare from './ChessTargetSquare.vue';
import ChessMoveSuggestion from './ChessMoveSuggestion.vue';
import ChessSquare from './ChessSquare.vue';
import type { BoardData } from '@/tools/use_chess_board_context';
import type { Game } from '@/chess/game';
import type { Piece, InternalPieceColor, InternalPieceType, PieceColor, PieceType, PromotionPieceType } from '@/chess/piece';
import { vec2, type Vector2 } from '@/chess/vector';
import { chessToVec2, numberToChess, vec2ToChess, numberToVec2, type Square, chessToNumber, chessToColor } from '@/chess/notation';
import type { Move } from '@/chess/move';

const moveAudio = new Audio("/assets/sounds/move.mp3");
const captureAudio = new Audio("/assets/sounds/capture.mp3");

const props = defineProps<{
  side: PieceColor,
  pieces: Piece[],
  enPasant: string | null,
  promotion: PromotionPieceType,
  canMove: PieceColor | "both" | "none",
  lastMove: Move | null,
}>();

// const pieces = ref<Piece[]>(getUpdatedPieces());
const selectedPiece = ref<Piece | null>(null);
const boardRef = useTemplateRef("board") as Readonly<ShallowRef<HTMLDivElement>>;

provide<BoardData>("board", {
  getSide: () => props.side,
  screenPosToGamePos,
  gamePosToScreenPos,
  getBoundingClientRect: () => boardRef.value.getBoundingClientRect(),
})

const emit = defineEmits<{
  move: [move: Move],
}>();

watch(() => props.pieces, (newPieces, oldPieces) => {
  if (newPieces.length == oldPieces.length) (moveAudio.cloneNode(true) as HTMLAudioElement).play();
  else (captureAudio.cloneNode(true) as HTMLAudioElement).play();
});

function screenPosToGamePos(pos: Vector2): Square {
  if (props.side == "white") return vec2ToChess(vec2(pos.x, 7 - pos.y));
  else return vec2ToChess(vec2(7 - pos.x, pos.y));
}

function gamePosToScreenPos(pos: Square): Vector2 {
  const vecPos = chessToVec2(pos);
  if (props.side == "white") return vec2(vecPos.x, 7 - vecPos.y);
  else return vec2(7 - vecPos.x, vecPos.y);
}

function handlePieceUnselect(piece: Piece, newPos: Square) {
  const start = Date.now();

  selectedPiece.value = null;

  const move = piece.moves.find(m => m.to == newPos && (m.promotion == null || m.promotion == props.promotion));
  if (!move) {
    return;
  }

  emit("move", move);

  console.log(`${piece.position}${newPos} took ${Date.now() - start}ms`);
}

function isMoveACapture(move: Move): boolean {
  const piece = props.pieces.find(p => p.position == move.from);
  const capture = props.pieces.find(p => p.position == move.to);
  return capture != undefined || (piece?.type == 'pawn' && move.to == props.enPasant)
}
</script>

<template>
  <div ref="board" class="board">
    <!-- Highlighted squares -->
    <ChessSquare v-if="selectedPiece != null" :position="selectedPiece.position" :color="chessToColor(selectedPiece.position)" />
    <ChessSquare v-if="lastMove != null" :position="lastMove.from" :color="chessToColor(lastMove.from)" />
    <ChessSquare v-if="lastMove != null" :position="lastMove.to" :color="chessToColor(lastMove.to)" />

    <!-- Square info -->
    <div class="files">
      <div class="square" :class="i % 2 == 1 ? 'black' : 'white'" v-for="i in 8">
        <div>{{ screenPosToGamePos(vec2(i - 1, 0))[0] }}</div>
      </div>
    </div>
    <div class="ranks">
      <div class="square" :class="i % 2 == 1 ? 'white' : 'black'" v-for="i in 8">
        <div>{{ screenPosToGamePos(vec2(0, i - 1))[1] }}</div>
      </div>
    </div>

    <!-- Target square -->
    <ChessTargetSquare :visible="selectedPiece != null" />

    <!-- Pieces -->
    <ChessPiece v-for="piece of pieces" :key="piece.id" :type="piece.type" :color="piece.color" :position="piece.position" :can-move="piece.color == canMove || canMove == 'both'" @select="selectedPiece = piece" @unselect="(newPos) => handlePieceUnselect(piece, newPos)" />

    <!-- Move suggestions -->
    <ChessMoveSuggestion v-for="move of selectedPiece?.moves.filter(m => m.promotion == null || m.promotion == props.promotion)" :screen-pos="gamePosToScreenPos(move.to)" :capture="isMoveACapture(move)" />
  </div>
</template>

<style scoped>
.board {
  max-width: 100%;
  width: var(--chess-board-size);
  height: var(--chess-board-size);
  /* margin-top: var(--chess-board-margin); */
  background-image: url(/assets/chess_board_big.png); /* magick chess_board.png -filter box -resize 2048x2048 chess_board_big.png */
  background-size: 100%;
  
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);

  user-select: none;
  touch-action: none;
  overflow: hidden;
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