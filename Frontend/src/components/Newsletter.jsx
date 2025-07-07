import { useState } from "react";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    setStatus("Subscribing...");

    try {
      // Using no-cors mode - this bypasses CORS but you can't read the response
      await fetch(
        "https://script.google.com/macros/s/AKfycbx6PcEcZXIg1itOHofKWqTvYux7YwQ6N-AwAyr9DteUM_Fe5XDWYtaZXpDUNnhbuWkw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      // Since we can't read the response with no-cors, assume success
      setStatus("You're subscribed! Check your inbox 🎉");
      setEmail("");
    } catch (error) {
      console.error("Error submitting the form:", error);
      setStatus("Failed to submit the form. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="newsletter" className="w-full">
      <hr className="w-11/12 mx-auto border-gray-200" />
      <div className="container py-24 sm:py-32 px-4 max-w-6xl mx-auto">
        <h3 className="text-center text-4xl md:text-5xl font-bold text-gray-900">
          Stay Ahead with{" "}
          <span className="bg-gradient-to-b from-green-400 to-green-600 text-transparent bg-clip-text">
            Placementor
          </span>
        </h3>
        <p className="text-xl text-gray-600 text-center mt-4 mb-8 max-w-2xl mx-auto">
          Get exclusive updates, tips, and resources to supercharge your
          interview prep—right in your inbox.
        </p>
        <div className="flex flex-col w-full md:flex-row md:w-6/12 lg:w-4/12 mx-auto gap-4 md:gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
            aria-label="email"
            required
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
        {status && (
          <p className="text-sm text-center mt-4 text-gray-600">{status}</p>
        )}
      </div>
      <hr className="w-11/12 mx-auto border-gray-200" />
    </section>
  );
}

export default Newsletter;
