import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { LogoIcon } from "./Icons";

import {
  useUser,
  SignOutButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

const routeList = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#cta", label: "Demo" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#team", label: "Team" },
  { href: "#newsletter", label: "Newsletter" },
  { href: "#faq", label: "FAQ" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  // const navigate = useNavigate();

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-bold text-xl flex"
            >
              <LogoIcon />
              PlaceMentor
            </a>
          </NavigationMenuItem>

          {/* Mobile */}
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    PlaceMentor
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </a>
                  ))}

                  <SignedIn>
                    <span className="text-sm mt-2">
                      Hi, {user?.firstName || "there"}
                    </span>
                    <SignOutButton>
                      <button
                        onClick={() => setIsOpen(false)}
                        className={`${buttonVariants({
                          variant: "default",
                        })} cursor-pointer`}
                      >
                        Sign Out
                      </button>
                    </SignOutButton>
                  </SignedIn>
                  <a
                    href="https://github.com/tejasgadge2504/PlaceMentor"
                    target="_blank"
                    className={`w-[110px] border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                    rel="noreferrer noopener"
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Github
                  </a>

                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setIsOpen(false)}
                        className={`${buttonVariants({
                          variant: "default",
                        })} cursor-pointer`}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* Desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex gap-4 items-center">
            <SignedIn>
              <span className="text-sm">Hi, {user?.firstName}</span>
              <SignOutButton>
                <button
                  className={`${buttonVariants({
                    variant: "default",
                  })} cursor-pointer`}
                >
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={`${buttonVariants({
                    variant: "default",
                  })} cursor-pointer`}
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <a
              href="https://github.com/tejasgadge2504/PlaceMentor"
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
              rel="noreferrer noopener"
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </a>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default Navbar;
