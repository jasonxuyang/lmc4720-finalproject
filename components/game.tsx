import dayState from "@/recoil/dayState";
import flagsState from "@/recoil/flagsState";
import gameStateState from "@/recoil/gameStateState";
import { Day, Flag, GameState } from "@/types";
import { useRecoilValue } from "recoil";
import Journal from "./journal";
import LocationPicker from "./locationPicker";
import LocationWrapper from "./locationWrapper";
import { checkFlag } from "@/helpers";

export default function Game() {
  const gameState = useRecoilValue(gameStateState);
  const flags = useRecoilValue(flagsState);
  console.log(flags);
  const isGoodEnding = checkFlag(flags, Flag.GoodEnding);
  const isImpartialEnding = checkFlag(flags, Flag.ImpartialEnding);
  const isBadEnding = checkFlag(flags, Flag.BadEnding);
  const isEnd = isGoodEnding || isBadEnding || isImpartialEnding;

  const renderEndingPassage = () => {
    if (isGoodEnding)
      return (
        <>
          <p>
            The next day you return back to work. Looking at your broken camera,
            you find that there was no way to fix it.
          </p>
          <p>
            Your boss yells at you, asking if he should even pay you, but you
            don’t listen to him.
          </p>
          <p>
            Unfortunately, you weren’t able to create a cool documentary about
            ghosts, but you at least got to meet one in real life.
          </p>
        </>
      );
    if (isBadEnding)
      return (
        <>
          <p>
            The aftermath of the incident is terrible. As you return back to
            work the next day, you read stories about a fire that burned down
            the gym at your high school and a kid went missing.
          </p>
          <p>
            As you thumb through the footage you captured, you regret your
            actions and decisions.
          </p>
        </>
      );
    if (isImpartialEnding)
      return (
        <>
          <p>
            You go back to work the next day and show your boss the footage you
            captured.
          </p>
          <p>
            He’s amazed, and asks that you get started on editing right away.
          </p>
          <p>
            “This is going to be big…” you think to yourself as you sit down at
            your desk.
          </p>
        </>
      );
  };

  if (gameState !== GameState.Game) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center">
      {!isEnd && <LocationPicker />}
      {!isEnd && <Journal />}
      {!isEnd && <LocationWrapper />}
      {isEnd && (
        <div className="w-8/12 p-12">
          <div className="mt-8 flex flex-col gap-y-2">
            {renderEndingPassage()}
          </div>

          <div
            onClick={() => {
              window.location.reload();
            }}
            className="mt-4 w-fit cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
          >
            Reset game
          </div>
        </div>
      )}
    </div>
  );
}
