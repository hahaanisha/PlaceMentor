/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LogoIcon } from "../../components/Icons";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const InternalNavbar = ({ showQuitButton, showHomeButton }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <div className="font-bold flex items-center">
            <LogoIcon />
            <span className="ml-2 font-bold text-xl">PlaceMentor</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Hi, {user?.firstName || "there"}</span>
            {showQuitButton && (
              <Button
                onClick={() => navigate("/interview-summary")}
                variant="outline"
                className="border border-gray-400 text-gray-800 hover:bg-gray-200"
              >
                🚪 Quit Interview
              </Button>
            )}
            {showHomeButton && (
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border border-gray-400 text-gray-800 hover:bg-gray-200"
              >
                🏠 Go to Home
              </Button>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default InternalNavbar;
