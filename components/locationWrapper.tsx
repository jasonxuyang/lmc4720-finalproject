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
import { PassageNode, Location } from "@/types";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useClassroom from "./locations/useClassroom";
import useMainHall from "./locations/useMainHall";

export default function LocationWrapper() {
  const [location, setLocation] = useRecoilState(locationState);
  const [day, setDay] = useRecoilState(dayState);
  const [journal, setJournal] = useRecoilState(journalState);
  const setWeather = useSetRecoilState(weatherState);
  const [flags, setFlags] = useRecoilState(flagsState);
  const [people, setPeople] = useRecoilState(peopleState);
  const classRoomPassage = useClassroom();
  const mainHallPassage = useMainHall();
  const [passage, setPassage] = useState<PassageNode | undefined>(undefined);

  useEffect(() => {
    const getIntialPassage = () => {
      switch (location) {
        case Location.Classroom:
          return classRoomPassage;
        case Location.MainHall:
          return mainHallPassage;
        default:
          return classRoomPassage;
      }
    };
    setPassage(getIntialPassage());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!passage || !location) return null;
  const timesVisited = getVisitedCount(journal, location);

  const goToNextDay = () => {
    setLocation(undefined);
    setDay(getNextDay(day));
    setWeather(generateRandomWeather());
    setPeople({ ...people });
    if (passage?.flag) {
      setFlags([...flags, passage.flag]);
    }
    if (passage?.effect) {
      setPeople({
        ...people,
        [passage.person]: {
          favor: people[passage.person].favor + passage.effect,
        },
      });
    }
    setJournal([
      ...journal,
      passage?.flag ? { day, location, flag: passage.flag } : { day, location },
    ]);
  };

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
