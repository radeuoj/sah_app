import React from "react";
import { Vector2, gamePosToScreenPos, screenPosToGamePos } from "../Vector";
import { useChessPieceContext } from "@/context";
import ChessPieceData from "./ChessPieceData";

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

export default function ChessPiece({ data }: { data: ChessPieceData }) {
    const mouseDown = React.useRef(false);
    // const [position, setPosition] = React.useState(data.position);
    const ref = React.useRef<HTMLDivElement | null>(null);
    // const boundingClientRect = React.useRef(getBoundingClientRect());
    const { getCurrentPos, getBoundingClientRect, playingAsWhite, requestMove } = useChessPieceContext();

    const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = true;
        ref.current?.style.setProperty("z-index", "2");
    }

    const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = false;
        // setPosition({ x: Math.floor(getCurrentPos().x), y: Math.floor(getCurrentPos().y) });
        let screenPos = new Vector2(Math.floor(getCurrentPos().x), Math.floor(getCurrentPos().y));
        if (requestMove(data.position, screenPosToGamePos(screenPos, playingAsWhite)))
            ref.current?.style.setProperty("translate", `${screenPos.x * 100}% ${screenPos.y * 100}%`);
        else {
            screenPos = gamePosToScreenPos(data.position, playingAsWhite);
            ref.current?.style.setProperty("translate", `${screenPos.x * 100}% ${screenPos.y * 100}%`);
        }
        // data.setPosition(screenPosToGamePos(screenPos, playingAsWhite));
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
            ref.current?.style.setProperty("translate", `${(x - 0.5) * 100}% ${(y - 0.5) * 100}%`);
            // setPosition({ x: x - 0.5, y: y - 0.5 });
    }

    return (
        <div ref={ref} className="chess_piece" id={data.key} style={{
            // transform: `translate(${position.x * 100}%, ${position.y * 100}%)`,
            translate: `${gamePosToScreenPos(data.position, playingAsWhite).x * 100}% ${gamePosToScreenPos(data.position, playingAsWhite).y * 100}%`,
            // transform: playingAsWhite ? `translate(${position.x * 100}%, ${position.y * 100}%)` : `translate(${(7 - position.x) * 100}%, ${(7 - position.y) * 100}%)`,
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

                switch (data.piece) {
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

                src = `/${pieceName}-${data.color == ChessPieceColors.BLACK ? "b" : "w"}.svg`;

                return <img src={src} draggable="false" style={{
                    width: "100%",
                    height: "100%",
                }} />;
            })()}
        </div>
    );
}