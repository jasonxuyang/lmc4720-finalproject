import { checkFlag, getInteractionCount } from "@/helpers";
import { getVisitedCount } from "@/helpers";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import weatherState from "@/recoil/weatherState";
import { Flag, PassageNode, Person, Weather } from "@/types";
import { useRecoilValue } from "recoil";

export default function useLibrary(): PassageNode | undefined {
  const location = useRecoilValue(locationState);
  const journal = useRecoilValue(journalState);
  const weather = useRecoilValue(weatherState);
  const flags = useRecoilValue(flagsState);
  if (!location) return undefined;
  const isRaining = weather === Weather.Raining;

  const ryderInteractionCount = getInteractionCount(journal, Person.Ryder);
  const metRyder = checkFlag(flags, Flag.MetRyder);
  const knowsParker = checkFlag(flags, Flag.TalkedAboutGhostWithRyder);
  const willHelpRyder = checkFlag(flags, Flag.WillHelpRyder);
  const willNotHelpRyder = checkFlag(flags, Flag.WillNotHelpRyder);

  const generateChildren = (): PassageNode[] => {
    let children = [];
    if (knowsParker && !(willHelpRyder || willNotHelpRyder)) {
      children.push({
        label: "Whatever you need kid. I'm there.",
        person: Person.Ryder,
        effect: 1,
        flag: Flag.WillHelpRyder,
        content: (
          <>
            <p>Ryder’s face brightens up.</p>
            <p>
              “Thank you so much!” he beams and gives an air high five to who
              you assume is Parker.
            </p>
            <p>“I knew I could count on you!”</p>
            <p>He reaches out to give you a fist bump.</p>
            <p>You fist bump him back.</p>
            <p>
              As you wander around the library you feel good about your
              decision.
            </p>
          </>
        ),
      });
      children.push({
        label: "I'm not sure...",
        person: Person.Ryder,
        flag: Flag.WillNotHelpRyder,
        effect: -1,
        content: (
          <>
            <p>You see Ryder’s face fall.</p>
            <p>“Oh… okay…” he weakly says.</p>
            <p>
              As you continue walking around you start feeling bad about your
              decision.
            </p>
            <p>
              But then you start thinking to yourself “What can a janitor really
              do…”
            </p>
          </>
        ),
      });
    }
    return children;
  };

  const generateInitialPassage = (): PassageNode => {
    let content, flag, person;
    if (isRaining && willHelpRyder) {
      content = (
        <>
          <p>You get set up in the library.</p>
          <p>You don’t see anyone at the library.</p>
          <p>You take some b-roll of the library and leave.</p>
        </>
      );

      return {
        content,
        children: generateChildren(),
      };
    }
    if (isRaining && willNotHelpRyder) {
      person = Person.Parker;
      flag = Flag.SeenGhost;
      content = (
        <>
          <p>
            You enter the library and don’t see anyone. You wander around
            looking for a place to get set up.
          </p>
          <p>
            As you are walking, you hear something fall behind you and you
            notice some books that fell to the ground.
          </p>
          <p>You look around but don’t see anyone.</p>
          <p>
            “Wow, he’s really good, why is he playing by himself…” you think to
            yourself.
          </p>
          <p>
            As you reach to grab one of the books, it suddenly moves and you
            grab thin air.
          </p>
          <p>You blink confusingly.</p>
          <p>
            You reach to grab it again and all of a sudden the books opens by
            itself as *something* shuffles through the pages.
          </p>
          <p>“You should leave…” you hear very faintly.</p>
        </>
      );

      return {
        content,
        person,
        children: generateChildren(),
        flag,
      };
    } else {
      person = Person.Ryder;
      if (willHelpRyder) {
        content = (
          <>
            <p>You get set up in the library.</p>
            <p>
              You see Ryder in his usual spot and he waves at you with a smile
              on his face.
            </p>
            <p>You wave back and then take some b-roll of the library.</p>
          </>
        );

        return {
          content,
          children: generateChildren(),
        };
      }
      if (willNotHelpRyder) {
        content = (
          <>
            <p>You don’t see anyone at the library.</p>
            <p>
              You recount the last time you met with Ryder at the library, and
              you regret what you said to him.
            </p>
            <p>You decide to head home early instead of taking some b-roll.</p>
          </>
        );

        return {
          content,
          children: generateChildren(),
        };
      }
      if (!metRyder) {
        content = (
          <>
            <p>
              You walk into the library and you see a kid there studying by
              himself.
            </p>
            <p>
              You stay back a little bit and watch, and you notice that it looks
              like he’s talking to himself.
            </p>
            <p>
              As you start unpacking your camera, he notices you, and closes his
              textbook and darts out of the library.
            </p>
            <p>
              You stand there a little bit before finishing setting up your
              camera for some b-roll.
            </p>
            <p>“I wonder why he’s so flighty?” you think to yourself…</p>
          </>
        );

        return {
          flag: Flag.MetRyder,
          content,
          person,
          children: generateChildren(),
        };
      }
      if (knowsParker) {
        content = (
          <>
            <p>
              You walk into the library and you see Ryder in his usual spot.
            </p>
            <p>
              As you walk around and take b-roll footage with your camera, Ryder
              motions for you to come over.
            </p>
            <p>“Hey… I was wondering… if I could get your help?” he begins.</p>
            <p>
              “I’ve been seeing the janitor around a lot lately, I think he’s
              onto Parker and me… if he tries anything funny, do you think you
              could help us?”
            </p>
          </>
        );
        return {
          content,
          children: generateChildren(),
        };
      }
      if (metRyder) {
        flag = Flag.TalkedAboutGhostWithRyder;
        content = (
          <>
            <p>
              As you walk into the library, you see the same kid studying by
              himself.
            </p>
            <p>
              As you look closer, he seems to be talking to himself like he
              usually does.
            </p>
            <p>You approach him and he stops talking.</p>
            <p>
              “You were definitely talking to someone…” you tell him. “Who were
              you talking to?”
            </p>
            <p>“No.. no one.” he stammers.</p>
            <p>
              “I heard that there is a ghost that roams around the school…” you
              say.
            </p>
            <p>You can see that the kid is noticeably nervous.</p>
            <p>
              “It’s okay, you can trust me…” you tell him, “What’s your name?”
            </p>
            <p>
              “My name is Ryder…and… there is a ghost… his name is Parker, and
              he is really nice...”
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
