"use client";

import { LogoCompact } from "../logo";
import { UserButton } from "../UserButton";

const TopBar = () => {
  return (
    <header className="flex h-16 items-center justify-between px-2 py-1">
      <LogoCompact />
      <UserButton />
    </header>
  );
};

export default TopBar;
