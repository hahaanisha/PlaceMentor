import {Button}  from "./ui/button";

function Cta() {
  return (
    <section id="cta" className="bg-muted/50 py-16 my-0 sm:my-10">
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Your Interview
            <span className="bg-gradient-to-b from-primary/60 to-primary text-[#20B256] bg-clip-text">
              {" "}
              Prep Hub{" "}
            </span>
            All in One Place
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            From resume insights to role-specific questions, Placementor brings
            everything—planning, practice, and personalized feedback—into one
            seamless, AI-powered conversational bot. Focus less on logistics and
            more on landing your dream job.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <a href="https://youtu.be/RogdnodHS_4">
            <Button className="w-full md:mr-4 md:w-auto cursor-pointer h-15">
              <b>Check Demo</b>
            </Button>
          </a>
          <a href="https://github.com/tejasgadge2504/PlaceMentor">
            <Button
              variant="outline"
              className="w-full md:mr-4 md:w-auto cursor-pointer h-15"
            >
              <b>Learn More</b>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Cta;