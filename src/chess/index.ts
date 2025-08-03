import { isProxy, ref, shallowRef, toRaw, type Ref } from "vue";
import { isChessLetter, letterToPieceType, makePiece, vec2, type Color, type Piece, type Vector2, type Move } from "./types";

export class ChessGame {
  public pieces: Ref<Piece[]>;
  public moves: Ref<Move[]>;
  public suggestions: Ref<Move[]>;
  public turn: Ref<Color>;

  private attackedSquares: Vector2[];

  public constructor() {
    this.pieces = ref([]);
    this.moves = ref([]);
    this.suggestions = ref([]);
    this.turn = ref("white");

    this.attackedSquares = [];
  }

  public loadFen(fen: string): boolean {
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

    this.pieces.value = new_pieces;
    this.suggestMoves();
    return true;
  }

  private nextTurn() {
    this.turn.value = this.turn.value == "white" ? "black" : "white";
  }

  public requestMove(piece: Piece, pos: Vector2): boolean {
    const nextMove = this.suggestions.value.find(m => m.piece == piece && m.to.x == pos.x && m.to.y == pos.y);
    if (!nextMove) return false;

    this.move(nextMove);
    this.suggestMoves();

    return true;
  }

  public requestUnmove(): Move {
    const lastMove = this.unmove();
    this.suggestMoves();

    return lastMove;
  }

  private move(move: Move): boolean {
    this.pieces.value = this.pieces.value.filter(p => p != move.capture);
    this.moves.value.push(move);

    move.piece.position = {...move.to};
    if (move.capture) move.capture.position = vec2(0, 0);

    if (move.castle) this.castle(move);
    if (move.promotion) this.promote(move);

    this.nextTurn();
    // this.loadAttackedSquares();
    if (this.isInCheck(move.piece.color)) {
      this.unmove();
      return false;
    }

    return true;
  }

  private unmove(): Move {
    if (this.moves.value.length <= 0)
      throw new Error("No moves!!");

    const lastMove = this.moves.value[this.moves.value.length - 1];
    this.moves.value = this.moves.value.filter(m => m != lastMove);

    lastMove.piece.position = {...lastMove.from};
    if (lastMove.capture) {
      this.pieces.value.push(lastMove.capture);
      lastMove.capture.position = {...lastMove.to};
    }

    if (lastMove.castle) this.uncastle(lastMove);
    if (lastMove.promotion) this.unpromote(lastMove);
    if (lastMove.en_passant && lastMove.capture) lastMove.capture.position = {...lastMove.en_passant};

    this.nextTurn();
    // this.loadAttackedSquares();

    return lastMove;
  }

  private castle(move: Move) {
    if (move.castle == null)
      throw new Error("castle is null!!!");

    const rook = this.pieces.value.find(p => p.type == "rook" && p.position.x == (move.castle == "king" ? 8 : 1) && p.position.y == move.piece.position.y);
    if (rook == undefined)
      throw new Error(`no ${move.castle} side rook`);

    rook.position = vec2(move.piece.position.x + (move.castle == "king" ? -1 : +1), move.piece.position.y);
  }

  private uncastle(move: Move) {
    if (move.castle == null)
      throw new Error("castle is null!!!");

    const rook = this.pieces.value.find(p => p.type == "rook" && p.position.x == move.to.x + (move.castle == "king" ? -1 : +1) && p.position.y == move.to.y);
    if (rook == undefined)
      throw new Error(`no ${move.castle} side rook`);

    rook.position = vec2(move.castle == "king" ? 8 : 1, move.piece.position.y);
  }

  private promote(move: Move) {
    if (move.promotion == null)
      throw new Error("this isnt a promotion!!");

    move.piece.type = move.promotion;
  }

  private unpromote(move: Move) {
    if (move.promotion == null)
      throw new Error("this isnt a promotion!!");

    move.piece.type = "pawn";
  }

  private makeMove(piece: Piece, position: Vector2, castle?: Move["castle"], promotion?: Move["promotion"], en_passant?: Move["en_passant"]): Move {
    const capture = this.pieces.value.find((p) => p.position.x == position.x && p.position.y == position.y);
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

  private isPositionValid(piece: Piece, position: Vector2): boolean {
    if (piece.position.x == position.x && piece.position.y == position.y) return false;
    if (piece.position.x == position.x && piece.position.y == position.y) return false;
    if (position.x < 1 || position.y < 1 || position.x > 8 || position.y > 8) return false;
    const capture = this.pieces.value.find((p) => p.position.x == position.x && p.position.y == position.y && p.color == piece.color);
    if (capture) return false;
    return true;
  }

  private progressPosition(piece: Piece, step: Vector2): Vector2[] {
    const result: Vector2[] = [];

    for (let i = piece.position.x + step.x, j = piece.position.y + step.y; this.isPositionValid(piece, vec2(i, j)); i += step.x, j += step.y) {
      result.push(vec2(i, j));
      if (this.pieces.value.find(p => p.position.x == i && p.position.y == j))
        break;
    }

    return result;
  }

  private isMoveValid(newMove: Move): boolean {
    const ok = this.move(newMove);
    if (ok) this.unmove();
    return ok;
  }

  private suggestMoves() {
    const start = Date.now();
    
    this.suggestions.value = this.suggestMovesUnsafe()
    .filter(m => m.piece.color == this.turn.value && this.isMoveValid(m))
    // .filter(m => m.castle == null || !this.isInCheck(m.piece.color))
    // .filter(m => m.castle != "king" 
    //   || (!this.isSquareAttacked(vec2(m.piece.position.x + 1, m.piece.position.y), m.piece.color == "white" ? "black" : "white") 
    //   && !this.isSquareAttacked(vec2(m.piece.position.x + 2, m.piece.position.y), m.piece.color == "white" ? "black" : "white")))
    // .filter(m => m.castle != "queen" 
    //   || (!this.isSquareAttacked(vec2(m.piece.position.x - 1, m.piece.position.y), m.piece.color == "white" ? "black" : "white") 
    //   && !this.isSquareAttacked(vec2(m.piece.position.x - 2, m.piece.position.y), m.piece.color == "white" ? "black" : "white")));

    console.log(`${Date.now() - start}ms`)
  }

  private suggestMovesUnsafe(): Move[] {
    const result: Move[] = [];
    for (const piece of this.pieces.value) {
      result.push(...this.suggestPieceMoves(piece));
    }

    return result;
  }

  private suggestPieceMoves(piece: Piece): Move[] {
    switch (piece.type) {
      case "king": return this.suggestKingMoves(piece);
      case "queen": return this.suggestQueenMoves(piece);
      case "rook": return this.suggestRookMoves(piece);
      case "knight": return this.suggestKnightMoves(piece);
      case "bishop": return this.suggestBishopMoves(piece);
      case "pawn": return this.suggestPawnMoves(piece);
    }
  }

  private suggestKingMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    for (let i = piece.position.x - 1; i <= piece.position.x + 1; i++) {
      for (let j = piece.position.y - 1; j <= piece.position.y + 1; j++) {
        if (this.isPositionValid(piece, vec2(i, j)))
          result.push(this.makeMove(piece, vec2(i, j)));
      }
    }

    if (this.moves.value.filter(m => m.piece == piece).length != 0)
      return result;

    const kingSideRook = this.pieces.value.find(p => p.type == "rook" && p.color == piece.color && p.position.x == 8 && this.moves.value.filter(m => m.piece == p).length == 0);
    const queenSideRook = this.pieces.value.find(p => p.type == "rook" && p.color == piece.color && p.position.x == 1 && this.moves.value.filter(m => m.piece == p).length == 0);

    if (kingSideRook && this.pieces.value.filter(p => p.position.y == piece.position.y && (p.position.x == piece.position.x + 1 || p.position.x == piece.position.x + 2)).length == 0) {
      result.push(this.makeMove(piece, vec2(piece.position.x + 2, piece.position.y), "king"));
    }

    if (queenSideRook && this.pieces.value.filter(p => p.position.y == piece.position.y && (p.position.x == piece.position.x - 1 || p.position.x == piece.position.x - 2)).length == 0) {
      result.push(this.makeMove(piece, vec2(piece.position.x - 2, piece.position.y), "queen"));
    }

    return result;
  }

  private suggestQueenMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...this.suggestRookMoves(piece));
    result.push(...this.suggestBishopMoves(piece));

    return result;
  }

  private suggestRookMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...this.progressPosition(piece, vec2(1, 0)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(-1, 0)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(0, 1)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(0, -1)).map(v => this.makeMove(piece, v)));

    return result;
  }

  private suggestKnightMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    const dir = [vec2(2, 1), vec2(2, -1), vec2(-2, 1), vec2(-2, -1), vec2(1, 2), vec2(1, -2), vec2(-1, 2), vec2(-1, -2)];
    for (let i = 0; i < dir.length; i++) {
      const pos = vec2(piece.position.x + dir[i].x, piece.position.y + dir[i].y);
      if (this.isPositionValid(piece, pos))
        result.push(this.makeMove(piece, pos));
    }

    return result;
  }

  private suggestBishopMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    result.push(...this.progressPosition(piece, vec2(1, 1)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(-1, 1)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(1, -1)).map(v => this.makeMove(piece, v)));
    result.push(...this.progressPosition(piece, vec2(-1, -1)).map(v => this.makeMove(piece, v)));

    return result;
  }

  private suggestPawnMoves(piece: Piece): Move[] {
    const result: Move[] = [];

    const frontPos = vec2(piece.position.x, piece.position.y + (piece.color == "white" ? +1 : -1));
    const frontCapture = this.pieces.value.find(p => p.position.x == frontPos.x && p.position.y == frontPos.y);
    if (!frontCapture && this.isPositionValid(piece, frontPos)) {
      result.push(this.makeMove(piece, frontPos, null, frontPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const frontLeftPos = vec2(frontPos.x - 1, frontPos.y);
    const frontLeftCapture = this.pieces.value.find(p => p.position.x == frontLeftPos.x && p.position.y == frontLeftPos.y);
    if (frontLeftCapture && this.isPositionValid(piece, frontLeftPos)) {
      result.push(this.makeMove(piece, frontLeftPos, null, frontLeftPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const frontRightPos = vec2(frontPos.x + 1, frontPos.y);
    const frontRightCapture = this.pieces.value.find(p => p.position.x == frontRightPos.x && p.position.y == frontRightPos.y);
    if (frontRightCapture && this.isPositionValid(piece, frontRightPos)) {
      result.push(this.makeMove(piece, frontRightPos, null, frontRightPos.y == (piece.color == "white" ? 8 : 1) ? "queen" : null));
    }

    const doubleFrontPos = vec2(frontPos.x, frontPos.y + (piece.color == "white" ? +1 : -1));
    const doubleFrontCapture = this.pieces.value.find(p => p.position.x == doubleFrontPos.x && p.position.y == doubleFrontPos.y);
    if (!doubleFrontCapture && this.isPositionValid(piece, doubleFrontPos) && this.moves.value.filter(m => m.piece == piece).length == 0) {
      result.push(this.makeMove(piece, doubleFrontPos));
    }

    if (this.moves.value.length == 0)
      return result;

    const enPassantMove = this.moves.value[this.moves.value.length - 1];
    if (enPassantMove.piece.type != "pawn")
      return result;
    if (enPassantMove.piece.color == piece.color)
      return result;
    if (this.moves.value.filter(m => m.piece == enPassantMove.piece).length > 1)
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

  private loadAttackedSquares() {
    const unsafeSuggestions = this.suggestMovesUnsafe();
    for (const move of unsafeSuggestions) {
      this.attackedSquares.push(move.to);
    }
  }

  private isSquareAttacked(pos: Vector2, by: Color): boolean {
    const unsafeSuggestions = this.suggestMovesUnsafe();
    for (const move of unsafeSuggestions) {
      if (move.piece.color == by && move.to.x == pos.x && move.to.y == pos.y)
        return true;
    }

    return false;
  }

  private isInCheck(color: Color): boolean {
    const king = this.pieces.value.find(p => p.type == "king" && p.color == color);

    if (king ==  undefined) {
      console.error("king is missing");
      return false;
    }

    return this.isSquareAttacked(king.position, color == "white" ? "black" : "white");
  }

  public isBoardInCheck(): Color | null {
    return null;
    if (this.isInCheck("white")) return "white";
    if (this.isInCheck("black")) return "black";
    return null;
  }
}