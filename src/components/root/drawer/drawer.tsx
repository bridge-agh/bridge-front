import ThemeSwitch from "@/components/theme_switch";

export default function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer drawer-end">
      <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side hidden">
        <label className="drawer-overlay h-auto"></label>
        <ul className="menu p-4 w-full bg-base-100 gap-2">
          <li>
            <button className="btn uppercase text-neutral-content">
              Register
            </button>
          </li>
          <li>
            <button className="btn btn-primary uppercase text-primary-content">
              Log in
            </button>
          </li>
          <div className="flex-1 flex flex-col justify-end">
            <li>
              <ThemeSwitch className="btn text-neutral-content" />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
