<script setup lang="ts">
import { loadEngine } from "../tools/load_engine";
const engineBaseName = "/assets/chess_engines/stockfish-17-lite-single";
const engine = loadEngine(`${engineBaseName}.js#${engineBaseName}.wasm`, () => {
  console.log("__up__");
})
engine.stream = console.log;
engine.send("uci")
</script>

<template>
  <h1>Sah</h1>
  <RouterLink to="/analysis">Analysis</RouterLink>
</template>