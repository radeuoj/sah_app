import React from "react";
import { Vector2 } from "../Vector";

export enum ChessPieces {
    PAWN,
    ROOK,
    KNIGHT,
    BISHOP,
    KING,
    QUEEN,
}

export enum ChessPieceColors {
    BLACK,
    WHITE,
}

export interface ChessPieceData {
    piece: ChessPieces,
    color: ChessPieceColors,
    elem: React.JSX.Element,
}

export default function ChessPiece({ piece, color, startPos, getCurrentPos, getBoundingClientRect }: { piece: ChessPieces, color: ChessPieceColors, startPos: Vector2, getCurrentPos: () => Vector2, getBoundingClientRect: () => DOMRect }) {
    const mouseDown = React.useRef(false);
    const [position, setPosition] = React.useState(startPos);
    const ref = React.useRef<HTMLDivElement | null>(null);
    // const boundingClientRect = React.useRef(getBoundingClientRect());

    const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = true;
        ref.current?.style.setProperty("z-index", "2");
    }

    const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = false;
        setPosition({ x: Math.floor(getCurrentPos().x), y: Math.floor(getCurrentPos().y) });
        ref.current?.style.setProperty("z-index", null);
    }

    const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        // event.preventDefault();
        // event.stopPropagation();

        let clientX: number, clientY: number;
        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        const x = (clientX - getBoundingClientRect().x) / getBoundingClientRect().width * 8;
        const y = (clientY - getBoundingClientRect().y) / getBoundingClientRect().height * 8;
        if (mouseDown.current)
            setPosition({ x: x - 0.5, y: y - 0.5 });
    }

    return (
        <div ref={ref} style={{
            height: "12.5%",
            width: "12.5%",
            position: "absolute",
            transform: `translate(${position.x * 100}%, ${position.y * 100}%)`,
        }}

        onMouseDown={mouseDownHandler}
        onTouchStart={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onTouchEnd={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        onTouchMove={mouseMoveHandler}

        >
            {/* {piece == ChessPieces.PAWN ? <img src="/pawn-w.svg" draggable="false" style={{
                width: "100%",
                height: "100%",
            }} /> : ""} */}
            {(() => {
                let src = "/pawn-w.svg";
                let pieceName = "pawn";

                switch (piece) {
                case ChessPieces.PAWN:
                    pieceName = "pawn";
                    break;
                case ChessPieces.ROOK:
                    pieceName = "rook";
                    break;
                case ChessPieces.BISHOP:
                    pieceName = "bishop";
                    break;
                case ChessPieces.KNIGHT:
                    pieceName = "knight";
                    break;
                case ChessPieces.KING:
                    pieceName = "king";
                    break;
                case ChessPieces.QUEEN:
                    pieceName = "queen";
                    break;
                default:
                    pieceName = "pawn";
                    break;
                }

                src = `/${pieceName}-${color == ChessPieceColors.BLACK ? "b" : "w"}.svg`;

                return <img src={src} draggable="false" style={{
                    width: "100%",
                    height: "100%",
                }} />;
            })()}
        </div>
    );
}