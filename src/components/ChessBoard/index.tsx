'use client';

import "./style.css";
import ChessSquare, { ChessSquareColor } from "../ChessSquare";
import ChessPiece, { ChessPieceColors, ChessPieces, ChessPieceData } from "../ChessPiece";
import React, { ReactNode, useRef } from "react";
import { Vector2 } from "../Vector";

export default function ChessBoard() {
    // const [pos, setPos] = React.useState<Position>({ x: 0, y: 0 });
    const pos = useRef<Vector2>({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement | null>(null);
    const targetSquare = useRef<HTMLDivElement | null>(null);
    const mouseDown = React.useRef(false);

    function getStartingPosition(): ChessPieceData[] {
        const result: ChessPieceData[] = [];

        // KINGS
        result.push({
            piece: ChessPieces.KING,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.KING} color={ChessPieceColors.WHITE} key="wk" startPos={{ x: 4, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.KING,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.KING} color={ChessPieceColors.BLACK} key="bk" startPos={{ x: 4, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        });

        // QUEENS
        result.push({
            piece: ChessPieces.QUEEN,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.QUEEN} color={ChessPieceColors.WHITE} key="wq" startPos={{ x: 3, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.QUEEN,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.QUEEN} color={ChessPieceColors.BLACK} key="bq" startPos={{ x: 3, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        });

        // BISHOPS
        result.push({
            piece: ChessPieces.BISHOP,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.BISHOP} color={ChessPieceColors.WHITE} key="wb1" startPos={{ x: 2, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.BISHOP,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.BISHOP} color={ChessPieceColors.WHITE} key="wb2" startPos={{ x: 5, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.BISHOP,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.BISHOP} color={ChessPieceColors.BLACK} key="bb1" startPos={{ x: 2, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.BISHOP,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.BISHOP} color={ChessPieceColors.BLACK} key="bb2" startPos={{ x: 5, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        });

        // KNIGHTS
        result.push({
            piece: ChessPieces.KNIGHT,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.KNIGHT} color={ChessPieceColors.WHITE} key="wn1" startPos={{ x: 1, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.KNIGHT,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.KNIGHT} color={ChessPieceColors.WHITE} key="wn2" startPos={{ x: 6, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.KNIGHT,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.KNIGHT} color={ChessPieceColors.BLACK} key="bn1" startPos={{ x: 1, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.KNIGHT,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.KNIGHT} color={ChessPieceColors.BLACK} key="bn2" startPos={{ x: 6, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        });

        // ROOKS
        result.push({
            piece: ChessPieces.ROOK,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.ROOK} color={ChessPieceColors.WHITE} key="wr1" startPos={{ x: 0, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.ROOK,
            color: ChessPieceColors.WHITE,
            elem: <ChessPiece piece={ChessPieces.ROOK} color={ChessPieceColors.WHITE} key="wr2" startPos={{ x: 7, y: 7 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.ROOK,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.ROOK} color={ChessPieceColors.BLACK} key="br1" startPos={{ x: 0, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        },
        {
            piece: ChessPieces.ROOK,
            color: ChessPieceColors.BLACK,
            elem: <ChessPiece piece={ChessPieces.ROOK} color={ChessPieceColors.BLACK} key="br2" startPos={{ x: 7, y: 0 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
        });

        // PAWNS
        for (let i = 0; i < 8; i++)  {
            result.push({
                piece: ChessPieces.PAWN,
                color: ChessPieceColors.WHITE,
                elem: <ChessPiece piece={ChessPieces.PAWN} color={ChessPieceColors.WHITE} key={`wp${i + 1}`} startPos={{ x: i, y: 6 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
            },
            {
                piece: ChessPieces.PAWN,
                color: ChessPieceColors.BLACK,
                elem: <ChessPiece piece={ChessPieces.PAWN} color={ChessPieceColors.BLACK} key={`bp${i + 1}`} startPos={{ x: i, y: 1 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} />,
            });
        }

        return result;
    }

    const game = useRef<ChessPieceData[]>(getStartingPosition());
    
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
                for (let i = 1; i <= 8; i++) {
                    for (let j = 1; j <= 8; j++) {
                        let color = i % 2 == j % 2 ? ChessSquareColor.WHITE : ChessSquareColor.BLACK;
                        squares.push(<ChessSquare color={color} key={i * 10 + j} position={{ x: j, y: i }} setCurrentPos={(pos_: Vector2) => {
                            pos.current = pos_;
                        }} />);
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

            {/* <ChessPiece piece={ChessPieces.PAWN} color={ChessPieceColors.BLACK} startPos={{ x: 1, y: 1 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => {
                return ref.current?.getBoundingClientRect() as DOMRect;
            }} />

            <ChessPiece piece={ChessPieces.ROOK} color={ChessPieceColors.WHITE} startPos={{ x: 2, y: 1 }} getCurrentPos={() => pos.current} getBoundingClientRect={() => ref.current?.getBoundingClientRect() as DOMRect} /> */}

            {/* {Object.keys(game.current).map((v, i) => {
                return game.current[v].elem;
            })} */}

            {Object.values(game.current).map(v => {
                return v.elem;
            })}
        </div>
    );
}