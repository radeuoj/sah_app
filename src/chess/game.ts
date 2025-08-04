import type { Move } from "./move";
import { chessToNumber, numberToChess, numberToVec2, vec2ToNumber } from "./notation";
import type { Piece, PieceColor, PieceType } from "./piece";
import { vec2, type Vector2 } from "./vector";

export class Game {
  private pieces: Piece[];
  private board: (Piece | null)[];
  private whiteTurn: boolean;
  private castle: {
    whiteKingSide: boolean,
    whiteQueenSide: boolean,
    blackKingSide: boolean,
    blackQueenSide: boolean,
  };
  private enPassant: number | null;

  public constructor(fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    this.pieces = []
    this.board = Array(64).fill(null);
    this.whiteTurn = true;
    this.castle = {
      whiteKingSide: false,
      whiteQueenSide: false,
      blackKingSide: false,
      blackQueenSide: false,
    };
    this.enPassant = null;

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
        let type: PieceType;
        switch (pieces[i]) {
          case 'k':
          case 'K':
            type = "king";
            break;
          case 'q':
          case 'Q':
            type = "queen";
            break;
          case 'r':
          case 'R':
            type = "rook";
            break;
          case 'n':
          case 'N':
            type = "knight";
            break;
          case 'b':
          case 'B':
            type = "bishop";
            break;
          case 'p':
          case 'P':
            type = "pawn";
            break;
          default:
            throw new Error("Invalid fen")
        }

        const color: PieceColor = pieces[i] == pieces[i].toUpperCase() ? "white" : "black";

        this.pieces.push({
          type,
          color,
          position: 8 * y + x,
          moves: [],
        });

        x++;
      }
    }
    this.loadBoardFromPieces();
    this.generateMoves();

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
      this.enPassant = chessToNumber(enPassant);
  }
  
  private loadBoardFromPieces() {
    this.board = Array(64).fill(null);
    for (const piece of this.pieces) {
      this.board[piece.position] = piece;
    }
  }

  public export() {
    return JSON.stringify({
      pieces: this.pieces,
    }, null, 2);
  }

  public isMoveACapture(move: Move): boolean {
    return this.board[move.to] != null || this.enPassant == move.to;
  }

  public requestMove(from: number, to: number) {
    const piece = this.pieces.find(p => p.position == from);
    if (!piece)
      throw new Error(`No piece at ${from}`);
    
    this.makeMove({ from, to, });
  }

  private makeMove(move: Move) {
    const piece = this.pieces.find(p => p.position == move.from);
    if (!piece)
      throw new Error(`No piece at ${move.from}`);
    piece.position = move.to;

    const capture = this.board[move.to];
    if (capture != null)
      this.pieces = this.pieces.filter(p => p != this.board[move.to]);
    this.board[move.to] = piece;
    this.board[move.from] = null;

    this.generateMoves();
  }

  private generateMoves() {
    for (const piece of this.pieces) {
      piece.moves = this.generatePieceMoves(piece);
    }
  }

  private generatePieceMoves(piece: Piece): Move[] {
    switch (piece.type) {
      case "king": return this.generateKingMoves(piece);
      case "queen": return this.generateQueenMoves(piece);
      case "rook": return this.generateRookMoves(piece);
      case "knight": return this.generateKnightMoves(piece);
      case "bishop": return this.generateBishopMoves(piece);
      case "pawn": return this.generatePawnMoves(piece);
    }
  }

  private isPositionValid(piece: Piece, { x, y }: Vector2): boolean {
    return x <= 7 && x >= 0 && y <= 7 && y >= 0 && (this.board[y * 8 + x] == null || this.board[y * 8 + x]?.color != piece.color);
  }

  private generateKingMoves(piece: Piece): Move[] {
    const result: Move[] = [];
    const { x, y } = numberToVec2(piece.position);

    if (this.isPositionValid(piece, vec2(x, y + 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x, y + 1)) });
    if (this.isPositionValid(piece, vec2(x, y - 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x, y - 1)) });
    if (this.isPositionValid(piece, vec2(x + 1, y))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x + 1, y)) });
    if (this.isPositionValid(piece, vec2(x - 1, y))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x - 1, y)) });
    if (this.isPositionValid(piece, vec2(x + 1, y + 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x + 1, y + 1)) });
    if (this.isPositionValid(piece, vec2(x - 1, y + 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x - 1, y + 1)) });
    if (this.isPositionValid(piece, vec2(x + 1, y - 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x + 1, y - 1)) });
    if (this.isPositionValid(piece, vec2(x - 1, y - 1))) result.push({ from: piece.position, to: vec2ToNumber(vec2(x - 1, y - 1)) });

    return result;
  }

  private generateQueenMoves(piece: Piece): Move[] {
    
  }

  private generateRookMoves(piece: Piece): Move[] {
    
  }

  private generateKnightMoves(piece: Piece): Move[] {
    
  }

  private generateBishopMoves(piece: Piece): Move[] {
    
  }

  private generatePawnMoves(piece: Piece): Move[] {
    
  }
}