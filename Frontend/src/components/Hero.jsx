import { Button, buttonVariants } from "./ui/button";
import HeroCards from "./HeroCards";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

function Hero() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk(); // <-- use this to trigger modal programmatically

  const nextPage = () => {
    if (isSignedIn) {
      navigate("/resume-summary");
    } else {
      openSignIn(); // <-- This shows Clerk SignIn modal
    }
  };

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Ace
            </span>{" "}
            your next Interview
          </h1>{" "}
          with{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              PlaceMentor
            </span>{" "}
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Your AI-powered partner for company-specific mock interviews and smart
          feedback
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3 cursor-pointer" onClick={nextPage}>
            Get Started
          </Button>

          <a
            rel="noreferrer noopener"
            href="https://github.com/tejasgadge2504/PlaceMentor"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
            <GitHubLogoIcon className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="z-10">
        <HeroCards />
      </div>
    </section>
  );
}

export default Hero;
