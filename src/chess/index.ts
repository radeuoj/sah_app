import { ref, type Ref } from "vue";
import { isChessLetter, letterToPieceType, makePiece, vec2, type Color, type Piece, type Vector2, type Move } from "./types";

export function useChessGame() {
  const pieces = ref<Piece[]>([]);
  const moves = ref<Move[]>([]);
  const suggestions = ref<Move[]>([]);
  const turn = ref<Color>("white");

  const data = {

  };

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
    const nextMove = suggestions.value.find(m => m.piece == piece && m.to.x == pos.x && m.to.y == pos.y);
    if (!nextMove) return false;

    move(nextMove);
    suggestMoves();

    return true;
  }

  function requestUnmove(): Move {
    const lastMove = unmove();
    suggestMoves();

    return lastMove;
  }

  function move(move: Move): boolean {
    pieces.value = pieces.value.filter(p => p != move.capture);
    moves.value.push(move);

    move.piece.position = {...move.to};
    if (move.capture) move.capture.position = vec2(0, 0);

    if (move.castle) castle(move);
    if (move.promotion) promote(move);

    nextTurn();
    if (isInCheck(move.piece.color)) {
      unmove();
      return false;
    }

    return true;
  }

  function unmove(): Move {
    if (moves.value.length <= 0)
      throw new Error("No moves!!");

    const lastMove = moves.value[moves.value.length - 1];
    moves.value = moves.value.filter(m => m != lastMove);

    lastMove.piece.position = {...lastMove.from};
    if (lastMove.capture) {
      pieces.value.push(lastMove.capture);
      lastMove.capture.position = {...lastMove.to};
    }

    if (lastMove.castle) uncastle(lastMove);
    if (lastMove.promotion) unpromote(lastMove);
    if (lastMove.en_passant && lastMove.capture) lastMove.capture.position = {...lastMove.en_passant};

    nextTurn();

    return lastMove;
  }

  function castle(move: Move) {
    if (move.castle == null)
      throw new Error("castle is null!!!");

    const rook = pieces.value.find(p => p.type == "rook" && p.position.x == (move.castle == "king" ? 8 : 1) && p.position.y == move.piece.position.y);
    if (rook == undefined)
      throw new Error(`no ${move.castle} side rook`);

    rook.position = vec2(move.piece.position.x + (move.castle == "king" ? -1 : +1), move.piece.position.y);
  }

  function uncastle(move: Move) {
    if (move.castle == null)
      throw new Error("castle is null!!!");

    const rook = pieces.value.find(p => p.type == "rook" && p.position.x == move.to.x + (move.castle == "king" ? -1 : +1) && p.position.y == move.to.y);
    if (rook == undefined)
      throw new Error(`no ${move.castle} side rook`);

    rook.position = vec2(move.castle == "king" ? 8 : 1, move.piece.position.y);
  }

  function promote(move: Move) {
    if (move.promotion == null)
      throw new Error("this isnt a promotion!!");

    move.piece.type = move.promotion;
  }

  function unpromote(move: Move) {
    if (move.promotion == null)
      throw new Error("this isnt a promotion!!");

    move.piece.type = "pawn";
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
      en_passant: (en_passant && {...en_passant}) ?? null,
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

  function progressPosition(piece: Piece, step: Vector2): Vector2[] {
    const result: Vector2[] = [];

    for (let i = piece.position.x + step.x, j = piece.position.y + step.y; isPositionValid(piece, vec2(i, j)); i += step.x, j += step.y) {
      result.push(vec2(i, j));
      if (pieces.value.find(p => p.position.x == i && p.position.y == j))
        break;
    }

    return result;
  }

  function isMoveValid(newMove: Move): boolean {
    const ok = move(newMove);
    if (ok) unmove();
    return ok;
  }

  function suggestMoves() {
    suggestions.value = suggestMovesUnsafe()
    .filter(m => m.piece.color == turn.value && isMoveValid(m))
    .filter(m => m.castle == null || !isInCheck(m.piece.color))
    .filter(m => m.castle != "king" 
      || (!isSquareAttacked(vec2(m.piece.position.x + 1, m.piece.position.y), m.piece.color == "white" ? "black" : "white") 
      && !isSquareAttacked(vec2(m.piece.position.x + 2, m.piece.position.y), m.piece.color == "white" ? "black" : "white")))
    .filter(m => m.castle != "queen" 
      || (!isSquareAttacked(vec2(m.piece.position.x - 1, m.piece.position.y), m.piece.color == "white" ? "black" : "white") 
      && !isSquareAttacked(vec2(m.piece.position.x - 2, m.piece.position.y), m.piece.color == "white" ? "black" : "white")));
  }

  function suggestMovesUnsafe(): Move[] {
    const result: Move[] = [];
    for (const piece of pieces.value) {
      result.push(...suggestPieceMoves(piece));
    }
    return result;
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

    if (moves.value.filter(m => m.piece == piece).length != 0)
      return result;

    const kingSideRook = pieces.value.find(p => p.type == "rook" && p.color == piece.color && p.position.x == 8 && moves.value.filter(m => m.piece == p).length == 0);
    const queenSideRook = pieces.value.find(p => p.type == "rook" && p.color == piece.color && p.position.x == 1 && moves.value.filter(m => m.piece == p).length == 0);

    if (kingSideRook && pieces.value.filter(p => p.position.y == piece.position.y && (p.position.x == piece.position.x + 1 || p.position.x == piece.position.x + 2)).length == 0) {
      result.push(makeMove(piece, vec2(piece.position.x + 2, piece.position.y), "king"));
    }

    if (queenSideRook && pieces.value.filter(p => p.position.y == piece.position.y && (p.position.x == piece.position.x - 1 || p.position.x == piece.position.x - 2)).length == 0) {
      result.push(makeMove(piece, vec2(piece.position.x - 2, piece.position.y), "queen"));
    }

    return result;
  }

  function suggestQueenMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...suggestRookMoves(piece));
    result.push(...suggestBishopMoves(piece));

    return result;
  }

  function suggestRookMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...progressPosition(piece, vec2(1, 0)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(-1, 0)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(0, 1)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(0, -1)).map(v => makeMove(piece, v)));

    return result;
  }

  function suggestKnightMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    const dir = [vec2(2, 1), vec2(2, -1), vec2(-2, 1), vec2(-2, -1), vec2(1, 2), vec2(1, -2), vec2(-1, 2), vec2(-1, -2)];
    for (let i = 0; i < dir.length; i++) {
      const pos = vec2(piece.position.x + dir[i].x, piece.position.y + dir[i].y);
      if (isPositionValid(piece, pos))
        result.push(makeMove(piece, pos));
    }

    return result;
  }

  function suggestBishopMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...progressPosition(piece, vec2(1, 1)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(-1, 1)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(1, -1)).map(v => makeMove(piece, v)));
    result.push(...progressPosition(piece, vec2(-1, -1)).map(v => makeMove(piece, v)));

    return result;
  }

  function suggestPawnMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    const frontPos = vec2(piece.position.x, piece.position.y + (piece.color == "white" ? +1 : -1));
    const frontCapture = pieces.value.find(p => p.position.x == frontPos.x && p.position.y == frontPos.y);
    if (!frontCapture && isPositionValid(piece, frontPos)) {
      result.push(makeMove(piece, frontPos, null, frontPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const frontLeftPos = vec2(frontPos.x - 1, frontPos.y);
    const frontLeftCapture = pieces.value.find(p => p.position.x == frontLeftPos.x && p.position.y == frontLeftPos.y);
    if (frontLeftCapture && isPositionValid(piece, frontLeftPos)) {
      result.push(makeMove(piece, frontLeftPos, null, frontLeftPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const frontRightPos = vec2(frontPos.x + 1, frontPos.y);
    const frontRightCapture = pieces.value.find(p => p.position.x == frontRightPos.x && p.position.y == frontRightPos.y);
    if (frontRightCapture && isPositionValid(piece, frontRightPos)) {
      result.push(makeMove(piece, frontRightPos, null, frontRightPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const doubleFrontPos = vec2(frontPos.x, frontPos.y + (piece.color == "white" ? +1 : -1));
    const doubleFrontCapture = pieces.value.find(p => p.position.x == doubleFrontPos.x && p.position.y == doubleFrontPos.y);
    if (!doubleFrontCapture && isPositionValid(piece, doubleFrontPos) && moves.value.filter(m => m.piece == piece).length == 0) {
      result.push(makeMove(piece, doubleFrontPos));
    }

    if (moves.value.length == 0)
      return result;

    const enPassantMove = moves.value[moves.value.length - 1];
    if (enPassantMove.piece.type != "pawn")
      return result;
    if (enPassantMove.piece.color == piece.color)
      return result;
    if (moves.value.filter(m => m.piece == enPassantMove.piece).length > 1)
      return result;
    if (enPassantMove.piece.position.y != piece.position.y)
      return result;
    if (Math.abs(enPassantMove.piece.position.x - piece.position.x) != 1)
      return result;

    const enPassantPos = vec2(enPassantMove.piece.position.x, piece.position.y + (piece.color == "white" ? +1 : -1));
    result.push({
      piece,
      to: enPassantPos,
      from: {...piece.position},
      capture: enPassantMove.piece,
      castle: null,
      promotion: null,
      en_passant: {...enPassantMove.from},
    });

    return result;
  }

  function isSquareAttacked(pos: Vector2, by: Color): boolean {
    const unsafeSuggestions = suggestMovesUnsafe();
    for (const move of unsafeSuggestions) {
      if (move.piece.color == by && move.to.x == pos.x && move.to.y == pos.y)
        return true;
    }

    return false;
  }

  function isInCheck(color: Color): boolean {
    const king = pieces.value.find(p => p.type == "king" && p.color == color);

    if (king ==  undefined) {
      console.error("king is missing");
      return false;
    }

    return isSquareAttacked(king.position, color == "white" ? "black" : "white");
  }

  function isBoardInCheck(): Color | null {
    if (isInCheck("white")) return "white";
    if (isInCheck("black")) return "black";
    return null;
  }

  return {
    pieces,
    moves,
    suggestions,
    turn,
    loadFen,
    requestMove,
    requestUnmove,
    isBoardInCheck,
  }
}