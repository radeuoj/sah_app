<script setup lang="ts">
import ChessBoard from '@/components/ChessBoard.vue';
import { Game } from '@/chess/game';
import { parseMove, type Move } from '@/chess/move';
import type { PieceColor, PromotionPieceType } from '@/chess/piece';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getBot } from '@/chess/bots/bot';
import Queue from '@/tools/queue';

const game = new Game();

const side = ref<PieceColor>("white");
const pieces = ref(game.getPieces());
const history = ref<Move[]>(game.getHistory());
const promotion = ref<PromotionPieceType>("queen");

const lastMove = computed(() => {
  if (history.value.length == 0) return null;
  return history.value[history.value.length - 1];
});

let future = new Queue<Move>();

onMounted(() => {
  loadPuzzle()
});

async function loadPuzzle() {
  const res = await fetch("https://lichess.org/api/puzzle/next?angle=promotion");
  const json = await res.json();
  console.log(json)

  const start = Date.now();

  const pgn = (json.game.pgn as string).split(/\s+/);
  for (const move of pgn) {
    game.requestMoveFronSan(move);
  }

  const solution = json.puzzle.solution as string[];
  for (const move of solution) {
    future.push(parseMove(move));
  } 

  pieces.value = game.getPieces();
  history.value = game.getHistory();
  side.value = pgn.length % 2 == 0 ? "white" : "black";

  console.log(`loading puzzle took ${Date.now() - start}ms`);
}

function isMoveGood(move: Move) {
  const nextMove = future.front();
  return move.from == nextMove.from && move.to == nextMove.to && move.promotion == nextMove.promotion;
}

function requestNextFutureMove() {
  if (future.isEmpty()) return;
  game.requestMove(future.pop());
}

function handleMove(move: Move) {
  if (isMoveGood(move)) {
    requestNextFutureMove();
    requestNextFutureMove();
  }
  
  pieces.value = game.getPieces();
  history.value = game.getHistory();
}
</script>

<template>
  <div class="game">
    <div class="left">
      
    </div>
    <div class="center">
      <ChessBoard :side :pieces :en-pasant="game.getEnPassant()" :promotion :can-move="side" :last-move @move="handleMove" />
    </div>
    <div class="right">
      <div>
        <label for="promotion">preferred promotion</label>
        <select id="promotion" v-model="promotion">
          <option value="queen">queen</option>
          <option value="rook">rook</option>
          <option value="bishop">bishop</option>
          <option value="knight">knight</option>
        </select>
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
</style>