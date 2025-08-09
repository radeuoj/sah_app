import type { Game } from "../game";
import type { Move } from "../move";
import type { Bot } from "./bot";

export class RandomBot implements Bot {
  public getMove(game: Game): Move {
    const moves = game.getMoves();
    return moves[Math.floor(Math.random() * moves.length)];
  }
}