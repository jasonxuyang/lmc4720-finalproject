import { checkFlag, getVisitedCount } from "@/helpers";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import weatherState from "@/recoil/weatherState";
import { Flag, Location, PassageNode, Person, Weather } from "@/types";
import { useRecoilValue } from "recoil";

export default function useClassroom(): PassageNode | undefined {
  const location = useRecoilValue(locationState);
  const journal = useRecoilValue(journalState);
  const weather = useRecoilValue(weatherState);
  const flags = useRecoilValue(flagsState);
  if (!location) return undefined;
  const timesVisited = getVisitedCount(journal, location);
  const isFirstTime = timesVisited === 0;
  const isRaining = weather === Weather.Raining;

  const hasMetRyder = journal.some(
    (entry) =>
      entry.flag === Flag.MetRyder && entry.location === Location.MainHall
  );

  const generateChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    if (isRaining) return [];
    children.push({
      label: "Nothing interesting...",
      person: Person.Riley,
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
        person: Person.Riley,
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
    if (hasMetRyder)
      children.push({
        label: "Can I ask you about Ryder?",
        person: Person.Riley,
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
    let flag;
    let person = Person.Riley;
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

    if (isRaining) {
      flag = Flag.SeenGhost;
      person = Person.Parker;
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
            as you start to laugh.
          </p>
        </>
      );
    }

    return { content, person, children: generateChildren(), flag };
  };

  return generateInitialPassage();
}
