import Link from "next/link";
import protectRoute from "@/logic/protect_route";

function Player({ name }: { name: string }) {
  return (
    <div className="flex flex-row pe-2 rounded-3xl justify-start items-center bg-base-100">
      <div className="w-14 h-14 rounded-full bg-blue-600 me-3 flex flex-col justify-center items-center">
        <div>YOU</div>
      </div>
      <div className="text-lg font-bold">{name}</div>
    </div>
  );
}

function Lobby() {
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex flex-col justify-start items-stretch me-16 gap-4">
            <Player name="Grizzly" />
            <Player name="Hyenaaagfdsg" />
          </div>
          <div className="flex flex-col justify-start items-stretch gap-4">
            <Player name="Axolotl" />
            <Player name="Cormorant" />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link href="/home" className="btn btn-link text-error">
            Leave
          </Link>
          <Link href="/game" className="btn btn-primary">
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default protectRoute(<Lobby />);
