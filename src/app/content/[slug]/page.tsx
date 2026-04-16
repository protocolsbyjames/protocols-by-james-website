import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

const articles: Record<
  string,
  {
    title: string;
    category: string;
    readTime: string;
    content: string[];
  }
> = {
  "truth-about-fat-loss": {
    title: "The Truth About Fat Loss No One Tells You",
    category: "Fat Loss",
    readTime: "5 min",
    content: [
      "Most people approach fat loss completely wrong. They slash calories, do hours of cardio, and white-knuckle their way through a few weeks before falling off. The problem is not willpower. The problem is the approach.",
      "Fat loss comes down to a sustained calorie deficit combined with enough protein to preserve muscle. That is it. No magic foods, no special timing windows, no supplements that burn fat while you sleep.",
      "The key word is sustained. A 500 calorie deficit you can maintain for 12 weeks will always beat a 1,200 calorie deficit you abandon after 10 days. This is where most plans fail. They are too aggressive to stick with.",
      "Start with your maintenance calories and subtract 300 to 500. Hit your protein target (0.8 to 1g per pound of bodyweight). Train with intensity to keep muscle. Track your weight weekly and adjust based on the trend, not day-to-day fluctuations.",
      "The coaches and influencers selling detoxes and elimination diets are selling you a fantasy. Real fat loss is boring, consistent, and effective. That is why it works.",
    ],
  },
  "build-muscle-after-30": {
    title: "How to Build Muscle After 30",
    category: "Training",
    readTime: "7 min",
    content: [
      "There is a myth that muscle growth stops or dramatically slows after 30. The reality is that recovery changes, not your ability to build muscle. If you adjust your training and recovery to account for this, you can absolutely still make significant gains.",
      "The biggest shift after 30 is recovery capacity. You may not bounce back from 6 heavy training days like you did at 22. That does not mean you train less hard. It means you train smarter. Higher quality sets, better exercise selection, and more attention to sleep and nutrition.",
      "Volume is still the primary driver of hypertrophy at any age. But the way you distribute that volume matters more as you get older. Spreading your weekly volume across more sessions with moderate intensity tends to produce better results than crushing yourself in 3 brutal workouts.",
      "Protein needs actually increase slightly as you age because muscle protein synthesis becomes less efficient. Aim for 1g per pound of bodyweight and distribute it across 3 to 4 meals throughout the day.",
      "Joint health becomes more important. Warm up properly, include mobility work, and do not ego lift. Your tendons and ligaments take longer to adapt than your muscles do. Respect that and you will train pain-free for decades.",
      "The bottom line: your 30s, 40s, and beyond can be the best training years of your life if you stop chasing what worked at 20 and start building a system that works now.",
    ],
  },
  "bloodwork-101": {
    title: "Bloodwork 101: What to Test and Why",
    category: "Bloodwork",
    readTime: "8 min",
    content: [
      "If you are serious about optimizing your health and performance, bloodwork is non-negotiable. It is the only way to see what is actually happening inside your body instead of guessing based on how you feel.",
      "At a minimum, you should be getting a comprehensive metabolic panel, complete blood count, lipid panel, thyroid panel (TSH, Free T3, Free T4), and hormone panel (Total Testosterone, Free Testosterone, Estradiol, SHBG) every 6 to 12 months.",
      "Testosterone is the marker most men care about, and for good reason. But looking at Total T alone is not enough. Free Testosterone is what your body actually uses. You can have total T in the normal range but low free T if your SHBG is elevated. That is why you need the full picture.",
      "Thyroid markers tell you about your metabolism. If your TSH is elevated and Free T3 is low, your metabolism is sluggish. This impacts fat loss, energy, mood, and training performance. Many men have subclinical thyroid issues that never get caught because they only test TSH.",
      "Lipids matter more than people think, especially if you are using any kind of protocol or supplement stack. Track your LDL, HDL, triglycerides, and ideally ApoB. These tell you about cardiovascular risk.",
      "Other markers worth tracking: fasting insulin (metabolic health), Vitamin D (immune function, mood), ferritin (iron stores), and liver enzymes (AST/ALT). If you are running any protocols, liver and kidney markers are essential.",
      "Get your bloodwork done fasted, in the morning, and consistently at the same lab. Compare your results over time, not against a single snapshot. Trends matter more than any individual number.",
    ],
  },
  "peptides-beginners-guide": {
    title: "Peptides Explained: A Beginner's Guide",
    category: "Peptides",
    readTime: "6 min",
    content: [
      "Peptides are short chains of amino acids that act as signaling molecules in your body. They tell your cells to do specific things, from healing tissue to releasing growth hormone to reducing inflammation.",
      "Unlike hormones, most peptides are targeted. They tend to do one or two things well rather than having system-wide effects. This is why they have become popular in the optimization and research space. You can address specific goals without broad side effects.",
      "Some of the most commonly researched peptides include BPC-157 (gut healing and tissue repair), GHK-Cu (skin and tissue regeneration), Ipamorelin (growth hormone release), and TB-500 (injury recovery and inflammation).",
      "Peptides typically come as lyophilized (freeze-dried) powder in glass vials. Before use, they need to be reconstituted with bacteriostatic water. This process is simple but requires sterile technique to maintain purity and potency.",
      "Dosing is measured in micrograms (mcg) or milligrams (mg). Most peptides are administered subcutaneously (under the skin) using an insulin syringe. The dose depends on the specific peptide, your bodyweight, and your goals.",
      "Storage matters. Unreconstituted peptides should be kept in the freezer. Once reconstituted, they go in the refrigerator and are typically stable for 3 to 4 weeks. Never leave reconstituted peptides at room temperature.",
      "If you are new to peptides, start by understanding the basics of reconstitution, dosing, and storage. Our Peptide Academy and Peptide Calculator are built to help you get this right from day one.",
    ],
  },
  "morning-routine": {
    title: "Morning Routine for Peak Performance",
    category: "Lifestyle",
    readTime: "4 min",
    content: [
      "Your morning sets the tone for your entire day. If you start reactive, scrolling your phone in bed, skipping breakfast, and rushing out the door, you are already behind. A structured morning routine changes that.",
      "Step one is sleep quality. Your morning routine actually starts the night before. Get 7 to 9 hours of quality sleep. No screens 30 minutes before bed. Cool, dark room. Consistent bedtime. If your sleep is garbage, no morning routine will save you.",
      "When you wake up, hydrate first. Your body is dehydrated after 7+ hours of sleep. 16 to 20 ounces of water before anything else. Add electrolytes if you train early.",
      "Move your body within the first hour. This does not have to be a full workout. 10 minutes of walking, stretching, or light movement is enough to wake up your nervous system and set a physical tone for the day.",
      "Eat a real breakfast with protein. 30 to 40 grams of protein in your first meal supports muscle protein synthesis, stabilizes blood sugar, and keeps you full and focused through the morning. Eggs, greek yogurt, protein shake, whatever works for you.",
      "Limit your phone for the first 30 to 60 minutes. No email, no social media, no news. This is the one habit that makes the biggest difference for most people. Start your day on your terms, not reacting to everyone else's agenda.",
    ],
  },
  "progressive-overload": {
    title: "Progressive Overload: The Only Rule That Matters",
    category: "Training",
    readTime: "5 min",
    content: [
      "If there is one principle that separates people who transform their physiques from people who look the same year after year, it is progressive overload. Your body adapts to stress. If the stress does not increase over time, neither do your results.",
      "Progressive overload does not mean adding weight to the bar every single session. That works for beginners, but it is not sustainable long-term. Overload can come from more reps, more sets, better range of motion, slower eccentrics, shorter rest periods, or heavier weight.",
      "The key is tracking your workouts. If you do not know what you did last week, you cannot beat it this week. Write down your exercises, sets, reps, and weight. Every session, look at your log and find one variable to push forward.",
      "A common mistake is chasing overload at the expense of form. If you added 10 pounds but your range of motion got cut in half, you did not overload anything. You just changed the exercise. Quality reps always come first.",
      "Programming matters here. You need a structured plan that allows for progressive overload in a logical way. Random workouts do not create progressive overload because there is no baseline to improve from.",
      "This is exactly why coaching works. A good coach structures your program so that overload is built into the system. You do not have to think about it. You just follow the plan and the progress happens.",
    ],
  },
  "reconstitution-guide": {
    title: "How to Reconstitute Peptides (Step by Step)",
    category: "Peptides",
    readTime: "6 min",
    content: [
      "Reconstituting peptides is straightforward once you understand the process. The goal is to dissolve the freeze-dried powder into bacteriostatic water so it can be accurately dosed and administered.",
      "What you need: your peptide vial, bacteriostatic water, an insulin syringe, alcohol swabs, and a clean workspace. Sterile technique is important. Wash your hands and work on a clean surface.",
      "Step 1: Let your peptide vial and bacteriostatic water come to room temperature. Do not use them straight from the freezer or refrigerator. This takes about 15 to 20 minutes.",
      "Step 2: Swab the tops of both the peptide vial and the bacteriostatic water vial with alcohol wipes. Let them air dry.",
      "Step 3: Draw your desired amount of bacteriostatic water into the syringe. How much water to add depends on your peptide amount and desired concentration. Use our Peptide Calculator to figure out the right amount.",
      "Step 4: Insert the needle into the peptide vial at an angle and slowly let the water run down the side of the glass. Do not squirt it directly onto the powder. Tilt the vial at 45 degrees and let gravity do the work. This prevents foaming and preserves peptide integrity.",
      "Step 5: Gently swirl the vial until the powder is fully dissolved. Do not shake it. If there are still particles, let it sit in the refrigerator for 15 to 30 minutes and swirl again.",
      "Step 6: Store the reconstituted peptide in the refrigerator. It will remain stable for approximately 3 to 4 weeks. Never freeze a reconstituted peptide and avoid repeated temperature changes.",
    ],
  },
  "macro-tracking-basics": {
    title: "Macro Tracking Without Losing Your Mind",
    category: "Nutrition",
    readTime: "5 min",
    content: [
      "Tracking macros is one of the most effective tools for body composition change. But it can also become obsessive and unsustainable if you approach it wrong. The goal is accuracy without anxiety.",
      "Start with protein. This is the only macro most people need to actively hit a target for. Aim for 0.8 to 1 gram per pound of bodyweight per day. If you are in a deficit, keep protein high to preserve muscle. Everything else is secondary.",
      "For fats and carbs, hit your calorie target and distribute the remaining calories based on your preferences. Some people do better with more carbs (especially if they train hard). Others prefer higher fat for satiety. There is no single correct ratio.",
      "Use a food scale for the first 2 to 4 weeks. This calibrates your eye so you can estimate portions later. Most people massively underestimate how much they eat. The scale removes the guesswork.",
      "After the initial calibration period, you do not need to weigh everything forever. Learn your go-to meals, know roughly what they contain, and save the precise tracking for when you are dialing in for specific goals.",
      "Do not let tracking control your social life. If you go out to dinner, make reasonable choices and move on. One meal does not make or break your results. Consistency over weeks and months is what matters, not perfection at every meal.",
    ],
  },
  "cutting-vs-bulking": {
    title: "Cutting vs. Bulking: When to Do What",
    category: "Fat Loss",
    readTime: "6 min",
    content: [
      "The decision to cut or bulk should not be random. It should be based on your current body fat percentage, your training experience, and your goals for the next 3 to 6 months.",
      "General guideline: if you are above 18 to 20% body fat as a male, cut first. Getting leaner improves insulin sensitivity, nutrient partitioning, and hormone balance. All of these make a subsequent bulk more effective.",
      "If you are under 12 to 14%, you have room to bulk. A lean bulk with a modest surplus of 200 to 300 calories above maintenance will add muscle without excessive fat gain. Bigger surpluses build more fat, not more muscle.",
      "For beginners, the decision is easier. If you are new to structured training, you can build muscle and lose fat simultaneously for the first 6 to 12 months regardless of whether you are in a surplus or deficit. This is the newbie gains window. Use it.",
      "Do not bulk and cut in short 4-week cycles. Neither phase gets enough time to produce meaningful results. Commit to a minimum of 8 to 12 weeks in either direction before switching.",
      "The biggest mistake people make is perpetually bulking because they are afraid to diet, or perpetually cutting because they are afraid to gain any fat. Both lead to spinning your wheels. Pick a phase, commit to it, execute it well, then switch.",
    ],
  },
  "supplement-stack": {
    title: "The Only Supplements Worth Taking",
    category: "Lifestyle",
    readTime: "5 min",
    content: [
      "The supplement industry is built on hype. Most products do nothing meaningful. But there are a handful of supplements with strong evidence behind them that are worth your money.",
      "Creatine monohydrate is the most researched performance supplement in existence. 3 to 5 grams per day improves strength, power output, and muscle hydration. Take it daily, timing does not matter. No loading phase needed.",
      "Protein powder is not magic, but it is convenient. If you struggle to hit your protein target through whole foods, a quality whey or casein protein helps you close the gap. Think of it as food, not a supplement.",
      "Vitamin D3 is essential if you do not get regular sun exposure. Most people are deficient. 2,000 to 5,000 IU daily with a fat source. Get your blood levels tested to dial in the dose.",
      "Magnesium is involved in over 300 enzymatic reactions. Most people do not get enough from food. Magnesium glycinate or threonate before bed supports sleep quality, recovery, and muscle function.",
      "Fish oil (omega-3s) supports cardiovascular health, reduces inflammation, and aids recovery. Look for products with high EPA and DHA content. 2 to 3 grams of combined EPA/DHA per day is a solid dose.",
      "Everything else is situational. Caffeine is useful pre-workout. Electrolytes matter if you train hard or eat low carb. Beyond that, most supplements are not worth the money. Focus on training, nutrition, and sleep first. Those are your real performance enhancers.",
    ],
  },
  "training-splits": {
    title: "Choosing the Right Training Split",
    category: "Training",
    readTime: "7 min",
    content: [
      "The best training split is the one you can be consistent with. That said, different splits work better for different experience levels, schedules, and goals.",
      "Full Body (3 days per week): Best for beginners and people with limited training days. You hit every muscle group each session. High frequency drives fast skill acquisition and neural adaptations.",
      "Upper/Lower (4 days per week): A solid middle ground. You hit everything twice per week with enough volume per session to drive hypertrophy. Works well for intermediate lifters with 4 days to train.",
      "Push/Pull/Legs (5 to 6 days per week): The most popular split for serious lifters. Each muscle group gets hit hard once or twice per week with high volume per session. Requires more gym time but allows for more specialization.",
      "Bro Split (5 days, one muscle group per day): Gets a bad reputation but can work for advanced lifters who need high volume per muscle group. The downside is low frequency, each muscle only gets trained once per week.",
      "The right split depends on how many days you can train, your recovery capacity, and your experience level. A beginner on a PPL split is probably wasting training days. An advanced lifter on a 3-day full body might not get enough volume.",
      "Do not overthink this. Pick a split that fits your schedule, follow it consistently for 8 to 12 weeks, track your progress, and adjust from there. The program you stick with always beats the theoretically perfect program you abandon after 2 weeks.",
    ],
  },
  "peptide-calculator-guide": {
    title: "How to Use a Peptide Calculator",
    category: "Peptides",
    readTime: "4 min",
    content: [
      "Peptide dosing involves a few conversions that can feel confusing at first. A peptide calculator simplifies this by doing the math for you. Here is how it works and what you need to know.",
      "The core concept: when you reconstitute a peptide, you create a solution with a specific concentration. That concentration determines how far you pull the syringe to get your desired dose.",
      "You need four pieces of information: your syringe size (0.3 mL, 0.5 mL, or 1.0 mL), the peptide vial amount in mg, how much bacteriostatic water you added in mL, and your desired dose in mcg or mg.",
      "The math: concentration = peptide mg divided by water mL. Then dose in mL = (dose in mcg / 1000) divided by concentration. Finally, syringe units = dose in mL times 100, since 1 mL equals 100 units on an insulin syringe.",
      "Example: You have a 10 mg vial, add 2 mL of bacteriostatic water, and want a 250 mcg dose. Concentration is 5 mg/mL. Dose in mL is 0.25 / 5 = 0.05 mL. Syringe units = 0.05 times 100 = 5 units.",
      "Key conversions to remember: 1 mg = 1,000 mcg. 1 mL = 1 cc = 100 units. These never change regardless of the peptide or concentration.",
      "Our free Peptide Calculator handles all of this automatically. Just select your values and it shows you exactly where to pull the syringe, complete with a visual.",
    ],
  },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return (
      <main className="min-h-screen bg-[#0b1227] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <Link
            href="/content"
            className="text-amber-400 hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Content
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1227] text-white">
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/content"
            className="text-zinc-500 hover:text-zinc-300 text-sm inline-flex items-center gap-1 mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Content
          </Link>
          <span className="block text-amber-400 text-sm font-semibold uppercase tracking-wider mb-4">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-zinc-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} read</span>
            <span className="text-zinc-700">|</span>
            <span>By James Quilter</span>
          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
            {article.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-[#0d1628] p-8 text-center">
            <h3 className="text-xl font-bold mb-2">
              Ready to stop guessing?
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Get a personalized plan built around your goals, your body, and
              your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/coaching"
                className="inline-flex items-center gap-2 bg-amber-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-amber-500 transition-colors"
              >
                View Coaching <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/peptalk/book"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/20 transition-colors"
              >
                Book a Free Pep-Talk <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
