<script setup lang="ts">
import ChessBoard from '@/components/ChessBoard.vue';
import { Game } from '@/chess/game';
import type { Move } from '@/chess/move';
import type { PromotionPieceType } from '@/chess/piece';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getBot } from '@/chess/bots/bot';

const route = useRoute();

const game = new Game();

const side = Math.floor(Math.random() * 2) ? "white" : "black";
const pieces = ref(game.getPieces());
const history = ref<Move[]>(game.getHistory());
const promotion = ref<PromotionPieceType>("queen");

const lastMove = computed(() => {
  if (history.value.length == 0) return null;
  return history.value[history.value.length - 1];
});

const bot = getBot(route.params.bot as string);

function doBotMove() {
  game.requestMove(bot.getMove(game));
  pieces.value = game.getPieces();
  history.value = game.getHistory();
}

if (side == "black") {
  doBotMove();
}

function handleMove(move: Move) {
  game.requestMove(move);
  pieces.value = game.getPieces();
  history.value = game.getHistory();

  doBotMove();
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