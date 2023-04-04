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
  if (die < 30) person = Person.Janitor;
  else if (die > 70) person = Person.Ryder;
  else person = Person.Parker;

  const janitorFlag =
    person === Person.Janitor &&
    !journal.some(
      (entry) =>
        entry.flag === Flag.MetJanitor && entry.location === Location.MainHall
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
    if (janitorFlag) {
      return [
        {
          label: "Yes, I do actually...",
          person,
          effect: 1,
          flag: Flag.MetJanitor,
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
                You reply with a strong affirmation and quickly walk away. “What
                an interesting fellow…” you think to yourself as you put away
                your camera.
              </p>
            </>
          ),
        },
        {
          label: "No thank you, I don’t as you quickly walk away",
          person,
          flag: Flag.MetJanitor,
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
          <p>
            You set up your camera in the school’s main hallway. You notice that
            it looks a lot smaller than it used to.
          </p>
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

    if (janitorFlag) {
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
    }

    if (ryderFlag) {
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
            he’s about to past you he suddenly changes direction and runs into
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
            “Ohh.. nothing, it’s… it’s nothing” he stutters out. He looks closer
            at you. “Oh, aren’t you that filmmaker making a documentary about
            our school? Professor Riley told us about you.”
          </p>
          <p>
            You tell him about how you used to be a student here, and how you
            actually used to be in Professor Riley’s class too.
          </p>
          <p>
            “Professor Riley’s chill” he responds, “My name’s Ryder, and you
            seem pretty chill too”. He gives you a fist bump and then just walks
            away.
          </p>
          <p>
            As you watch him walk away, you start thinking kids are weird these
            days…
          </p>
        </>
      );
    }

    // todo
    if (parkerFlag) {
      //   flag = Flag.SeenGhost;
      //   content = (
      //     <>
      //     </>
      //   );
    }
    return { content, person, children: generateChildren(), flag, effect };
  };

  return generateInitialPassage();
}
