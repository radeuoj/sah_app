import { ChessPieces } from "../ChessPiece";
import Image from "next/image";
import { Position } from "../Position";

export enum ChessSquareColor {
    BLACK,
    WHITE,
}

export default function ChessSquare({ color, position, setCurrentPos }: { color: ChessSquareColor, position: Position, setCurrentPos: (pos: Position) => void }) {
    return (
        <div style={{
            backgroundColor: color == ChessSquareColor.BLACK ? "#8A2D3B" : "#FBDB93",
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
        }} /*onClick={onClick}*/
        onMouseMove={(event) => {
            setCurrentPos(position);
        }}
        >
            {/* {piece == ChessPieces.PAWN ? <img src="/pawn-w.svg" draggable="false" style={{
                width: "100%",
                height: "100%",
            }} /> : ""} */}
        {position.x}{position.y}
        </div>
    );
}