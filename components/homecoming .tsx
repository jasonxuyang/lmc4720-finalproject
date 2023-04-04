import Journal from "./journal";

export default function Homecoming() {
  return (
    <div className="w-8/12 p-12">
      <h2>Today is homecoming!</h2>
      <div
        onClick={() => {
          window.location.reload();
        }}
        className="cursor-pointer bg-white px-8 py-4 text-black hover:bg-gray-300"
      >
        Reset game
      </div>
    </div>
  );
}
