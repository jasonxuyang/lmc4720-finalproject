import { checkFlag, getInteractionCount } from "@/helpers";
import { getVisitedCount } from "@/helpers";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import weatherState from "@/recoil/weatherState";
import { Flag, PassageNode, Person, Weather } from "@/types";
import { useRecoilValue } from "recoil";

export default function useGym(): PassageNode | undefined {
  const location = useRecoilValue(locationState);
  const journal = useRecoilValue(journalState);
  const weather = useRecoilValue(weatherState);
  const flags = useRecoilValue(flagsState);
  if (!location) return undefined;
  const isRaining = weather === Weather.Raining;

  const janitorInteractionCount = getInteractionCount(journal, Person.Janitor);
  const metRyder = checkFlag(flags, Flag.MetRyder);
  const ryderFlag = checkFlag(flags, Flag.SawRyderInGym);
  const janitorNoFlag = checkFlag(flags, Flag.SaidNoToJanitor);

  console.log(janitorInteractionCount, journal);

  const generateChildren = (): PassageNode[] => {
    if (janitorNoFlag) return [];
    if (janitorInteractionCount === 0 && !isRaining) {
      return [
        {
          label: "Yes, I do actually...",
          person: Person.Janitor,
          effect: 1,
          flag: Flag.SaidYesToJanitor,
          content: (
            <>
              <p>
                His face lights up. “This high school is haunted by a ghost,
                I’ve seen it, and I’ve been trying to get rid of it.” He
                recounts the many messes and events that have transpired over
                the years.
              </p>
              <p>
                As you listen to his story, you start to get the feeling that he
                is a little bit crazy, but you let him finish anyways.
              </p>
              <p>
                “If you ever catch any suspicious looking things on that camera
                of yours, you let me know you hear” he says with a stern look on
                his face.
              </p>
              <p>
                You reply with a strong affirmation and quickly walk away. You
                can’t help but feel excited as you put away your camera.
              </p>
            </>
          ),
        },
        {
          label: "No thank you, I don’t as you quickly walk away",
          person: Person.Janitor,
          flag: Flag.SaidNoToJanitor,
          effect: -1,
          content: (
            <>
              <p>
                You feel the janitor’s eyes on the back of your head until you
                walk out of his line of sight.
              </p>
            </>
          ),
        },
      ];
    }
    if (janitorInteractionCount === 2) {
      return [
        {
          label: "I will help you get rid of the ghost.",
          person: Person.Janitor,
          effect: 1,
          flag: Flag.WillHelpJanitor,
          content: (
            <>
              <p>He pats you on the back and tells you the plan.</p>
              <p>
                “Be ready, I will signal to you on Homecoming when I need you.”
              </p>
            </>
          ),
        },
        {
          label: "I can't help you.",
          person: Person.Janitor,
          flag: Flag.WillNotHelpJanitor,
          effect: -1,
          content: (
            <>
              <p>
                The Janitor’s eyes go cold all of a sudden. He takes a few steps
                back, scowls at you, and then starts mopping the floors.
              </p>
            </>
          ),
        },
      ];
    }
    return [];
  };

  const generateInitialPassage = (): PassageNode => {
    let content, flag, person;
    if (isRaining) {
      if (!ryderFlag) {
        person = Person.Ryder;
        flag = Flag.SawRyderInGym;
        content = (
          <>
            <p>
              You come to the gym and see it filled with students. It’s raining
              today so gym class is being held inside.
            </p>
            <p>
              You look for a good spot, and then get set up and start taking
              some b-roll.
            </p>
            <p>
              As you watch the kids play basketball, you see{" "}
              {metRyder ? "Ryder" : "a kid"} playing by himself.
            </p>
            <p>
              “Wow, he’s really good, why is he playing by himself…” you think
              to yourself.
            </p>
            <p>
              You watch closer and you see the ball always seems to take a
              strange trajectory toward the basket, but never misses.
            </p>
            <p>
              You turn your camera toward {metRyder ? "Ryder" : "a kid"} and
              start filming.
            </p>
          </>
        );

        return {
          content,
          person,
          children: generateChildren(),
          flag,
        };
      } else {
        person = Person.Parker;
        content = (
          <>
            <p>
              You come to the gym and see it filled with students. It’s raining
              today so gym class is being held inside.
            </p>
            <p>
              You look for a good spot, and then get set up and start taking
              some b-roll.
            </p>
            <p>
              As you look for {metRyder ? "Ryder" : "the same kid"} you suddenly
              feel a cold gust of wind blow through you.
            </p>
            <p>“Leave Ryder alone…” you hear very softly.</p>
            <p>
              You start feeling a little chilly and decide to pack up early.
            </p>
          </>
        );

        return {
          content,
          person,
          children: generateChildren(),
        };
      }
    } else if (janitorNoFlag) {
      person = Person.Janitor;
      content = (
        <>
          <p>As you enter the gym, you see the janitor mopping the floors.</p>
          <p>
            He looks at you with cold eyes as you set up your camera to capture
            some film on the gym.
          </p>
        </>
      );
      return {
        content,
        person,
        children: generateChildren(),
      };
    } else {
      person = Person.Janitor;
      if (janitorInteractionCount === 0) {
        content = (
          <>
            <p>As you enter the gym, you see the janitor mopping the floors.</p>
            <p>You decide to go say hi</p>
            <p>
              As you approach him, he starts staring you directly in the eyes.
              You start having second thoughts but he starts walking quickly to
              you and asks “Do you believe in ghosts?”
            </p>
          </>
        );

        return {
          content,
          person,
          children: generateChildren(),
        };
      }
      if (janitorInteractionCount === 1) {
        flag = Flag.TalkedAboutRyderWithJanitor;
        content = (
          <>
            <p>
              As you enter the gym, you see the janitor mopping the floors. You
              catch his eye and he janitor excitedly comes up to you.
            </p>
            <p>
              He says, “I’ve finally figured out how to find the ghost. It’s
              always around this kid named Ryder. Everywhere Ryder goes, some
              type of mess follows…”
            </p>
            {metRyder && <p>“I know Ryder…” you think to yourself.</p>}
            <p>
              “One step closer to a peaceful job.” the Janitor he whistles as he
              walks away.
            </p>
            <p>
              As you see him walking away, you think “I wonder what he is going
              to do…{metRyder ? " and I wonder if I should warn Ryder?”" : "”"}
            </p>
          </>
        );
        return {
          flag,
          content,
          person,
          children: generateChildren(),
        };
      }
      if (janitorInteractionCount === 2) {
        content = (
          <>
            <p>
              You walk through the gym doors and you see the Janitor waiting for
              you.
            </p>
            <p>He seems worked up and begins talking quickly.</p>
            <p>
              “Listen, I have a plan. Homecoming is coming up, and I need your
              help. I’m going to corner the ghost and vanquish it.”
            </p>
          </>
        );
      }
      return {
        flag,
        content,
        person,
        children: generateChildren(),
      };
    }
  };

  return generateInitialPassage();
}
