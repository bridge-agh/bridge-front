export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <div className="rounded-xl bg-base-300 p-5 flex flex-col justify-start items-center">
        <div className="text-2xl font-bold mb-3">Create account</div>
        <input type="text" placeholder="Username" className="input input-bordered mb-3" />
        <input type="text" placeholder="Email" className="input input-bordered mb-3" />
        <input type="password" placeholder="Password" className="input input-bordered mb-3" />
        <input type="password" placeholder="Confirm password" className="input input-bordered mb-3" />
        <button className="btn btn-primary">Create account</button>
      </div>
    </div>
  )
}
