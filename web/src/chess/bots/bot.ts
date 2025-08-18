import type { Game } from "../game";
import type { Move } from "../move";
import { RandomBot } from "./random";

export interface Bot {
  getMove(game: Game): Move;
}

const bots = [
  {
    name: "random",
    bot: RandomBot,
  }
]

export function getBot(name: string): Bot {
  const bot = bots.find(b => b.name == name);
  if (bot == undefined) {
    throw new Error(`${name} doesn't exist!`);
  }
  return new bot.bot();
}