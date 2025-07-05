"use client";

import { useSession } from "next-auth/react";
import { LogoCompact } from "../logo";
import { UserButton } from "../UserButton";

const TopBar = () => {
  const { data } = useSession();
  const user = data?.user;

  if (!user) return null;

  return (
    <header className="flex h-16 items-center justify-between px-2 py-1">
      <LogoCompact />
      <UserButton user={user} />
    </header>
  );
};

export default TopBar;
