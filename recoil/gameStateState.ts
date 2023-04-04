import { GameState } from "@/types";
import { atom } from "recoil";

const gameStateState = atom<GameState>({
  key: "gameState",
  default: GameState.Start,
});

export default gameStateState;
