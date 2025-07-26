<script setup lang="ts">
import { useChessGame } from '@/chess';
import ChessBoard from '@/components/ChessBoard.vue';
import { ref } from 'vue';

const playingAsWhite = ref(true);
const fen = ref("");
const game = useChessGame();
// game.loadFen("rnb1kbnr/ppp1pppp/3q4/3P4/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 2 3");
</script>

<template>
  <main>
    <div class="left">
      <div>
        <input id="playing_as_white" type="checkbox" v-model="playingAsWhite" />
        <label for="playing_as_white">playing as white</label>
      </div>
      <div>
        <label for="fen">fen</label>
        <input id="fen" v-model="fen" />
      </div>
    </div>
    <div class="center">
      <ChessBoard :game :playing-as-white="playingAsWhite" :fen />
    </div>
    <div class="right"></div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vw;

  display: flex;
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
