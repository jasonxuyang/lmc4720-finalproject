import { ReactNode } from "react";
import { Day, JournalEntry, Weather, Location, Person, Flag } from "./types";

export const getNextDay = (currentDay: Day): Day => {
  switch (currentDay) {
    case Day.Monday:
      return Day.Tuesday;
    case Day.Tuesday:
      return Day.Wednesday;
    case Day.Wednesday:
      return Day.Thursday;
    case Day.Thursday:
      return Day.Friday;
    case Day.Friday:
      return Day.Saturday;
    default:
      return Day.Monday;
  }
};

export const generateRandomWeather = (): Weather => {
  const die = Math.floor(Math.random() * Object.keys(Weather).length);
  return Object.values(Weather)[die];
};

export const generateStatus = (weather: Weather, day: Day): ReactNode => {
  if (weather === Weather.Raining)
    return (
      <>
        <p>
          It was raining this morning. You get to the school a little bit late.
        </p>
        <p> Today is {day}. Where do you want to film?</p>
      </>
    );
  return (
    <p>
      It is a {weather.toLocaleLowerCase()} {day}. Where do you want to film
      today?
    </p>
  );
};

export const getVisitedCount = (
  journal: JournalEntry[],
  location: Location
) => {
  return journal.filter((entry) => entry.location === location).length;
};

export const getInteractionCount = (
  journal: JournalEntry[],
  person: Person
) => {
  return journal.filter((entry) => entry?.person === person).length;
};

export const checkFlag = (flags: Flag[], flag: Flag) => {
  return flags.some((flag) => flag === flag);
};
