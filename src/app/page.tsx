
export default function Home() {
  return (
    <div className="flex min-h-full flex-col items-center justify-between p-12 pt-24">
      <div className="flex flex-col w-3/5 border-opacity-50">
        <div className="grid h-auto card bg-base-200 rounded-box place-items-center p-6 gap-6">
          <p className="text-3xl text-secondary-content text-center">Join a game</p>
          <div className="flex flex-row w-full gap-4">
            <input className="input input-bordered input-primary flex-1" placeholder="Game ID" />
            <button className="btn btn-primary">Join</button>
          </div>
        </div>
        <div className="divider">OR</div>
        <div className="grid h-auto card bg-base-200 rounded-box place-items-center p-6 gap-6">
          <p className="text-3xl text-secondary-content text-center">Create your lobby</p>
          <button className="btn btn-primary">Create a game</button>
        </div>
      </div>
    </div>
  )
}
