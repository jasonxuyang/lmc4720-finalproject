import { chooseRandomNumber, getVisitedCount } from "@/helpers";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import { Flag, Location, PassageNode, Person, Weather } from "@/types";
import { useRecoilValue } from "recoil";

export default function useMainHall(): PassageNode | undefined {
  const location = useRecoilValue(locationState);
  const journal = useRecoilValue(journalState);
  if (!location) return undefined;
  const timesVisited = getVisitedCount(journal, location);
  const isFirstTime = timesVisited === 0;

  let person: Person;
  const die = chooseRandomNumber();
  if (die < 33) person = Person.Janitor;
  else if (die > 66) person = Person.Ryder;
  else person = Person.Parker;

  const janitorFlag =
    person === Person.Janitor &&
    !journal.some(
      (entry) =>
        (entry.flag === Flag.SaidYesToJanitor ||
          entry.flag === Flag.SaidNoToJanitor) &&
        entry.location === Location.MainHall
    );

  const ryderFlag =
    person === Person.Ryder &&
    !journal.some(
      (entry) =>
        entry.flag === Flag.MetRyder && entry.location === Location.MainHall
    );

  const parkerFlag =
    person === Person.Parker &&
    !journal.some(
      (entry) =>
        entry.flag === Flag.SeenGhost && entry.location === Location.MainHall
    );

  const generateChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    if (person === Person.Parker) return children;
    if (janitorFlag && !isFirstTime) {
      return [
        {
          label: "Yes, I do actually...",
          person,
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
          person,
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
    return [];
  };

  const generateInitialPassage = (): PassageNode => {
    let flag;
    let effect;
    let content = (
      <>
        <p>
          You take your camera with you as you wander around the halls,
          capturing some b-reel of the school architecture and interior. You
          walk around but you don’t run into anyone and don’t find anything
          interesting to film.
        </p>
        <p>
          As you leave school for the day, you hope that you can film more
          interesting things tomorrow.
        </p>
      </>
    );

    if (isFirstTime)
      content = (
        <>
          <p>You set up your camera in the school’s main hallway.</p>
          <p>
            After you finish setting up your camera, you begin to wander around
            the hallways. While walking around, you start to feel kind of bored.
            You pass by a janitor quietly sweeping the floors, a student rushing
            to class… probably late.
          </p>
          <p>
            When you get back you see your camera knocked over. Thankfully
            nothing is damaged, but you’re a bit annoyed and try to find out who
            knocked it over by reviewing the footage. Looking through it seems
            no one was caught on tape.
          </p>
          <p>On the way back, you wonder if it might have been the ghost…</p>
        </>
      );
    else if (janitorFlag) {
      content = (
        <>
          <p>
            You take your camera with you as you wander around the halls,
            capturing some b-reel of the school architecture and interior.
          </p>
          <p>You see the janitor again and you decide to go say hi.</p>
          <p>
            As you approach him, he starts staring you directly in the eyes. You
            start having second thoughts but he starts walking quickly to you
            and asks “Do you believe in ghosts?”
          </p>
        </>
      );
    } else if (ryderFlag) {
      flag = Flag.MetRyder;
      effect = 1;
      content = (
        <>
          <p>
            You take your camera with you as you wander around the halls,
            capturing some b-reel of the school architecture and interior.
          </p>
          <p>
            As you wander around, you see the same student in the hallway as
            last time. He seems to be in a rush again. You watch him run and as
            he’s about to pass you he suddenly changes direction and runs into
            you.
          </p>
          <p>“Ooof..” you exhale as you take the blow. “Are you okay kid?”</p>
          <p>
            “I am so sorry” he says as he starts apologizing, but he suddenly
            turns towards the side with an annoyed look and then quickly looks
            back up with apologetic eyes.
          </p>
          <p>“What did you just look at?” you ask him.</p>
          <p>
            “Ohh.. nothing, it’s… it’s nothing” he stutters out as he quickly
            shuffles away.”
          </p>
        </>
      );
    } else if (parkerFlag) {
      flag = Flag.SeenGhost;
      content = (
        <>
          <p>As you wander around the halls you feel a tap on your shoulder.</p>
          <p>You look around but don’t see anything and keep walking.</p>
          <p>
            You walk a few more paces and you feel another tap. You quickly turn
            around but don’t see anything. Confused, you slowly turn back toward
            the direction you were facing.
          </p>
          <p>“BOO” you hear whispered in your ear.</p>
          <p>
            You jump back a little and you feel your legs give out under you as
            you fall to the ground.
          </p>
          <p>
            You hear the faint sound of laughing echo through the hallway as you
            get up.
          </p>
        </>
      );
    }
    return { content, person, children: generateChildren(), flag, effect };
  };

  return generateInitialPassage();
}
