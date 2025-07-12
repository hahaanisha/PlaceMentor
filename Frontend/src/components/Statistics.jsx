function Statistics() {
  const stats = [
    {
      quantity: "10",
      description: "Tailored questions per interview",
    },
    {
      quantity: "4+",
      description: "AI Agents working in sync",
    },
    {
      quantity: "3-step",
      description: "Plan. Practice. Improve.",
    },
    {
      quantity: "100%",
      description: "Custom questions from your resume",
    },
  ];

  return (
    <section id="statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ quantity, description }) => (
          <div key={description} className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">{quantity}</h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
