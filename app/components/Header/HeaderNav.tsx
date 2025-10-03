import { Stack } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function HeaderNav() {
  return (
    <nav className="md:overflow-hidden bg-orange-500 md:px-4 py-4 md:rounded-tl-[4.5rem] md:w-[80%] w-full ml-auto">
      <Stack direction={{ md: "row", xs: "column" }} className="justify-between items-center px-6">
        <div className="relative md:w-[50%] w-[90%]">
          <input
            type="text"
            className="w-full px-4 pl-12 py-2 bg-gray-300 text-gray-600 font-semibold text-xl rounded-[4.5rem]"
          />
          <SearchRoundedIcon
            fontSize="large"
            className="text-orange-500 top-1 left-3 absolute"
          ></SearchRoundedIcon>
        </div>

        <div>
          <button className="text-white px-4 py-2 rounded-md">Agencias / B2B</button>
        </div>

      </Stack>
    </nav>
  );
}
