import { ReactNode } from "react";

export enum Day {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export enum Location {
  Classroom = "Classroom",
  MainHall = "Main Hall",
  Gym = "Gym",
  Library = "Library",
  Cafeteria = "Cafeteria",
}

export enum Weather {
  Sunny = "Sunny",
  Cloudy = "Cloudy",
  Raining = "Raining",
}

export enum Person {
  Riley = "Professor Riley",
  Janitor = "Janitor",
  Ryder = "Ryder",
}

export enum GameState {
  Start = "Start",
  Game = "Game",
  End = "End",
}

export enum Flag {
  DayZero = "First day",
  SeenGhost = "Saw ghost",
  MetRyder = "Met Ryder",
  TalkedAboutRyderWithRiley = "Talked about Ryder with Professor Riley",
  TalkedAboutGhostWithRiley = "Talked about ghosts with Professor Riley",
}

export type JournalEntry = {
  day: Day;
  location: Location;
  person?: Person;
};

export type PassageTree = {
  [key: string]: PassageNode;
};

export type PassageNode = {
  content: ReactNode;
  label?: string;
  children?: PassageNode[];
  effect?: number;
  flag?: Flag;
};

export type PersonState = {
  favor: number;
};
