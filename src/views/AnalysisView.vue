<script setup lang="ts">
import { ChessGame } from '@/chess';
import type { Color, Move, Piece } from '@/chess/types';
import ChessBoard from '@/components/ChessBoard.vue';
import { ref, shallowRef, watch } from 'vue';

const side = ref<Color>("white");
const fen = ref("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
// const game = useChessGame();

const pieces = ref<Piece[]>([]);
const moves = ref<Move[]>([]);
const suggestions = ref<Move[]>([]);
const turn = ref<Color>("white");

const game = new ChessGame((gamePieces, gameMoves, gameSuggestions, gameTurn) => {
  pieces.value = gamePieces;
  moves.value = gameMoves;
  suggestions.value = gameSuggestions;
  turn.value = gameTurn;
});

watch(fen, () => {
  game.loadFen(fen.value);
}, { immediate: true });

// const check = computed(() => game.isBoardInCheck())
</script>

<template>
  <div class="game">
    <div class="left">
      <div>
        <label for="side">side</label>
        <select id="side" v-model="side">
          <option value="white">white</option>
          <option value="black">black</option>
        </select>
      </div>
      <div>
        <label for="fen">fen</label>
        <input id="fen" v-model="fen" />
      </div>
      <div>current turn: {{ turn }}</div>
      <!--<div>check: {{ check ?? 'null' }}</div>
      <div><button @click="game.requestUnmove()">unmove</button></div>-->
    </div>
    <div class="center">
      <ChessBoard :game :pieces :suggestions :side />
    </div>
    <div class="right"></div>
  </div>
</template>

<style scoped>
.game {
  height: 100vh;
  width: 100vw;

  display: flex;
  overflow: hidden;
}

.left, .right {
  flex: 1;
  height: 100%;
}

.center {
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
