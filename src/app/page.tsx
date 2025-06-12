'use client';

import "./globals.css";
import "./style.css";
import ChessBoard from "@/components/ChessBoard"
import React from "react";

export default function Home() {
    const [playingAsWhite, setPlayingAsWhite] = React.useState(true);

    return ( 
    <>
        <main>
            <button style={{
                position: "absolute",
                left: "10%",
                top: "10%",
            }}
            onClick={() => setPlayingAsWhite(w => !w)}
            >Playing as {playingAsWhite ? "white" : "black"}</button>
            <ChessBoard playingAsWhite={playingAsWhite}></ChessBoard>
        </main>
    </>
    );
}
