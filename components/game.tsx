import dayState from "@/recoil/dayState";
import flagsState from "@/recoil/flagsState";
import gameStateState from "@/recoil/gameStateState";
import { GameState } from "@/types";
import { useRecoilValue } from "recoil";
import Journal from "./journal";
import LocationPicker from "./locationPicker";
import LocationWrapper from "./locationWrapper";

export default function Game() {
  const gameState = useRecoilValue(gameStateState);
  const day = useRecoilValue(dayState);

  if (gameState !== GameState.Game) return null;
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <LocationPicker />
      <Journal />
      <LocationWrapper />
    </div>
  );
}
