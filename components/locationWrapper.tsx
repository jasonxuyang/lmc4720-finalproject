import {
  getVisitedCount,
  checkFlag,
  getNextDay,
  generateRandomWeather,
} from "@/helpers";
import dayState from "@/recoil/dayState";
import flagsState from "@/recoil/flagsState";
import journalState from "@/recoil/journalState";
import locationState from "@/recoil/locationState";
import peopleState from "@/recoil/peopleState";
import weatherState from "@/recoil/weatherState";
import { PassageNode, Location, Day, Flag } from "@/types";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useClassroom from "./locations/useClassroom";
import useMainHall from "./locations/useMainHall";
import useGym from "./locations/useGym";
import useLibrary from "./locations/useLibrary";
import useHomecoming from "./locations/useHomecoming";

export default function LocationWrapper() {
  const [location, setLocation] = useRecoilState(locationState);
  const [day, setDay] = useRecoilState(dayState);
  const [journal, setJournal] = useRecoilState(journalState);
  const setWeather = useSetRecoilState(weatherState);
  const [flags, setFlags] = useRecoilState(flagsState);
  const [people, setPeople] = useRecoilState(peopleState);
  const classRoomPassage = useClassroom();
  const mainHallPassage = useMainHall();
  const gymPassage = useGym();
  const libraryPassage = useLibrary();
  const homecomingPassage = useHomecoming();
  const [passage, setPassage] = useState<PassageNode | undefined>(undefined);

  useEffect(() => {
    const getIntialPassage = () => {
      if (day === Day.Saturday) return homecomingPassage;
      switch (location) {
        case Location.Classroom:
          return classRoomPassage;
        case Location.MainHall:
          return mainHallPassage;
        case Location.Gym:
          return gymPassage;
        case Location.Library:
          return libraryPassage;
        default:
          return homecomingPassage;
      }
    };
    setPassage(getIntialPassage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if ((!passage || !location) && day !== Day.Saturday) return null;

  const goToNextDay = () => {
    setLocation(undefined);
    setDay(getNextDay(day));
    setWeather(generateRandomWeather());
    setPeople({ ...people });
    if (passage?.flag) {
      setFlags([...flags, passage.flag]);
    }
    if (passage?.effect && passage?.person) {
      setPeople({
        ...people,
        [passage.person]: {
          favor: people[passage.person].favor + passage.effect,
        },
      });
    }
    setJournal([
      ...journal,
      { day, location, flag: passage?.flag, person: passage?.person },
    ]);
  };

  return (
    <div className="w-8/12 p-12">
      <div className="mt-8 flex flex-col gap-y-2">{passage?.content}</div>
      <div className="mt-8">
        {passage?.children?.map((child) => {
          return (
            <div
              key={child.label}
              onClick={() => {
                setPassage(child);
                child?.onClick && child?.onClick();
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
          onClick={goToNextDay}
        >
          Next
        </div>
      )}
    </div>
  );
}
