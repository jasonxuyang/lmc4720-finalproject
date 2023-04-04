import {
  checkFlag,
  generateRandomWeather,
  getNextDay,
  getVisitedCount,
} from "@/helpers";
import dayState from "@/recoil/dayState";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import peopleState from "@/recoil/peopleState";
import weatherState from "@/recoil/weatherState";
import { Flag, PassageNode, Weather } from "@/types";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Classroom() {
  const [location, setLocation] = useRecoilState(locationState);
  const [day, setDay] = useRecoilState(dayState);
  const [journal, setJournal] = useRecoilState(journalState);
  const [weather, setWeather] = useRecoilState(weatherState);
  const [flags, setFlags] = useRecoilState(flagsState);
  const [passage, setPassage] = useState<PassageNode | undefined>(undefined);

  useEffect(() => {
    setPassage(generateInitialPassage);
  }, []);

  if (!location) return null;
  const timesVisited = getVisitedCount(journal, location);
  const isFirstTime = timesVisited === 0;
  const isRaining = weather === Weather.Raining;

  const generateChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    if (isRaining) return [];
    children.push({
      label: "Yeah... nothing interesting yet...",
      content: (
        <>
          <p>
            “What did you think was going to happen?” he says as he laughs out
            loud.
          </p>
          <p>
            In your head, doubts start to creep in. “Why am I chasing a ghost
            rumor…” you start thinking to yourself as you pack up your things.
          </p>
        </>
      ),
    });
    if (!checkFlag(flags, Flag.TalkedAboutGhostWithRiley))
      children.push({
        label: "Have you heard anything about a ghost?",
        content: (
          <>
            <p>
              His eyes dart towards you and he sharply says “There’s no ghosts
              here. They aren’t real.”
            </p>
            <p>
              Taken aback a bit by your old professor’s response, you don’t
              follow up with any of the questions that bubble up suddenly in
              your brain.
            </p>
            <p>
              As you pack your things up, you wonder why Professor Riley acted
              the way he did. “Maybe there is really a ghost… I wonder where I
              could find it...” you begin to wonder to yourself as you begin to
              head home.
            </p>
          </>
        ),
        effect: -1,
        flag: Flag.TalkedAboutGhostWithRiley,
      });
    if (
      !checkFlag(flags, Flag.TalkedAboutRyderWithRiley) &&
      checkFlag(flags, Flag.MetRyder)
    )
      children.push({
        label: "Can I ask you about Ryder?",
        content: (
          <>
            <p>
              “Why are you asking about one of my students?” he sharply asks. As
              you try to fumble for an answer he continues “I think we should
              all respect our student’s privacy while you are filming here.
              Shouldn’t we?”
            </p>
            <p>
              You nod your head quickly in agreement and apologize. On your way
              home, you wonder why Professor Riley was so protective over Ryder.
            </p>
          </>
        ),
        effect: -1,
        flag: Flag.TalkedAboutRyderWithRiley,
      });
    return children;
  };

  const generateInitialPassage = (): PassageNode => {
    let content = (
      <>
        <p>
          You enter the class and get set up in the same spot as last time. You
          grab some more boring footage while Professor Riley is lecturing.
          After the lecture ends, professor Riley walks over to you.
        </p>
        <p>
          “So, how is the filming going? High school’s not too interesting is
          it?” he jokes as he pats you on the back.
        </p>
      </>
    );

    if (isFirstTime)
      content = (
        <>
          <p>
            You enter Professor Riley’s classroom as his first class is
            finishing up. You stand quietly in the back and reminisce about back
            when you used to be in this classroom. “Nothing has changed at all…”
            you warmly think to yourself.
          </p>
          <p>
            After Professor Riley dismisses class he comes over and chats with
            you a bit as you set up your camera. After a short while, he returns
            to the front to start lecturing his second group of students.
          </p>
          <p>
            As you roll your camera, you capture footage of a few students
            eagerly answering questions, and of course a few students sleeping
            in the back. You capture b-roll footage, but nothing very
            interesting.
          </p>
          <p>
            As Professor Riley finishes up his lecture, and then lets you know
            that he’s heading to lunch. You pack up your things hoping that
            tomorrow will be more interesting.
          </p>
        </>
      );

    if (isRaining)
      content = (
        <>
          <p>
            As you enter the class you don’t see anyone there. “Oh right,
            Professor Riley had mentioned he had lunch around this time…” you
            think to yourself.
          </p>
          <p>
            As you turn to leave, you hear the sound of a desk being pushed. You
            quickly turn around looking for the source of the sound but see
            nothing moving.
          </p>
          <p>
            You turn back toward the door confused and then you feel something
            hit your head. As you snap around again you feel a gust of wind
            whoosh by you and the faint sound of laughter.
          </p>
          <p>
            As you rub your head confused and in pain you see an expo marker
            lying on the ground. “Maybe it was a ghost…” you think to yourself
            as you start to grin.
          </p>
        </>
      );

    return { content, children: generateChildren() };
  };

  if (!passage) return null;

  return (
    <div className="w-8/12 p-12">
      <h2>
        {location}: visited {timesVisited} times
      </h2>
      <div className="mt-8 flex flex-col gap-y-2">{passage?.content}</div>
      <div className="mt-8">
        {passage?.children?.map((child) => {
          return (
            <div
              key={child.label}
              onClick={() => {
                setPassage(child);
                if (child.flag) setFlags([...flags, child.flag]);
              }}
              className="mt-1 cursor-pointer underline hover:text-gray-300"
            >
              {child.label}
            </div>
          );
        })}
      </div>
      {!passage?.children?.length && (
        <div
          className="mt-4 w-fit cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
          onClick={() => {
            setLocation(undefined);
            setDay(getNextDay(day));
            setJournal([...journal, { day, location }]);
            setWeather(generateRandomWeather());
            console.log(weather);
          }}
        >
          Next
        </div>
      )}
    </div>
  );
}
