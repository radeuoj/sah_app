import { ref, type Ref } from "vue";
import { isChessLetter, letterToPieceType, makePiece, vec2, type Color, type Piece } from "./types";

export function useChessGame() {
  const pieces = ref<Piece[]>([]);

  function loadFen(fen: string): boolean {
    const new_pieces: Piece[] = [];

    let x = 1, y = 1, i = 0;
    while (y <= 8) {
      if ((fen[i] == '/' && x > 8) || (x > 8 && y == 8)) {
        y++;
        x = 1;
      } else if (x > 8) {
        return false;
      } else if (isChessLetter(fen[i])) {
        const color = fen[i] == fen[i].toUpperCase() ? "black" : "white";
        const type = letterToPieceType(fen[i]);
        new_pieces.push(makePiece(type, color, vec2(x, y)));
        x++;
      } else if ('0' <= fen[i] && fen[i] <= '9') {
        x += +fen[i];
      } else {
        return false;
      }

      i++;
    }

    pieces.value = new_pieces;
    return true;
  }

  return {
    pieces,
    loadFen,
  }
}