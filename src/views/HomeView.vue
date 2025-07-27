<script setup lang="ts">
import { useChessGame } from '@/chess';
import { vec2ToChessNotation, type Piece } from '@/chess/types';
import ChessBoard from '@/components/ChessBoard.vue';
import { ref, watch } from 'vue';

const playingAsWhite = ref(true);
const fen = ref("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const game = useChessGame();
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
