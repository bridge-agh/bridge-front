
export default function Drawer({ children }: { children: React.ReactNode }) {

    return (
        <div className="drawer drawer-end">
            <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {children}
            </div> 
            <div className="drawer-side hidden">
                <label className="drawer-overlay h-auto"></label>
                <ul className="menu p-4 w-full bg-base-100 text-base-content gap-2">
                    <li>
                        <button className="btn uppercase">Register</button>
                    </li>
                    <li>
                        <button className="btn btn-primary uppercase">Log in</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}