import ChessPiece, { ChessPieces, ChessPieceColors } from ".";
import { Vector2 } from "../Vector";

export default class ChessPieceData {
    piece: ChessPieces;
    color: ChessPieceColors;
    position: Vector2; // game position, indexed from 1
    elem: React.JSX.Element;
    key: string;

    constructor(piece: ChessPieces, color: ChessPieceColors, position: Vector2) {
        this.piece = piece;
        this.color = color;
        this.position = position;

        this.key = this.color == ChessPieceColors.WHITE ? "w" : "b";
        switch (this.piece) {
        case ChessPieces.KING: this.key += "k"; break;
        case ChessPieces.QUEEN: this.key += "q"; break;
        case ChessPieces.ROOK: this.key += "r"; break;
        case ChessPieces.KNIGHT: this.key += "n"; break;
        case ChessPieces.BISHOP: this.key += "b"; break;
        case ChessPieces.PAWN: this.key += "p"; break;
        }
        this.key += this.position.x.toString();

        this.elem = <ChessPiece data={this} key={this.key} />;
    }

    setPosition(position: Vector2) {
        console.log(`Moved ${this.key} from ${this.position} to ${position}`);
        this.position = position;
    }

    setScreenPosition = (screenPos: Vector2) => {};
    setZIndex = (z: number | string | null) => {};
}