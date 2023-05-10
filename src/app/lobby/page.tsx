import Link from "next/link";

function Player({name}: {name: string}) {
  return (
    <div className="flex flex-row pe-2 rounded-xl justify-start items-center bg-base-100">
      <div className="w-14 h-14 rounded-full bg-blue-600 me-3 flex flex-col justify-center items-center">
        <div>YOU</div>
      </div>
      <div className="text-lg font-bold">{name}</div>
    </div>
  )
}

export default function Lobby() {
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <div className="rounded-xl bg-base-300 p-5 flex flex-col justify-start items-stretch">
        <div className="text-2xl font-bold mb-3 self-center">Lobby</div>
        <div className="flex flex-row justify-between items-center mb-3">
          <div className="flex flex-col justify-start items-stretch me-16">
            <Player name="Grizzly" />
            <div className="h-4" />
            <Player name="Hyena" />
          </div>
          <div className="flex flex-col justify-start items-stretch">
            <Player name="Axolotl" />
            <div className="h-4" />
            <Player name="Cormorant" />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Link href="/home" className="btn btn-link text-error">Leave</Link>
          <Link href="/game" className="btn btn-primary">Start</Link>
        </div>
      </div>
    </div>
  )
}
