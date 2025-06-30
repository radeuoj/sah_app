import React from "react";
import { ChessGame } from "../../ChessGame";
import ChessBoard from "../../components/ChessBoard";
import "./GamePage.css";

export default function GamePage() {
    const game = React.useRef(new ChessGame());

    return (
        <main>
            <ChessBoard game={game.current} />
        </main>
    );
}