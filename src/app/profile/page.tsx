"use client";

import Link from "next/link";
import { auth } from "@/logic/fb";

export default function Profile() {

  const fields = ["email", "username", "password"];
  
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-between items-center gap-4">
        <div className="text-2xl font-bold mb-4 text-center">Your profile {auth.currentUser?.displayName}</div>
        {fields.map((field) => 
          <Link
            key={field}   
            href={{
              pathname: "/profile/update",
              query: { field: field },
            }}
            className="btn btn-primary self-stretch">
            Change {field}
          </Link>)
        }
        
      </div>
    </div>
  );
}
