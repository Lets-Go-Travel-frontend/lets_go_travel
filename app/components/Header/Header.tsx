import Image from "next/image";
import HeaderNav from "./HeaderNav";
import HeaderTopBar from "./HeaderTopBar";
import { Stack } from "@mui/material";

interface HeaderProps {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="w-full">
      <Stack direction={{ md: "row", xs: "column" }} spacing={3} className="items-center">
        <div className="px-6 flex-items-center cursor-pointer" onClick={onLogoClick}>
          <Image src="/images/logo.png" alt="Logo Let's Go Vacation" width={300} height={100} />
        </div>
        <div className="flex-1">
          <HeaderTopBar />
          <HeaderNav />
        </div>
      </Stack>
    </header>
  );
}