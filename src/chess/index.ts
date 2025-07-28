import { ref, type Ref } from "vue";
import { isChessLetter, letterToPieceType, makePiece, vec2, type Color, type Piece, type Vector2, type Move } from "./types";

export function useChessGame() {
  const pieces = ref<Piece[]>([]);
  const moves = ref<Move[]>([]);
  const suggestions = ref<Move[]>([]);
  const turn = ref<Color>("white");

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
    suggestMoves();
    return true;
  }

  function nextTurn() {
    turn.value = turn.value == "white" ? "black" : "white";
  }

  function requestMove(piece: Piece, pos: Vector2): boolean {
    piece.position = {...pos};
    nextTurn();
    suggestMoves();
    return true;
  }

  function makeMove(piece: Piece, position: Vector2, castle?: Move["castle"], promotion?: Move["promotion"], en_passant?: Move["en_passant"]): Move {
    const capture = pieces.value.find((p) => p.position.x == position.x && p.position.y == position.y);
    return {
      piece,
      to: {...position},
      from: {...piece.position},
      capture: capture ?? null,
      castle: castle ?? null,
      promotion: promotion ?? null,
      en_passant: en_passant ?? null,
    }
  }

  function isPositionValid(piece: Piece, position: Vector2): boolean {
    if (piece.position.x == position.x && piece.position.y == position.y) return false;
    if (piece.position.x == position.x && piece.position.y == position.y) return false;
    if (position.x < 1 || position.y < 1 || position.x > 8 || position.y > 8) return false;
    const capture = pieces.value.find((p) => p.position.x == position.x && p.position.y == position.y && p.color == piece.color);
    if (capture) return false;
    return true;
  }

  function suggestMoves() {
    suggestions.value = [];
    for (const piece of pieces.value) {
      if (piece.color != turn.value)
        continue;

      suggestions.value.push(...suggestPieceMoves(piece));
    }
  }

  function suggestPieceMoves(piece: Piece): Move[] {
    switch (piece.type) {
      case "king": return suggestKingMoves(piece);
      case "queen": return suggestQueenMoves(piece);
      case "rook": return suggestRookMoves(piece);
      case "knight": return suggestKnightMoves(piece);
      case "bishop": return suggestBishopMoves(piece);
      case "pawn": return suggestPawnMoves(piece);
    }
  }

  function suggestKingMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    for (let i = piece.position.x - 1; i <= piece.position.x + 1; i++) {
      for (let j = piece.position.y - 1; j <= piece.position.y + 1; j++) {
        if (isPositionValid(piece, vec2(i, j)))
          result.push(makeMove(piece, vec2(i, j)));
      }
    }

    return result;
  }

  function suggestQueenMoves(piece: Piece): Move[] {
    return [];
  }

  function suggestRookMoves(piece: Piece): Move[] {
    return [];
  }

  function suggestKnightMoves(piece: Piece): Move[] {
    return [];
  }

  function suggestBishopMoves(piece: Piece): Move[] {
    return [];
  }

  function suggestPawnMoves(piece: Piece): Move[] {
    return [];
  }

  return {
    pieces,
    moves,
    suggestions,
    turn,
    loadFen,
    requestMove,
  }
}