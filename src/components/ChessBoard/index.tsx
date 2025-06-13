'use client';

import "./style.css";
import ChessSquare, { ChessSquareColor } from "../ChessSquare";
import ChessPiece, { ChessPieceColors, ChessPieces } from "../ChessPiece";
import ChessPieceData from "../ChessPiece/ChessPieceData";
import React, { ReactNode, useRef } from "react";
import { screenPosToGamePos, Vector2 } from "../Vector";
import { ChessPieceContext } from "@/context";

function getStartingPosition(): ChessPieceData[] {
    const result: ChessPieceData[] = [];

    // KINGS
    result.push(new ChessPieceData(ChessPieces.KING, ChessPieceColors.WHITE, new Vector2(5, 1)));
    result.push(new ChessPieceData(ChessPieces.KING, ChessPieceColors.BLACK, new Vector2(5, 8)));

    // QUEENS
    result.push(new ChessPieceData(ChessPieces.QUEEN, ChessPieceColors.WHITE, new Vector2(4, 1)));
    result.push(new ChessPieceData(ChessPieces.QUEEN, ChessPieceColors.BLACK, new Vector2(4, 8)));

    // BISHOPS
    result.push(new ChessPieceData(ChessPieces.BISHOP, ChessPieceColors.WHITE, new Vector2(3, 1)));
    result.push(new ChessPieceData(ChessPieces.BISHOP, ChessPieceColors.WHITE, new Vector2(6, 1)));
    result.push(new ChessPieceData(ChessPieces.BISHOP, ChessPieceColors.BLACK, new Vector2(3, 8)));
    result.push(new ChessPieceData(ChessPieces.BISHOP, ChessPieceColors.BLACK, new Vector2(6, 8)));

    // KNIGHTS
    result.push(new ChessPieceData(ChessPieces.KNIGHT, ChessPieceColors.WHITE, new Vector2(2, 1)));
    result.push(new ChessPieceData(ChessPieces.KNIGHT, ChessPieceColors.WHITE, new Vector2(7, 1)));
    result.push(new ChessPieceData(ChessPieces.KNIGHT, ChessPieceColors.BLACK, new Vector2(2, 8)));
    result.push(new ChessPieceData(ChessPieces.KNIGHT, ChessPieceColors.BLACK, new Vector2(7, 8)));

    // ROOKS
    result.push(new ChessPieceData(ChessPieces.ROOK, ChessPieceColors.WHITE, new Vector2(1, 1)));
    result.push(new ChessPieceData(ChessPieces.ROOK, ChessPieceColors.WHITE, new Vector2(8, 1)));
    result.push(new ChessPieceData(ChessPieces.ROOK, ChessPieceColors.BLACK, new Vector2(1, 8)));
    result.push(new ChessPieceData(ChessPieces.ROOK, ChessPieceColors.BLACK, new Vector2(8, 8)));

    // PAWNS
    for (let i = 1; i <= 8; i++)  {
        result.push(new ChessPieceData(ChessPieces.PAWN, ChessPieceColors.WHITE, new Vector2(i, 2)));
        result.push(new ChessPieceData(ChessPieces.PAWN, ChessPieceColors.BLACK, new Vector2(i, 7)));
    }

    return result;
}

export default function ChessBoard({ playingAsWhite }: { playingAsWhite: boolean }) {
    // const [pos, setPos] = React.useState<Position>({ x: 0, y: 0 });
    const pos = useRef<Vector2>({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement | null>(null);
    const targetSquare = useRef<HTMLDivElement | null>(null);
    const mouseDown = React.useRef(false);

    const [game, setGame] = React.useState<ChessPieceData[]>(getStartingPosition());

    function requestMove(from: Vector2, to: Vector2): boolean {
        if (from.x == to.x && from.y == to.y) return false;

        const fromData = game.find((el) => el.position.x == from.x && el.position.y == from.y);
        if (fromData == undefined) throw `There is no piece at ${from}`;

        const toData = game.find((el) => el.position.x == to.x && el.position.y == to.y);
        if (toData != undefined) {
            if (fromData.color == toData.color) return false;
            setGame(g => g.filter(el => el.key != toData.key));
        }

        fromData.setPosition(to);
        
        return true;
    }
    
    const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = true;
        targetSquare.current?.style.setProperty("visibility", "visible");

        let clientX: number, clientY: number;
        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const x = (clientX - rect.x) / rect.width * 8;
            const y = (clientY - rect.y) / rect.height * 8;
            // console.log(`${x} ${y}`);

            if (targetSquare.current && x >= 0 && x < 8 && y >= 0 && y < 8) {
                // setPos({ x, y });
                pos.current = { x, y };
                targetSquare.current?.style.setProperty("transform", `translate(${Math.floor(pos.current.x)}00%, ${Math.floor(pos.current.y)}00%)`);
            }
        }
    }

    const mouseUpHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        mouseDown.current = false;
        targetSquare.current?.style.setProperty("visibility", "hidden");
    }

    const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        let clientX: number, clientY: number;
        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const x = (clientX - rect.x) / rect.width * 8;
            const y = (clientY - rect.y) / rect.height * 8;
            // console.log(`${x} ${y}`);

            if (targetSquare.current && x >= 0 && x < 8 && y >= 0 && y < 8) {
                // setPos({ x, y });
                pos.current = { x, y };
                targetSquare.current?.style.setProperty("transform", `translate(${Math.floor(pos.current.x)}00%, ${Math.floor(pos.current.y)}00%)`);
            }
        }
    };

    return (
        <div className="chess_board" style={{
            position: "relative",
        }}
        ref={ref}

        onMouseDown={mouseDownHandler}
        onTouchStart={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onTouchEnd={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        onTouchMove={mouseMoveHandler}

        >
            {(() => {
                const squares: ReactNode[] = [];
                for (let i = 0; i < 8; i++) {
                    for (let j = 0; j < 8; j++) {
                        let color = i % 2 == j % 2 ? ChessSquareColor.WHITE : ChessSquareColor.BLACK;
                        const gamePos = screenPosToGamePos(new Vector2(j, i), playingAsWhite);
                        const gamePosString = String.fromCharCode("a".charCodeAt(0) + gamePos.x - 1) + gamePos.y.toString();
                        squares.push(<ChessSquare color={color} key={i * 10 + j} position={{ x: j, y: i }} /*setCurrentPos={(pos_: Vector2) => {
                            pos.current = pos_;
                        }}*/ gamePos={gamePosString} />);
                    }
                }
                return squares;
            })()}

            {(() => {
                return <div className="target_square" ref={targetSquare} style={{
                    transform: `translate(${Math.floor(pos.current.x)}00%, ${Math.floor(pos.current.y)}00%)`,
                    visibility: "hidden",
                }} />;
            })()}

            <ChessPieceContext.Provider value={{
                getCurrentPos: () => pos.current,
                getBoundingClientRect: () => ref.current?.getBoundingClientRect() as DOMRect,
                playingAsWhite,
                requestMove,
            }}>
                {Object.values(game).map(v => {
                    return v.elem;
                })}
            </ChessPieceContext.Provider>
        </div>
    );
}