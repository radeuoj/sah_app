<script setup lang="ts">
import { Game } from '@/chess/game';
import type { Move } from '@/chess/move';
import type { InternalPieceColor, Piece, PieceColor } from '@/chess/piece';
import ChessBoard from '@/components/ChessBoard.vue';
import { ref, shallowRef, watch } from 'vue';

const side = ref<PieceColor>("white");
const fen = ref("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

let game = new Game(fen.value);
const pieces = ref<Piece[]>(game.getPieces());

watch(fen, () => {
  game = new Game(fen.value);
  pieces.value = game.getPieces();
}, { immediate: true });

// const check = computed(() => game.isBoardInCheck())

function handleMove(move: Move) {
  game.requestMove(move);
  pieces.value = game.getPieces();
}

function handleUnmove() {
  game.requestUnmove();
  pieces.value = game.getPieces();
}
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
      <div>current turn: {{ game.getTurn() }}</div>
      <div>castling rights: {{ game.getCastlingRights() }}</div>
      <div>en passant: {{ game.getEnPassant() }}</div>
      <!--<div>check: {{ check ?? 'null' }}</div> -->
      <div><button @click="handleUnmove">unmove</button></div>
    </div>
    <div class="center">
      <ChessBoard :pieces :side @move="handleMove" />
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
