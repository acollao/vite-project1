export default function Contributors() {
  const contributors = [
    {
      name: "FAITH JASSY DELA ROSA LLAMAS",
      role: "Main Developer",
      contribution: "Set up project structure, API integration, database migrations.",
    },
    {
      name: "LAURENCE ROBERT LEAÑO AGAD",
      role: "Frontend Developer",
      contribution: "Created React pages and UI components.",
    },
    {
      name: "ARNEIA CHELLE BARROZO BAJARO",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "KYLIE ANNE CASTILLO DOMINGO",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "GABRIEL JAMES MAGALINO MALAKI",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "ELIKA GOTERA MULAWIN",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "KRISTINE ANN MICOMPAL NEPOMUCENO",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "FRANCO SABUCO PINUELA",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "MIKIEL CHESTER CARIADO RELUYA",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    {
      name: "KRIZHA NICOLE VINCO SORNO",
      role: "Backend Developer",
      contribution: "Built Express API and Postgres queries.",
    },
    
  ];

  return (
    <>
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Project Contributors</h1>
      <p className="text-muted-foreground">
          Meet the team behind the SFAC Taguig Admissions Portal
      </p>
    </div>
      <div className="grid gap-6 md:grid-cols-2">
        {contributors.map((c, i) => (
          <div
            key={i}
            className="p-4 border rounded-2xl shadow bg-white hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <p className="text-gray-600">{c.role}</p>
            <p className="mt-2">{c.contribution}</p>
          </div>
        ))}
      </div>
    </>
  );
}
