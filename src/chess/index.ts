import { ref, type Ref } from "vue";
import { isChessLetter, letterToPieceType, makePiece, vec2, type Color, type Piece } from "./types";

export function useChessGame() {
  const pieces = ref<Piece[]>([]);

  function setupBoard() {
    loadFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  }

  function isFenValid(fen: string): boolean {
    let x = 1, y = 1, i = 0;
    while (y <= 8) {
      if (fen[i] == '/' || x > 8) {
        y++;
        x = 1;
      } else if (isChessLetter(fen[i])) {
        x++;
      } else if ('0' <= fen[i] && fen[i] <= '9') {
        x += +fen[i];
      } else {
        return false;
      }

      i++;
    }

    return true;
  }

  function loadFen(fen: string) {
    const new_pieces: Piece[] = [];

    let x = 1, y = 1, i = 0;
    while (y <= 8) {
      if (fen[i] == '/' || x > 8) {
        y++;
        x = 1;
      } else if (isChessLetter(fen[i])) {
        const color = fen[i] == fen[i].toUpperCase() ? "black" : "white";
        const type = letterToPieceType(fen[i]);
        new_pieces.push(makePiece(type, color, vec2(x, y)));
        x++;
      } else if ('0' <= fen[i] && fen[i] <= '9') {
        x += +fen[i];
      } else {
        throw new Error(`Fen invalid at index ${i} ${fen[i]}`);
      }

      i++;
    }

    pieces.value = new_pieces;
  }

  return {
    pieces,
    setupBoard,
    loadFen,
    isFenValid,
  }
}