import Stack from "@/tools/stack";
import { internalMoveToMove, pieceToSymbol, stringifyMove, type InternalMove, type Move } from "./move";
import { chessToNumber, numberToChess, numberToVec2, vec2ToNumber, type Square } from "./notation";
import { getInternalPieceColor, getInternalPieceType, getPieceColor, getPieceId, getPieceType, InternalPieceColor, internalPieceToPiece, InternalPieceType, isSlidingPiece, type Piece, type PieceColor, type PieceType, type PromotionPieceType } from "./piece";
import { vec2, type Vector2 } from "./vector";

const Directions = {
  N: 0,
  S: 1,
  W: 2,
  E: 3,
  NW: 4,
  NE: 5,
  SW: 6,
  SE: 7,
};

const direction = [ 8, -8, -1, 1, 7, 9, -9, -7];
const squaresToEdge: number[][] = Array(64).fill(Array(8));

for (let x = 0; x < 8; x++) {
  for (let y = 0; y < 8; y++) {
    let north = 7 - y;
    let south = y;
    let west = x;
    let east = 7 - x;

    squaresToEdge[y * 8 + x] = [
      north,
      south,
      west,
      east,
      Math.min(north, west),
      Math.min(north, east),
      Math.min(south, west),
      Math.min(south, east),
    ];
  }
}

export class Game {
  private board: number[];
  private moves: InternalMove[];
  private whiteTurn: boolean;
  private castle: {
    whiteKingSide: boolean,
    whiteQueenSide: boolean,
    blackKingSide: boolean,
    blackQueenSide: boolean,
  };
  private enPassant: number | null;

  private history: InternalMove[];

  private gameStack: Stack<{
    board: number[],
    moves: InternalMove[],
    whiteTurn: boolean,
    castle: {
      whiteKingSide: boolean,
      whiteQueenSide: boolean,
      blackKingSide: boolean,
      blackQueenSide: boolean,
    },
    enPassant: number | null,
  }>;

  public constructor(fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    this.board = Array(64).fill(0);
    this.moves = [];
    this.whiteTurn = true;
    this.castle = {
      whiteKingSide: false,
      whiteQueenSide: false,
      blackKingSide: false,
      blackQueenSide: false,
    };
    this.enPassant = null;

    this.history = [];

    this.gameStack = new Stack();

    this.loadFen(fen);
  }

  private loadFen(fen: string) {
    const [pieces, turn, castle, enPassant] = fen.split(" ");

    let x = 0, y = 7;
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i] == '/') {
        x = 0;
        y--;
      } else if ('1' <= pieces[i] && pieces[i] <= '8') {
        x += +pieces[i];
      } else {
        let type: number;
        switch (pieces[i]) {
          case 'k':
          case 'K':
            type = InternalPieceType.KING;
            break;
          case 'q':
          case 'Q':
            type = InternalPieceType.QUEEN;
            break;
          case 'r':
          case 'R':
            type = InternalPieceType.ROOK;
            break;
          case 'n':
          case 'N':
            type = InternalPieceType.KNIGHT;
            break;
          case 'b':
          case 'B':
            type = InternalPieceType.BISHOP;
            break;
          case 'p':
          case 'P':
            type = InternalPieceType.PAWN;
            break;
          default:
            throw new Error("Invalid fen")
        }

        const color: number = pieces[i] == pieces[i].toUpperCase() ? InternalPieceColor.WHITE : InternalPieceColor.BLACK;
        this.board[8 * y + x] = color | type | (8 * y + x << 5);

        x++;
      }
    }

    this.whiteTurn = turn == "w";

    if (castle != '-') {
      for (let i = 0; i < castle.length; i++) {
        if (castle[i] == "K") this.castle.whiteKingSide = true;
        if (castle[i] == "Q") this.castle.whiteQueenSide = true;
        if (castle[i] == "k") this.castle.blackKingSide = true;
        if (castle[i] == "q") this.castle.blackQueenSide = true;
      }
    }

    if (enPassant != '-')
      this.enPassant = chessToNumber(enPassant as Square);

    this.generatePseudoMoves();
    this.validateMoves();
  }

  private getMovesFromPos(pos: number): InternalMove[] {
    return this.moves.filter(m => m.from == pos);
  }

  public getPieces(): Piece[] {
    return this.board
      .map((p, i) => p == 0 ? null : 
      internalPieceToPiece(
        p, 
        numberToChess(i), 
        this.getMovesFromPos(i).map(m => internalMoveToMove(m))
      ))
      .filter(p => p != null)
      .sort((a, b) => a.id - b.id);
  }

  public getMoves(): Move[] {
    return this.moves.map(m => internalMoveToMove(m));
  }

  public getHistory(): Move[] {
    return this.history.map(m => internalMoveToMove(m));
  }

  private getInternalPieceColorFromTurn(): number {
    return this.whiteTurn ? InternalPieceColor.WHITE : InternalPieceColor.BLACK;
  }

  public getTurn(): PieceColor {
    return getPieceColor(this.getInternalPieceColorFromTurn());
  }

  public getCastlingRights(): string {
    let result = "";

    if (this.castle.whiteKingSide) result += "K";
    if (this.castle.whiteQueenSide) result += "Q";
    if (this.castle.blackKingSide) result += "k";
    if (this.castle.blackQueenSide) result += "q";

    return result || "-";
  }

  public getEnPassant(): string | null {
    return this.enPassant != null ? numberToChess(this.enPassant) : null;
  }

  public getFile(pos: number): number {
    return pos % 8;
  }

  public getRank(pos: number): number {
    return Math.trunc(pos / 8);
  }

  private stackCurrentState() {
    this.gameStack.push({
      board: [...this.board],
      moves: [...this.moves],
      whiteTurn: this.whiteTurn,
      castle: {...this.castle},
      enPassant: this.enPassant,
    });
  }

  private updateCurrentStateFromStack() {
    const state = this.gameStack.pop();

    this.board = state.board;
    this.moves = state.moves;
    this.whiteTurn = state.whiteTurn;
    this.castle = state.castle;
    this.enPassant = state.enPassant;
  }

  public requestMove(move: Move) {
    const from = chessToNumber(move.from);
    const to = chessToNumber(move.to);

    const piece = this.board[from];
    if (!piece)
      throw new Error(`No piece at ${move.from}`);
    
    const promotion = move.promotion == null ? 0 :
      Object.values(InternalPieceType)[Object.keys(InternalPieceType).map(k => k.toLowerCase()).indexOf(move.promotion)];

    const internalMove = this.moves.find(m => m.from == from && m.to == to && m.promotion == promotion);
    if (!internalMove)
      throw new Error(`No move from ${move.from} to ${move.to}`);
    
    this.makeMove(internalMove);
    this.validateMoves();
  }

  public requestUnmove() {
    this.undoMove();
  }

  private makeMove(move: InternalMove): boolean {
    const piece = this.board[move.from];
    if (!piece)
      throw new Error(`No piece at ${move.from}`);
    
    this.stackCurrentState();

    const type = getInternalPieceType(piece);
    const color = getInternalPieceColor(piece);

    const capture = this.board[move.to];
    const captureType = getInternalPieceType(capture);

    this.board[move.to] = piece;
    this.board[move.from] = 0;

    // en passant
    const isThisEnPassant = type == InternalPieceType.PAWN && move.to == this.enPassant;
    if (isThisEnPassant) {
      this.board[move.to + direction[color == InternalPieceColor.WHITE ? Directions.S : Directions.N]] = 0;
    }

    const canThisBeEnPassant = type == InternalPieceType.PAWN && Math.abs(move.to - move.from) == 16;
    this.enPassant = canThisBeEnPassant ? move.from + (color == InternalPieceColor.WHITE ? 8 : -8) : null;

    // promotion
    if (move.promotion != 0) {
      this.board[move.to] &= 0b11111111000;
      this.board[move.to] |= move.promotion;
    }

    // castle
    const hasCastled = type == InternalPieceType.KING && Math.abs(move.to - move.from) == 2;
    const castleDir = (move.to - move.from) / 2;
    if (hasCastled) {
      const rookPos = (this.whiteTurn ? 0 : 7) * 8 + (castleDir == 1 ? 7 : 0);
      const rook = this.board[rookPos];
      this.board[move.to - castleDir] = rook;
      this.board[rookPos] = 0;
    }

    // castling rights
    if (type == InternalPieceType.KING) {
      if (this.whiteTurn) {
        this.castle.whiteKingSide = false;
        this.castle.whiteQueenSide = false;
      } else {
        this.castle.blackKingSide = false;
        this.castle.blackQueenSide = false;
      }
    } else if (type == InternalPieceType.ROOK) {
      if (this.whiteTurn) {
        if (move.from == 7) {
          this.castle.whiteKingSide = false;
        } else if (move.from == 0) {
          this.castle.whiteQueenSide = false;
        }
      } else {
        if (move.from == 63) {
          this.castle.blackKingSide = false;
        } else if (move.from == 56) {
          this.castle.blackQueenSide = false;
        }
      }
    }

    if (captureType == InternalPieceType.ROOK) {
      if (this.whiteTurn) {
        if (move.to == 63) {
          this.castle.blackKingSide = false;
        } else if (move.to == 56) {
          this.castle.blackQueenSide = false;
        }
      } else {
        if (move.to == 7) {
          this.castle.whiteKingSide = false;
        } else if (move.to == 0) {
          this.castle.whiteQueenSide = false;
        }
      }
    }

    this.whiteTurn = !this.whiteTurn;
    this.history.push(move);
    this.generatePseudoMoves();

    // check validation
    const attackedSquares: boolean[] = Array(64).fill(false);
    for (const move of this.moves) {
      attackedSquares[move.to] = true;
    }

    const oppositeKing = this.board.findIndex(p => getInternalPieceType(p) == InternalPieceType.KING 
      && getInternalPieceColor(p) == (this.whiteTurn ? InternalPieceColor.BLACK : InternalPieceColor.WHITE));
    if (attackedSquares[oppositeKing]) {
      this.undoMove();
      return false;
    }

    // castling validation
    if (hasCastled && (attackedSquares[move.from] || attackedSquares[move.from + castleDir])) {
      this.undoMove();
      return false;
    }

    return true;
  }

  private undoMove() {
    this.history.pop();
    this.updateCurrentStateFromStack();
  }

  public perft(depth: number): {
    move: string,
    nodes: number,
  }[] {
    if (depth == 0) 
      return [];

    const result: {
      move: string,
      nodes: number,
    }[] = [];

    for (const move of this.moves) {
      this.makeMove(move);
      this.validateMoves();
      result.push({
        move: stringifyMove(internalMoveToMove(move)),
        nodes: this.perft(depth - 1).reduce((total, n) => total + n.nodes, 0) + +(depth == 1),
      })
      this.undoMove();
    }

    return result;
  }

  private validateMoves() {
    this.moves = this.moves.filter(m => {
      const color = getInternalPieceColor(this.board[m.from]);
      if (color != (this.whiteTurn ? InternalPieceColor.WHITE : InternalPieceColor.BLACK))
        return false;

      const ok = this.makeMove(m);
      if (ok) this.undoMove();
      return ok;
    });
  }

  private generatePseudoMoves() {
    this.moves = [];

    for (let i = 0; i < 64; i++) {
      const piece = this.board[i];
      if (this.getInternalPieceColorFromTurn() != getInternalPieceColor(piece)) {
        continue;
      }

      switch (getInternalPieceType(piece)) {
        case InternalPieceType.KING:
          this.generateKingMoves(i);
          break;
        case InternalPieceType.QUEEN:
        case InternalPieceType.ROOK:
        case InternalPieceType.BISHOP:
          this.generateSlidingMoves(i);
          break;
        case InternalPieceType.KNIGHT:
          this.generateKnightMoves(i);
          break;
        case InternalPieceType.PAWN:
          this.generatePawnMoves(i);
          break;
      }
    }
  }

  /**
   * Returns false if the move was a capture or friendly piece
   */
  private addMoveIfGood(move: InternalMove): boolean {
    const piece = this.board[move.from];
    const capture = this.board[move.to];

    if (getInternalPieceColor(capture) == getInternalPieceColor(piece)) {
      return false;
    }

    this.moves.push(move);

    if (capture != 0) {
      return false;
    }

    return true;
  }

  private generateSlidingMoves(pos: number) {
    const piece = this.board[pos];

    const startDirIndex = getInternalPieceType(piece) == InternalPieceType.ROOK
      || getInternalPieceType(piece) == InternalPieceType.QUEEN ? 0 : 4;
    const endDirIndex = getInternalPieceType(piece) == InternalPieceType.BISHOP
      || getInternalPieceType(piece) == InternalPieceType.QUEEN ? 8 : 4;

    for (let dirIndex = startDirIndex; dirIndex < endDirIndex; dirIndex++) {
      for (let i = 0; i < squaresToEdge[pos][dirIndex]; i++) {

        const target = pos + direction[dirIndex] * (i + 1);
        if (!this.addMoveIfGood({ from: pos, to: target, promotion: 0 })) {
          break;
        }
      }
    }
  }

  private generateKingMoves(pos: number) {
    for (let dirIndex = 0; dirIndex < 8; dirIndex++) {
      if (squaresToEdge[pos][dirIndex] < 1)
        continue;

      const target = pos + direction[dirIndex];
      if (!this.addMoveIfGood({ from: pos, to: target, promotion: 0 })) {
        continue;
      }
    }

    this.generateCastleMoves(pos, "king");
    this.generateCastleMoves(pos, "queen");
  }

  private generateCastleMoves(pos: number, side: "king" | "queen") {
    const piece = this.board[pos];
    const color = getInternalPieceColor(piece);

    if (color == InternalPieceColor.WHITE && side == "king" && !this.castle.whiteKingSide)
      return;
    if (color == InternalPieceColor.WHITE && side == "queen" && !this.castle.whiteQueenSide)
      return;
    if (color == InternalPieceColor.BLACK && side == "king" && !this.castle.blackKingSide)
      return;
    if (color == InternalPieceColor.BLACK && side == "queen" && !this.castle.blackQueenSide)
      return;

    const dir = side == "king" ? 1 : -1;
    if (this.board[pos + dir] != 0 || this.board[pos + 2 * dir] != 0 || (side == "queen" && this.board[pos + 3 * dir] != 0))
      return;

    this.addMoveIfGood({
      from: pos,
      to: pos + dir * 2,
      promotion: 0,
    });
  }

  private generateKnightMoves(pos: number) {
    //  2 * dir x + dir y
    const dir = [
      [Directions.N, Directions.W],
      [Directions.N, Directions.E],
      [Directions.S, Directions.W],
      [Directions.S, Directions.E],
      [Directions.W, Directions.N],
      [Directions.W, Directions.S],
      [Directions.E, Directions.N],
      [Directions.E, Directions.S],
    ];

    for (const mv of dir) {
      if (squaresToEdge[pos][mv[0]] < 2 || squaresToEdge[pos][mv[1]] < 1)
        continue;

      this.addMoveIfGood({
        from: pos,
        to: pos + direction[mv[0]] * 2 + direction[mv[1]],
        promotion: 0,
      });
    }
  }

  private generatePawnMoves(pos: number) {
    const piece = this.board[pos];
    const color = getInternalPieceColor(piece);
    const dir = color == InternalPieceColor.WHITE ? Directions.N : Directions.S;
    const isOnStartingSquare = this.getRank(pos) == (color == InternalPieceColor.WHITE ? 1 : 6); 
    const promotion = this.getRank(pos) == (color == InternalPieceColor.WHITE ? 6 : 1);

    // forwards
    for (let i = 0; i < 1 + +isOnStartingSquare; i++) {
      const target = pos + direction[dir] * (i + 1);
      const capture = this.board[target];

      if (capture != 0)
        break;

      if (!promotion) {
        this.moves.push({
          from: pos,
          to: target,
          promotion: 0,
        });
      } else {
        for (let type = InternalPieceType.QUEEN; type <= InternalPieceType.BISHOP; type++) {
          this.moves.push({
            from: pos,
            to: target,
            promotion: type,
          });
        }
      }
    }

    // captures
    for (let i = Directions.W; i <= Directions.E; i++) {
      if (squaresToEdge[pos][i] < 1)
        continue;

      const target = pos + direction[dir] + direction[i];
      const capture = this.board[target];

      if ((capture != 0 && getInternalPieceColor(capture) != color) || target == this.enPassant) {
        if (!promotion) {
          this.moves.push({
            from: pos,
            to: target,
            promotion: 0,
          });
        } else {
          for (let type = InternalPieceType.QUEEN; type <= InternalPieceType.BISHOP; type++) {
            this.moves.push({
              from: pos,
              to: target,
              promotion: type,
            });
          }
        }
      }
    }
  }

  private strippedSanFromMove(move: InternalMove): string {
    const piece = this.board[move.from];
    const type = getInternalPieceType(piece);
    const isCapture = this.board[move.to] != 0 || this.enPassant == move.to;
    let moves = this.moves.filter(m => m.to == move.to 
      && getInternalPieceType(this.board[m.from]) == getInternalPieceType(piece)
      && m.promotion == move.promotion);

    // castle
    if (type == InternalPieceType.KING && Math.abs(move.to - move.from) == 2) {
      if (move.to - move.from == 2) return "O-O";
      else return "O-O-O";
    }

    const pieceSymbol = type != InternalPieceType.PAWN ? pieceToSymbol(getPieceType(type)).toUpperCase() : "";
    const destinationSquare = numberToChess(move.to);
    let ambiguousFile = "";
    let ambiguousRank = "";
    const captureSymbol = isCapture ? "x" : "";
    const promotionSymbol = move.promotion != 0 ? pieceToSymbol(getPieceType(move.promotion)).toUpperCase() : "";

    const file = this.getFile(move.from);

    // ambiguity or pawn capture
    if (moves.length > 1 || (type == InternalPieceType.PAWN && (Math.abs(move.to - move.from) == 9 || Math.abs(move.to - move.from) == 7))) {
      ambiguousFile = "abcdefgh"[file];
      moves = moves.filter(m => this.getFile(m.from) == file);
    }

    const rank = this.getRank(move.from);

    if (moves.length > 1) {
      ambiguousFile = "";
      ambiguousRank = (rank + 1).toString();
      moves = moves.filter(m => this.getRank(m.from) == rank);
    }

    if (moves.length > 1) {
      ambiguousFile = "abcdefgh"[file];
      ambiguousRank = (rank + 1).toString();
      moves = moves.filter(m => this.getRank(m.from) == rank && this.getFile(m.from) == file);
    }

    return pieceSymbol + ambiguousFile + ambiguousRank + captureSymbol + destinationSquare + promotionSymbol;
  }

  public sanFromMove(move: Move): string {
    const from = chessToNumber(move.from);
    const to = chessToNumber(move.to);
    const promotion = move.promotion == null ? 0 :
      Object.values(InternalPieceType)[Object.keys(InternalPieceType).map(k => k.toLowerCase()).indexOf(move.promotion)];
    return this.strippedSanFromMove({ from, to, promotion });
  }

  private stripSan(move: string): string {
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
  }

  public moveFromSan(move: string): Move {
    const san = this.stripSan(move);
    const moves = this.getMoves();
    if (san == "b1Q") console.log(moves);

    for (const move of moves) {
      if (this.sanFromMove(move) == san) {
        return move;
      }
    }

    throw new Error(`Invalid SAN ${move}`);
  }

  public requestMoveFronSan(move: string) {
    const normalMove = this.moveFromSan(move);
    this.requestMove(normalMove);
  }

  public isMoveACapture(move: Move): boolean {
    return this.board[chessToNumber(move.to)] != 0 || (this.enPassant == chessToNumber(move.to) && getInternalPieceType(this.board[chessToNumber(move.from)]) == InternalPieceType.PAWN);
  }
}