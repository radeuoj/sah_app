export type Color = "white" | "black";

export type PieceType = 
  | "king"
  | "queen"
  | "rook"
  | "knight"
  | "bishop"
  | "pawn";

type ChessPosFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type ChessPosRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type ChessPos = `${ChessPosFile}${ChessPosRank}`;

export type Vector2 = {
  x: number,
  y: number,
};

export function vec2(x: number, y: number): Vector2 {
  return { x, y };
}

export type Piece = {
  type: PieceType,
  color: Color,
  position: Vector2,
}

export function makePiece(type: PieceType, color: Color, position: Vector2): Piece {
  return {
    type,
    color,
    position,
  };
}

type ChessLetterLowercase = 'k' | 'q' | 'r' | 'n' | 'b' | 'p';
export type ChessLetter = ChessLetterLowercase | Uppercase<ChessLetterLowercase>;

export function letterToPieceType(letter: string): PieceType {
  switch (letter) {
    case 'k':
    case 'K':
      return "king";
    case 'q':
    case 'Q':
      return "queen";
    case 'r':
    case 'R':
      return "rook";
    case 'n':
    case 'N':
      return "knight";
    case 'b':
    case 'B':
      return "bishop";
    case 'p':
    case 'P':
      return "pawn";
  }

  throw new Error("Invalid leter");
}

export function isChessLetter(letter: string): boolean {
  return "kKqQrRnNbBpP".indexOf(letter) > -1;
}