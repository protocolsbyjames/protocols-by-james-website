import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Play, Syringe, FlaskConical, RefreshCw, Calculator } from "lucide-react";

const tutorials = [
  {
    title: "How to Fill a Cartridge",
    description: "Learn the proper technique for filling a peptide cartridge safely and accurately. Cover sterile technique, proper angle, and avoiding common mistakes.",
    icon: Syringe,
  },
  {
    title: "How to Reconstitute",
    description: "Step-by-step guide to reconstituting your peptide powder correctly. Includes water selection, measurement, and proper mixing methods.",
    icon: FlaskConical,
  },
  {
    title: "How to Swap Out Old Cartridge",
    description: "Master the process of replacing a used cartridge with a fresh one. Learn how to identify an empty cartridge and install a new one safely.",
    icon: RefreshCw,
  },
  {
    title: "How to Convert Units to mg/cc/mL",
    description: "Understand conversions and calculations for accurate dosing. Essential knowledge for managing peptide protocols and ensuring proper dosing.",
    icon: Calculator,
  },
];

export default async function AcademyLearnPage() {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get("academy_access");

  if (accessCookie?.value !== "granted") {
    redirect("/academy");
  }

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Peptide Academy
          </h1>
          <p className="text-xl text-zinc-400">
            Master the fundamentals. Watch these four essential tutorials to level up your knowledge.
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => {
              const IconComponent = tutorial.icon;
              return (
                <div
                  key={tutorial.title}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-400/30 transition-colors group"
                >
                  <div className="h-48 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden">
                    <IconComponent className="w-12 h-12 text-amber-400/50 absolute" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                      <div className="w-16 h-16 rounded-full border-2 border-amber-400/50 flex items-center justify-center group-hover:border-amber-400 transition-colors">
                        <Play className="w-6 h-6 text-amber-400/50 ml-1 group-hover:text-amber-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-3">{tutorial.title}</h3>
                    <p className="text-zinc-400 text-sm mb-6">
                      {tutorial.description}
                    </p>
                    <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
