import gameStateState from "@/recoil/gameStateState";
import { GameState } from "@/types";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export default function Start() {
  const [gameState, setGameState] = useRecoilState(gameStateState);
  if (gameState !== GameState.Start) return null;
  return (
    <div className="flex w-full items-center justify-center p-12">
      <div className="w-8/12">
        <h2 className="mb-2">Haunted High: Filmmaker</h2>
        <p>
          You are a filmmaker in the early part of your career. You hear about
          strange ghost rumors going on at your old high school, which piques
          your interest.
        </p>
        <p>
          You reach out to your old high school science teacher Professor Riley,
          and ask if you could film a documentary about high school life.
        </p>
        <p>
          He lets you know that homecoming is coming up, and invites you to film
          his class the week leading up to homecoming.
        </p>
        <p>
          You gladly accept and begin getting ready to head back to your old
          high school.
        </p>
        <div
          className="mt-4 w-fit cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
          onClick={() => {
            setGameState(GameState.Game);
          }}
        >
          Start
        </div>
      </div>
    </div>
  );
}
