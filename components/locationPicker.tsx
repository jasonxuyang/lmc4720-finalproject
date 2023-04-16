import { generateStatus } from "@/helpers";
import dayState from "@/recoil/dayState";
import locationState from "@/recoil/locationState";
import weatherState from "@/recoil/weatherState";
import { Day, Location } from "@/types";
import { useRecoilState, useRecoilValue } from "recoil";

const renderFirstDayText = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <p>It is Monday morning.</p>
      <p>
        You get to the school a little bit early and wait outside the school
        doors to meet with Professor Riley. As you are waiting, you see students
        start trickling in.
      </p>
      <p>
        You see Professor Riley approaching you and give him a firm handshake.
        “Never thought you’d ever be back here eh?” He jokes at you.
      </p>
      <p>
        As you both walk in, he gives you a quick tour of the Gym, Library, and
        Cafeteria.
      </p>
      <p>
        Walking out of the cafeteria, he turns to you and says “I have to get
        ready for First period now. If you’re ever interested in filming high
        school students sleeping, come visit my classroom.
      </p>
      <p>
        As you see him leaving, you begin thinking about where you want to film
        today.
      </p>
    </div>
  );
};

export default function LocationPicker() {
  const [location, setLocation] = useRecoilState(locationState);
  const day = useRecoilValue(dayState);
  const weather = useRecoilValue(weatherState);

  if (location) return null;

  return (
    <div className="flex w-8/12 flex-col justify-between p-12">
      {day === Day.Monday && renderFirstDayText()}
      <div>
        <div className="w-ful mb-4 mt-16 text-center">
          {generateStatus(weather, day)}
        </div>
        <div className="flex w-full flex-row flex-wrap content-center justify-center gap-x-4 gap-y-4">
          {Object.values(Location).map((location) => {
            return (
              <div
                className={`cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300 ${
                  (location === Location.Cafeteria ||
                    location === Location.Library) &&
                  "pointer-events-none opacity-50"
                }`}
                key={location}
                onClick={() => {
                  setLocation(location);
                }}
              >
                {location}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
