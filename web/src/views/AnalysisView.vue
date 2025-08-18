<script setup lang="ts">
import { Game } from '@/chess/game';
import { stringifyMove, type Move } from '@/chess/move';
import type { InternalPieceColor, Piece, PieceColor, PromotionPieceType } from '@/chess/piece';
import ChessBoard from '@/components/ChessBoard.vue';
import { computed, ref, shallowRef, watch } from 'vue';

const side = ref<PieceColor>("white");
const fen = ref("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const perftDepth = ref(1);
const promotion = ref<PromotionPieceType>("queen");
const canMove = ref<PieceColor | "both" | "none">("both");
const lastMoveSan = ref("");
const sanMove = ref("");

let game = new Game(fen.value);
const pieces = ref<Piece[]>(game.getPieces());
const history = ref<Move[]>(game.getHistory());

watch(fen, () => {
  game = new Game(fen.value);
  pieces.value = game.getPieces();
}, { immediate: true });

// const check = computed(() => game.isBoardInCheck())

const lastMove = computed(() => {
  if (history.value.length == 0) return null;
  return history.value[history.value.length - 1];
});

function handleMove(move: Move) {
  lastMoveSan.value = game.sanFromMove(move);
  game.requestMove(move);
  pieces.value = game.getPieces();
  history.value = game.getHistory();
}

function handleSanMove() {
  const start = Date.now();
  const move = game.moveFromSan(sanMove.value);
  lastMoveSan.value = game.sanFromMove(move);
  game.requestMove(move);
  pieces.value = game.getPieces();
  history.value = game.getHistory();
  console.log(`${Date.now() - start}ms`)
}

function handleUnmove() {
  game.requestUnmove();
  pieces.value = game.getPieces();
  history.value = game.getHistory();
}

function handlePerft() {
  const start = Date.now();
  console.log("Started...");
  const result = game.perft(perftDepth.value).sort((a, b) =>(a.move < b.move ? -1 : 1));
  console.log(result);
  console.log(`Total: ${result.reduce((total, n) => total + n.nodes, 0)}`);
  console.log(`Took ${(Date.now() - start) / 1000}s`);
}
</script>

<template>
  <div class="game">
    <div class="left">
      
    </div>
    <div class="center">
      <ChessBoard :side :pieces :en-pasant="game.getEnPassant()" :promotion :can-move :last-move @move="handleMove" />
    </div>
    <div class="right">
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
      <div>en passant: {{ game.getEnPassant() ?? '-' }}</div>
      <div>
        <label for="promotion">preferred promotion</label>
        <select id="promotion" v-model="promotion">
          <option value="queen">queen</option>
          <option value="rook">rook</option>
          <option value="bishop">bishop</option>
          <option value="knight">knight</option>
        </select>
      </div>
      <!--<div>check: {{ check ?? 'null' }}</div> -->
      <div><button @click="handleUnmove">unmove</button></div>
      <div><input v-model="perftDepth"></input><button @click="handlePerft">perft</button></div>
      <div>
        <label for="can-move">can move</label>
        <select id="can-move" v-model="canMove">
          <option value="white">white</option>
          <option value="black">black</option>
          <option value="both">both</option>
          <option value="none">none</option>
        </select>
      </div>
      <div>
        <label for="sanMove">move from san</label>
        <input id="sanMove" v-model="sanMove"></input>
        <button @click="handleSanMove">send</button>
      </div>
      <div>Last move as SAN: {{ lastMoveSan }}</div>
      <div class="history">
        History:
        <div v-for="move in history">{{ stringifyMove(move) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game {
  display: flex;
}

.left, .right {
  flex: 1;
}

.right {
  min-width: 220px;
}

.center {
  /* height: 100svh; */
  padding-top: var(--chess-board-margin);

  display: flex;
  justify-content: center;
  align-items: center;
}

@media (width <= 900px) {
  .game {
    flex-direction: column;
  }

  .right {
    min-width: auto;
  }
}

.history {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1rem;
}
</style>
