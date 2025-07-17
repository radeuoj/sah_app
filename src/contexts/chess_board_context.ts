import { createContext, useContext } from "react";
import type { Vector2 } from "../Vector";

export interface ChessBoardContextData {
    screenPosToGamePos: (pos: Vector2) => Vector2,
    gamePosToScreenPos: (pos: Vector2) => Vector2,
    getBoundingClientRect: () => DOMRect,
    playingAsWhite: boolean,
    allowTargetSquare: (allow: boolean) => void,
    playMoveSound(): void;
    playCaptureSound(): void;
}

export const ChessBoardContext = createContext<ChessBoardContextData | undefined>(undefined);

export function useChessBoardContext(): ChessBoardContextData {
    const chessBoardContext = useContext(ChessBoardContext);

    if (chessBoardContext == undefined) {
        throw new Error("ChessBoardContext is undefined!!!!");
    }

    return chessBoardContext;
}