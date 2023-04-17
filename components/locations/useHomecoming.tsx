import { checkFlag, getVisitedCount } from "@/helpers";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import weatherState from "@/recoil/weatherState";
import { Flag, Location, PassageNode, Person, Weather } from "@/types";
import { useRecoilValue } from "recoil";

export default function useHomecoming(): PassageNode | undefined {
  const journal = useRecoilValue(journalState);
  const flags = useRecoilValue(flagsState);

  const metRyder = checkFlag(flags, Flag.TalkedAboutGhostWithRyder);
  const metJanitor = checkFlag(flags, Flag.SaidYesToJanitor);
  const willHelpJanitor = checkFlag(flags, Flag.WillHelpJanitor);
  const willNotHelpJanitor = checkFlag(flags, Flag.WillNotHelpJanitor);
  const willHelpRyder = checkFlag(flags, Flag.WillHelpRyder);
  const willNotHelpRyder = checkFlag(flags, Flag.WillNotHelpRyder);
  const kid = metRyder ? "Ryder" : "the kid";

  const generateInitialChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    children.push({
      label: "Talk with Professor Riley",
      content: (
        <>
          <p>
            As you approach Professor Riley, you notice he seems to be deep in
            thought.
          </p>
          <p>“What’s wrong” you ask him as he seems to snap back to reality.</p>
          <p>
            “Oh no… just thinking about something that happened a looong time
            ago at homecoming back when I was a student… I hope nothing like
            that happens here…”
          </p>
          <p>As you are about to ask him what happened, you hear {kid} yell.</p>
        </>
      ),
      children: generateSecondaryChildren(Person.Riley),
    });
    if (metRyder)
      children.push({
        label: "Talk with Ryder",
        content: (
          <>
            <p>You grab a drink and stand next to Ryder.</p>
            <p>“How are you enjoying homecoming?” you ask him?</p>
            <p>
              He looks at you with nervous eyes and says “I’m not sure why but I
              feel like something bad will happen…”
            </p>
            <p>
              As you go to try to reassure him all of a sudden he starts bolting
              to the exit.
            </p>
          </>
        ),
        children: generateSecondaryChildren(Person.Ryder),
      });
    if (metJanitor)
      children.push({
        label: "Talk with the Janitor",
        content: (
          <>
            <p>
              As you approach the Janitor he starts “Tonight is the night that
              we finally get rid of that nuisance.”
            </p>
            <p>
              As you look at his face, he seems more dark and eerie than usual.
            </p>
            <p>
              Your eyes linger on him for a bit as he walks out of sight toward
              the cleaning supplies closet.
            </p>
            <p>A few moments later, you hear {kid} yell.</p>
          </>
        ),
        children: generateSecondaryChildren(Person.Janitor),
      });

    return children;
  };

  const generateSecondaryChildren = (person: Person): PassageNode[] => {
    const children: PassageNode[] = [];
    if (person === Person.Riley || person == Person.Janitor) {
      children.push({
        label: "Next",
        content: (
          <>
            <p>
              You chase towards the sound of Ryder’s voice as it echoes through
              the hall.
            </p>
            <p>
              You can hear the sound of the janitor’s laughs echo through the
              hallway.
            </p>
            <p>You find yourself at a crossroads. Where do you go?</p>
          </>
        ),
        children: generateTertiaryChildren(),
      });
    } else
      children.push({
        label: "Next",
        content: (
          <>
            <p>You quickly follow behind Ryder.</p>
            <p>“Where are you going?” you yell as you try to keep up.</p>
            <p>“The Janitor… the janitor is coming!” he yells.</p>
            <p>You look back and you don’t see anyone.</p>
            <p>
              “What Janitor…?” but as you look forward again, you have lost
              sight of him.
            </p>
            <p>
              You hear the sound of Ryder’s screams as it echoes through the
              hall.
            </p>
            <p>
              You can hear the sound of the janitor’s laughs echo through the
              hallway.
            </p>
            <p>You find yourself at a crossroads. Where do you go?</p>
          </>
        ),
        children: generateTertiaryChildren(),
      });

    return children;
  };

  const generateTertiaryChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    children.push({
      label: "Search the gym",
      content: (
        <>
          <p>
            You enter the gym and you find Ryder backed up against the wall.
          </p>
          <p>
            You see the Janitor doing something strange with his hands. Almost
            as if he was casting a spell.
          </p>
          {(!willNotHelpRyder || !metRyder) && (
            <p>{kid} sees you and he yells for your help!</p>
          )}
          {(!willNotHelpJanitor || metJanitor) && (
            <p>
              The Janitor sees you and with a smile says “I’m finally going to
              get rid of this ghost and be at peace at last. Come help me hold
              him down so I can finish casting this spell”
            </p>
          )}
        </>
      ),
      children: generateFourthChildren(),
    });
    children.push({
      label: "Search the library",
      content: (
        <>
          <p>You look in the library, but you find no one there.</p>
          <p>
            You continue to hear the sound of laughing. The screams get louder.
          </p>
          <p>Where do you search next?</p>
        </>
      ),
      children: [...generateOtherLocations([Location.Library])],
    });
    children.push({
      label: "Search the classroom",
      content: (
        <>
          <p>You look in the classroom, but you find no one there.</p>
          <p>
            You continue to hear the sound of laughing. The screams get louder.
          </p>
          <p>Where do you search next?</p>
        </>
      ),
      children: [...generateOtherLocations([Location.Library])],
    });
    return children;
  };

  const generateFourthChildren = (): PassageNode[] => {
    const children: PassageNode[] = [];
    if (!willHelpJanitor)
      children.push({
        label: "Tackle the Janitor",
        content: (
          <>
            <p>You tackle the janitor before he finishes casting his spell.</p>
            <p>He begins chanting while getting up off the floor.</p>
            <p>
              You take your camera and you smack him across the head with it,
              breaking your camera in the process.
            </p>
          </>
        ),
        children: generateFifthChildren(Flag.GoodEnding),
      });
    if (!willHelpRyder)
      children.push({
        label: `Hold down ${kid}`,
        content: (
          <>
            <p>
              You hold down Ryder while the Janitor finishes casting his spell.
            </p>
            <p>
              You can hear the Janitor chanting in an eerie language from
              behind.
            </p>
            <p>
              All of a sudden, feel a giant wave of fear wash over your body.
            </p>
          </>
        ),
        children: generateFifthChildren(Flag.BadEnding),
      });
    children.push({
      label: "Take out your camera and film",
      content: (
        <>
          <p>You take out your camera and begin filming.</p>
          <p>
            The boy is starting to cry now, as a mysterious force holds him
            against the wall.
          </p>
          <p>
            The watch through your lens as the janitor whips his hands in scary
            motions.
          </p>
        </>
      ),
      children: generateFifthChildren(Flag.ImpartialEnding),
    });
    return children;
  };

  const generateFifthChildren = (flag: Flag): PassageNode[] => {
    const children: PassageNode[] = [];
    if (flag === Flag.GoodEnding)
      children.push({
        label: "Next",
        content: (
          <>
            <p>
              All of a sudden a great gust of wind fills the entire gymnasium.
            </p>
            <p>
              As you look up, you can see the faint outline of a teenager as the
              moon shines through ceiling windows.
            </p>
            <p>
              The teenager gives you a bright nod and wink as he fills the gym
              with another large gust of wind, forcing you to close your eyes
              this time.
            </p>
            <p>
              When you reopen them you find yourself in an empty gym, Ryder and
              the Janitor nowhere to be seen.
            </p>
          </>
        ),
        flag: Flag.GoodEnding,
      });
    if (flag === Flag.BadEnding)
      children.push({
        label: "Next",
        content: (
          <>
            <p>The Janitor suddenly yells at you to move.</p>
            <p>
              You quickly dash to the side as you feel a great heat emanate from
              above.
            </p>
            <p>You look up and see what looks like a giant fireball forming.</p>
            <p>
              Not thinking about anything, you quickly run out as the fireball
              crashes down onto the gym.
            </p>
          </>
        ),
        flag: Flag.BadEnding,
      });
    if (flag === Flag.ImpartialEnding)
      children.push({
        label: "Next",
        content: (
          <>
            <p>
              All of a sudden, you see what looks like a giant fireball form in
              the middle of the gym.
            </p>
            <p>
              You see the Janitor yell something as he throws the fireball down
              from the sky.
            </p>
            <p>
              Frozen in shock, you can only watch and film as the fireball
              slowly descends onto the gym.
            </p>
            <p>
              At the last second, you see, what looks to be an astral figure of
              a teenager engulf the majority of the flames, and slowly shimmer
              into thin air.
            </p>
            <p>
              As the hardwood begins to burn, you close your camera and run
              outside.
            </p>
          </>
        ),
        flag: Flag.ImpartialEnding,
      });
    return children;
  };

  const generateOtherLocations = (location: Location[]): PassageNode[] => {
    const children: PassageNode[] = [];
    if (location.length > 1) {
      children.push({
        label: "Search the gym",
        content: (
          <>
            <p>
              You enter the gym and you find Ryder backed up against the wall.
            </p>
            <p>
              You see the Janitor doing something strange with his hands. Almost
              as if he was casting a spell.
            </p>
            {!willNotHelpRyder && (
              <p>{kid} sees you and he yells for your help!</p>
            )}
            {!willNotHelpJanitor && (
              <p>
                The Janitor sees you and with a smile says “I’m finally going to
                get rid of this ghost and be at peace at last. Come help me hold
                him down so I can finish casting this spell”
              </p>
            )}
          </>
        ),
        children: generateFourthChildren(),
      });
    } else if (location[0] === Location.Library) {
      children.push({
        label: "Search the gym",
        content: (
          <>
            <p>
              You enter the gym and you find Ryder backed up against the wall.
            </p>
            <p>
              You see the Janitor doing something strange with his hands. Almost
              as if he was casting a spell.
            </p>
            {!willNotHelpRyder && (
              <p>{kid} sees you and he yells for your help!</p>
            )}
            {!willNotHelpJanitor && (
              <p>
                The Janitor sees you and with a smile says “I’m finally going to
                get rid of this ghost and be at peace at last. Come help me hold
                him down so I can finish casting this spell”
              </p>
            )}
          </>
        ),
        children: generateFourthChildren(),
      });
      children.push({
        label: "Search the classroom",
        content: (
          <>
            <p>You look in the classroom, but you find no one there.</p>
            <p>
              You continue to hear the sound of laughing. The screams get
              louder.
            </p>
            <p>Where do you search next?</p>
          </>
        ),
        children: generateOtherLocations([...location, Location.Classroom]),
      });
    } else {
      children.push({
        label: "Search the gym",
        content: (
          <>
            <p>
              You enter the gym and you find Ryder backed up against the wall.
            </p>
            <p>
              You see the Janitor doing something strange with his hands. Almost
              as if he was casting a spell.
            </p>
            {!willNotHelpRyder && (
              <p>{kid} sees you and he yells for your help!</p>
            )}
            {!willNotHelpJanitor && (
              <p>
                The Janitor sees you and with a smile says “I’m finally going to
                get rid of this ghost and be at peace at last. Come help me hold
                him down so I can finish casting this spell”
              </p>
            )}
          </>
        ),
        children: [],
      });
      children.push({
        label: "Search the library",
        content: (
          <>
            <p>You look in the library, but you find no one there.</p>
            <p>
              You continue to hear the sound of laughing. The screams get
              louder.
            </p>
            <p>Where do you search next?</p>
          </>
        ),
        children: generateOtherLocations([...location, Location.Library]),
      });
    }
    return children;
  };

  const generateInitialPassage = (): PassageNode => {
    const content = (
      <>
        <p>Today is homecoming</p>
        <p>
          You enter the school’s auditorium and you see that it’s decorated with
          a spooky ghost theme this year ironically.
        </p>
        <p>
          You see Ryder by himself by the drink table, the janitor setting up
          trashcans, and Professor Riley standing near the back.
        </p>
      </>
    );
    return { content, children: generateInitialChildren() };
  };

  return generateInitialPassage();
}
