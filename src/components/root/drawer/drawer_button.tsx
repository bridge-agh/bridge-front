'use client'

const toggleDrawer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const drawerHandle: HTMLElement | null = document.getElementById('drawer-menu');
    const drawerButton: HTMLElement | null = document.getElementById('drawer-button');

    if (drawerHandle instanceof HTMLInputElement && drawerButton instanceof HTMLInputElement) {
        if (event.target.checked) {
            drawerHandle.checked = true;
            drawerButton.checked = true;
        } else {
            drawerHandle.checked = false;
            drawerButton.checked = false;
        }
    }
}



export default function DrawerButton() {

    return (
        <label className="btn btn-circle swap swap-rotate">
            <input onChange={toggleDrawer} id="drawer-button" type="checkbox" className="drawer-toggle"/>
            <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg>
            <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" /></svg>
        </label>
    )
}