import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clock,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

type ClassLevel = "10" | "11" | "12";
type Subject = "Mathematics" | "Science" | "Social Science (SST)";

interface RevisionPoint {
  type: "definition" | "concept" | "formula" | "exam_q" | "summary";
  text: string;
}

interface RevisionChapter {
  name: string;
  fiveMinSummary: string;
  points: RevisionPoint[];
}

const typeColors: Record<RevisionPoint["type"], string> = {
  definition:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  concept:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  formula:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  exam_q:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  summary: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
};

const typeLabels: Record<RevisionPoint["type"], string> = {
  definition: "Definition",
  concept: "Concept",
  formula: "Formula",
  exam_q: "Exam Q",
  summary: "Summary",
};

const revisionData: Record<ClassLevel, Record<Subject, RevisionChapter[]>> = {
  "10": {
    Mathematics: [
      {
        name: "Real Numbers",
        fiveMinSummary:
          "Real numbers include rationals and irrationals. Use Euclid's Division Lemma to find HCF. HCF × LCM = product of two numbers. Terminating decimals have denominators with only 2s and 5s as prime factors.",
        points: [
          {
            type: "definition",
            text: "Real Number: Any number on the number line (rational or irrational)",
          },
          {
            type: "definition",
            text: "Rational Number: Can be expressed as p/q where p,q are integers and q ≠ 0",
          },
          {
            type: "definition",
            text: "Irrational Number: Cannot be expressed as p/q (e.g., √2, π)",
          },
          {
            type: "formula",
            text: "Euclid's Division Lemma: a = bq + r where 0 ≤ r < b",
          },
          { type: "formula", text: "HCF(a,b) × LCM(a,b) = a × b" },
          {
            type: "concept",
            text: "Fundamental Theorem of Arithmetic: Every composite number has a unique prime factorization",
          },
          {
            type: "concept",
            text: "For p/q to be terminating decimal: q should have only 2 and 5 as prime factors",
          },
          {
            type: "concept",
            text: "HCF uses lowest powers of common prime factors",
          },
          {
            type: "concept",
            text: "LCM uses highest powers of all prime factors",
          },
          { type: "exam_q", text: "Q: Prove that √3 is irrational" },
          {
            type: "exam_q",
            text: "Q: Find HCF and LCM of 510 and 92 using prime factorization",
          },
          { type: "exam_q", text: "Q: Show that 7×11×13 + 13 is composite" },
          {
            type: "exam_q",
            text: "Q: Without actually dividing, determine if 17/8 is terminating",
          },
          {
            type: "summary",
            text: "Euclid's algorithm: HCF(a,b) = HCF(b,r) where a = bq + r",
          },
          {
            type: "summary",
            text: "Key fact: Sum or product of rational and irrational is irrational",
          },
          {
            type: "summary",
            text: "√2, √3, √5, ∛2 are all irrational numbers",
          },
        ],
      },
      {
        name: "Quadratic Equations",
        fiveMinSummary:
          "Quadratic: ax²+bx+c=0. Three methods: factorization, completing the square, quadratic formula. Discriminant D = b²-4ac determines nature of roots. D>0: two real roots, D=0: equal roots, D<0: no real roots.",
        points: [
          {
            type: "definition",
            text: "Quadratic Equation: ax² + bx + c = 0, where a ≠ 0",
          },
          {
            type: "definition",
            text: "Roots: Values of x that satisfy the quadratic equation",
          },
          { type: "definition", text: "Discriminant: D = b² - 4ac" },
          {
            type: "formula",
            text: "Quadratic Formula: x = [-b ± √(b²-4ac)] / 2a",
          },
          { type: "formula", text: "Sum of roots: α + β = -b/a" },
          { type: "formula", text: "Product of roots: α × β = c/a" },
          { type: "concept", text: "D > 0: two distinct real roots (unequal)" },
          {
            type: "concept",
            text: "D = 0: two equal real roots, each = -b/2a",
          },
          { type: "concept", text: "D < 0: no real roots (complex)" },
          {
            type: "concept",
            text: "Middle term splitting: find two numbers whose sum = b and product = ac",
          },
          { type: "exam_q", text: "Q: Find roots of 2x² - 7x + 3 = 0" },
          {
            type: "exam_q",
            text: "Q: Determine discriminant and nature of roots of x² - 4x + 4 = 0",
          },
          {
            type: "exam_q",
            text: "Q: A rectangular park is 3m longer than wide; area = 10m². Find dimensions.",
          },
          {
            type: "summary",
            text: "Completing the square: x² + bx = (x+b/2)² - (b/2)²",
          },
          { type: "summary", text: "For equal roots: b² = 4ac" },
          {
            type: "summary",
            text: "Sum of roots = -coefficient of x / coefficient of x²",
          },
        ],
      },
      {
        name: "Arithmetic Progressions",
        fiveMinSummary:
          "AP: sequence with constant difference d. nth term = a+(n-1)d. Sum of n terms = n/2[2a+(n-1)d]. Middle term of odd AP = (n+1)/2 th term. AM between a,b = (a+b)/2.",
        points: [
          {
            type: "definition",
            text: "AP: Sequence where consecutive terms differ by a constant d",
          },
          {
            type: "definition",
            text: "Common difference d = any term - previous term",
          },
          { type: "formula", text: "nth term: aₙ = a + (n-1)d" },
          { type: "formula", text: "Sum formula 1: Sₙ = n/2[2a + (n-1)d]" },
          {
            type: "formula",
            text: "Sum formula 2: Sₙ = n/2[a + l] where l = last term",
          },
          { type: "formula", text: "aₙ = Sₙ - Sₙ₋₁ (nth term from sum)" },
          {
            type: "concept",
            text: "Sum of first n natural numbers = n(n+1)/2",
          },
          { type: "concept", text: "Sum of first n odd numbers = n²" },
          {
            type: "concept",
            text: "Three terms in AP: take them as a-d, a, a+d",
          },
          {
            type: "exam_q",
            text: "Q: Find 20th term of AP: 3, 8, 13, 18, ...",
          },
          {
            type: "exam_q",
            text: "Q: How many two-digit numbers are divisible by 3?",
          },
          {
            type: "exam_q",
            text: "Q: Find sum of first 40 positive integers divisible by 6",
          },
          { type: "summary", text: "If aₙ = pn + q, then d = p and a = p + q" },
          { type: "summary", text: "Number of terms: n = (l - a)/d + 1" },
          {
            type: "summary",
            text: "Sum of squares of first n naturals: n(n+1)(2n+1)/6",
          },
        ],
      },
      {
        name: "Triangles",
        fiveMinSummary:
          "Similar triangles have equal angles and proportional sides. BPT: line parallel to base divides other sides proportionally. Pythagoras theorem: a²+b²=c² for right triangles. Area ratio = square of side ratio.",
        points: [
          {
            type: "definition",
            text: "Similar triangles: Same shape, possibly different size; angles equal, sides proportional",
          },
          {
            type: "definition",
            text: "Congruent triangles: Same shape AND size",
          },
          {
            type: "formula",
            text: "BPT (Thales): If DE ∥ BC, then AD/DB = AE/EC",
          },
          {
            type: "formula",
            text: "Pythagoras: In right △ABC, AC² = AB² + BC²",
          },
          {
            type: "formula",
            text: "Area ratio of similar triangles = (side ratio)²",
          },
          {
            type: "concept",
            text: "AA similarity: Two angles equal ⟹ triangles similar",
          },
          {
            type: "concept",
            text: "SSS similarity: All three sides proportional",
          },
          {
            type: "concept",
            text: "SAS similarity: Two sides proportional and included angle equal",
          },
          {
            type: "concept",
            text: "Converse of BPT: If AD/DB = AE/EC, then DE ∥ BC",
          },
          {
            type: "exam_q",
            text: "Q: Prove BPT (Basic Proportionality Theorem)",
          },
          {
            type: "exam_q",
            text: "Q: In △ABC, if DE ∥ BC, AD=2, DB=3, AE=x, EC=4.5. Find x.",
          },
          {
            type: "exam_q",
            text: "Q: Prove that the ratio of areas of similar triangles is equal to ratio of squares of sides",
          },
          {
            type: "summary",
            text: "Converse Pythagoras: if a²+b²=c², then angle C = 90°",
          },
          {
            type: "summary",
            text: "Altitude on hypotenuse: h² = p·q (geometric mean)",
          },
          {
            type: "summary",
            text: "All equilateral triangles are similar; all squares are similar",
          },
        ],
      },
    ],
    Science: [
      {
        name: "Chemical Reactions & Equations",
        fiveMinSummary:
          "Reactions: combination, decomposition, displacement, double displacement. OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons). Exothermic releases heat, endothermic absorbs. Law of conservation of mass: mass of reactants = products.",
        points: [
          {
            type: "definition",
            text: "Chemical reaction: Reactants transform into products with new properties",
          },
          {
            type: "definition",
            text: "Exothermic reaction: Heat is released (e.g., burning, respiration)",
          },
          {
            type: "definition",
            text: "Endothermic reaction: Heat is absorbed (e.g., photosynthesis, dissolution of NH₄Cl)",
          },
          { type: "formula", text: "Combination: A + B → AB" },
          { type: "formula", text: "Decomposition: AB → A + B" },
          {
            type: "formula",
            text: "Displacement: A + BC → AC + B (A more reactive than B)",
          },
          {
            type: "concept",
            text: "Oxidation: loss of electrons / gain of oxygen / loss of hydrogen",
          },
          {
            type: "concept",
            text: "Reduction: gain of electrons / loss of oxygen / gain of hydrogen",
          },
          {
            type: "concept",
            text: "OIL RIG mnemonic: Oxidation Is Loss, Reduction Is Gain",
          },
          {
            type: "concept",
            text: "Law of conservation of mass: atoms neither created nor destroyed in reaction",
          },
          {
            type: "exam_q",
            text: "Q: Balance the equation: Fe + H₂O → Fe₃O₄ + H₂",
          },
          {
            type: "exam_q",
            text: "Q: What happens when zinc reacts with dilute HCl? Write equation.",
          },
          {
            type: "exam_q",
            text: "Q: Identify oxidising and reducing agent in: 2Mg + O₂ → 2MgO",
          },
          {
            type: "summary",
            text: "Corrosion: slow oxidation of metals (Fe → rust, Cu → green patina)",
          },
          {
            type: "summary",
            text: "Rancidity: oxidation of fats/oils; prevented by antioxidants, vacuum packing",
          },
          {
            type: "summary",
            text: "Electrolytic decomposition requires electricity (e.g., water → H₂ + O₂)",
          },
        ],
      },
      {
        name: "Electricity",
        fiveMinSummary:
          "V=IR (Ohm's law). Series: same current, add resistances. Parallel: same voltage, add reciprocal resistances. Power P=VI=I²R. Joule's heating H=I²Rt. 1 kWh = 3.6 × 10⁶ J.",
        points: [
          {
            type: "definition",
            text: "Electric current: Flow of electric charge; I = Q/t (amperes)",
          },
          {
            type: "definition",
            text: "Resistance: Opposition to current flow; depends on material, length, area, temperature",
          },
          {
            type: "definition",
            text: "EMF: Energy per unit charge provided by source (volts)",
          },
          { type: "formula", text: "Ohm's Law: V = IR" },
          {
            type: "formula",
            text: "Series resistance: R_total = R₁ + R₂ + R₃",
          },
          {
            type: "formula",
            text: "Parallel resistance: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃",
          },
          {
            type: "formula",
            text: "Power: P = VI = I²R = V²/R; Energy: E = Pt",
          },
          { type: "formula", text: "Joule's law: H = I²Rt" },
          {
            type: "concept",
            text: "In series: same current flows, voltages add up",
          },
          {
            type: "concept",
            text: "In parallel: same voltage, currents divide",
          },
          { type: "concept", text: "1 kWh = 3.6 × 10⁶ joules" },
          {
            type: "exam_q",
            text: "Q: Two resistors 4Ω and 6Ω connected in parallel. Find equivalent resistance.",
          },
          {
            type: "exam_q",
            text: "Q: A bulb of 60W works on 220V. Find current and resistance.",
          },
          {
            type: "exam_q",
            text: "Q: Why are household appliances connected in parallel?",
          },
          {
            type: "summary",
            text: "Resistance formula: R = ρl/A (ρ = resistivity)",
          },
          {
            type: "summary",
            text: "Alloys have higher resistivity and less variation with temperature than pure metals",
          },
          {
            type: "summary",
            text: "Heating effects: filament bulbs, electric iron, geysers",
          },
        ],
      },
      {
        name: "Light – Reflection and Refraction",
        fiveMinSummary:
          "Mirror: 1/f = 1/v + 1/u, f = R/2. Lens: 1/f = 1/v - 1/u. Magnification: m = -v/u (mirror), m = v/u (lens). Snell's law: n₁sinθ₁ = n₂sinθ₂. Power P = 1/f dioptre.",
        points: [
          {
            type: "definition",
            text: "Concave mirror: Reflecting surface caves inward; converges light",
          },
          {
            type: "definition",
            text: "Convex mirror: Reflecting surface bulges outward; diverges light",
          },
          { type: "formula", text: "Mirror formula: 1/v + 1/u = 1/f" },
          { type: "formula", text: "Mirror magnification: m = -v/u = h'/h" },
          { type: "formula", text: "Lens formula: 1/f = 1/v - 1/u" },
          {
            type: "formula",
            text: "Lens magnification: m = v/u; Power P = 1/f (in dioptres)",
          },
          { type: "formula", text: "Snell's law: n₁sinθ₁ = n₂sinθ₂" },
          {
            type: "concept",
            text: "Sign convention: object always on left; distances measured from pole/optical center",
          },
          {
            type: "concept",
            text: "Convex mirror always gives: virtual, erect, diminished image",
          },
          {
            type: "concept",
            text: "Convex lens: converging; concave lens: diverging",
          },
          {
            type: "exam_q",
            text: "Q: An object is placed 15cm from concave mirror of focal length 10cm. Find image position.",
          },
          {
            type: "exam_q",
            text: "Q: A ray enters glass (n=1.5) from air at 30°. Find angle of refraction.",
          },
          {
            type: "exam_q",
            text: "Q: Where should object be placed in front of convex lens of f=20cm to get real inverted image twice in size?",
          },
          {
            type: "summary",
            text: "f = R/2 for spherical mirrors; focal length = half radius of curvature",
          },
          {
            type: "summary",
            text: "Real image: forms in front of mirror/behind lens; Virtual: opposite",
          },
          {
            type: "summary",
            text: "For two lenses in contact: P = P₁ + P₂, 1/f = 1/f₁ + 1/f₂",
          },
        ],
      },
      {
        name: "Life Processes",
        fiveMinSummary:
          "Nutrition (auto/hetero), respiration, transport, excretion are vital life processes. Photosynthesis: CO₂+H₂O+light→glucose+O₂. Aerobic: glucose+O₂→CO₂+H₂O+38ATP. Kidneys filter blood and excrete urea.",
        points: [
          {
            type: "definition",
            text: "Autotrophic nutrition: organism makes its own food (plants - photosynthesis)",
          },
          {
            type: "definition",
            text: "Heterotrophic nutrition: organism takes in complex food from outside",
          },
          {
            type: "formula",
            text: "Photosynthesis: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂",
          },
          {
            type: "formula",
            text: "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP",
          },
          {
            type: "formula",
            text: "Anaerobic (yeast): Glucose → Ethanol + CO₂",
          },
          {
            type: "concept",
            text: "Stomata open in light due to K⁺ influx into guard cells making them turgid",
          },
          {
            type: "concept",
            text: "Blood: plasma (55%) + corpuscles (45%); RBC carries O₂ via haemoglobin",
          },
          {
            type: "concept",
            text: "Kidney: nephron is functional unit; reabsorbs glucose, amino acids, water",
          },
          {
            type: "concept",
            text: "Transpiration: loss of water from leaves; creates suction pull for water transport",
          },
          {
            type: "exam_q",
            text: "Q: What are the differences between aerobic and anaerobic respiration?",
          },
          {
            type: "exam_q",
            text: "Q: Describe the process of urine formation in kidney",
          },
          {
            type: "exam_q",
            text: "Q: What is the role of bile juice in digestion?",
          },
          {
            type: "summary",
            text: "Villi in small intestine increase surface area for absorption",
          },
          {
            type: "summary",
            text: "Phloem transports food; xylem transports water and minerals",
          },
          {
            type: "summary",
            text: "Normal blood pressure: 120/80 mmHg (systolic/diastolic)",
          },
          {
            type: "summary",
            text: "Dialysis: artificial kidney function using semipermeable membrane",
          },
        ],
      },
    ],
    "Social Science (SST)": [
      {
        name: "The Rise of Nationalism in Europe",
        fiveMinSummary:
          "Nationalism rose post-French Revolution. Napoleonic Code spread ideas of liberty. 1848: Frankfurt Parliament. 1871: Unification of Germany & Italy. Frederic Sorrieu's 1848 painting depicted liberal democratic world.",
        points: [
          {
            type: "definition",
            text: "Nationalism: Belief in unique identity of a nation with common culture, language, and history",
          },
          {
            type: "definition",
            text: "Nation-state: Political unit where citizens share national identity",
          },
          {
            type: "definition",
            text: "Liberalism: Freedom for individual, rule of law, equality before law, representative government",
          },
          {
            type: "concept",
            text: "French Revolution 1789: First expression of European nationalism",
          },
          {
            type: "concept",
            text: "Napoleon spread the Napoleonic Code: civil equality, abolished feudalism",
          },
          {
            type: "concept",
            text: "Metternich: Austrian Chancellor who opposed nationalism; German Confederation founded 1815",
          },
          {
            type: "concept",
            text: "Zollverein 1834: German customs union under Prussia; boosted economic nationalism",
          },
          {
            type: "concept",
            text: "1848 Revolutions: Frankfurt Parliament created; liberal constitutions demanded across Europe",
          },
          {
            type: "concept",
            text: "Unification of Germany: Bismarck's wars against Denmark (1864), Austria (1866), France (1871)",
          },
          {
            type: "concept",
            text: "Unification of Italy: Cavour (diplomatic), Garibaldi (military), Victor Emmanuel II (king)",
          },
          {
            type: "exam_q",
            text: "Q: What was the role of language in the development of nationalism in Europe?",
          },
          {
            type: "exam_q",
            text: "Q: Describe the role played by Otto Von Bismarck in German unification",
          },
          {
            type: "exam_q",
            text: "Q: What were the major social and political issues in Europe during 1815-1848?",
          },
          {
            type: "summary",
            text: "Romanticism: cultural movement; emphasized emotions, folk tradition, mother tongue",
          },
          {
            type: "summary",
            text: "Key symbol: Marianne (France), Germania (Germany) - female allegories of nations",
          },
          {
            type: "summary",
            text: "Treaty of Vienna 1815: Metternich's conservative order; tried to undo Napoleon's changes",
          },
        ],
      },
      {
        name: "Nationalism in India",
        fiveMinSummary:
          "Non-Cooperation Movement 1920-22, Civil Disobedience 1930 (Dandi March), Quit India 1942. Various communities participated. Gandhi used satyagraha and non-violence. Indian National Congress founded 1885.",
        points: [
          {
            type: "definition",
            text: "Satyagraha: Non-violent resistance; truth-force (Gandhi's method)",
          },
          {
            type: "definition",
            text: "Non-cooperation: Boycott of British goods, courts, schools, legislatures",
          },
          {
            type: "concept",
            text: "Rowlatt Act 1919: allowed detention without trial; sparked nationwide protests",
          },
          {
            type: "concept",
            text: "Jallianwala Bagh Massacre 1919: General Dyer ordered firing on unarmed crowd; 400+ killed",
          },
          {
            type: "concept",
            text: "Non-Cooperation Movement 1920: suspended after Chauri Chaura violence (1922)",
          },
          {
            type: "concept",
            text: "Simon Commission 1927: all-white commission; boycotted across India",
          },
          {
            type: "concept",
            text: "Civil Disobedience Movement 1930: Dandi March (Gandhi walked 240 miles to make salt)",
          },
          {
            type: "concept",
            text: "Gandhi-Irwin Pact 1931: Civil disobedience called off; political prisoners released",
          },
          {
            type: "concept",
            text: "Poona Pact 1932: Separate electorate for untouchables dropped; reserved seats in provincial councils",
          },
          {
            type: "concept",
            text: "Quit India Movement 1942: 'Do or Die'; mass arrests of Congress leaders",
          },
          {
            type: "exam_q",
            text: "Q: Why did Gandhiji decide to launch the Civil Disobedience Movement?",
          },
          {
            type: "exam_q",
            text: "Q: Explain the role of various groups in Non-Cooperation Movement",
          },
          {
            type: "exam_q",
            text: "Q: How did the participation of different social groups make the movement into mass movement?",
          },
          {
            type: "summary",
            text: "Khilafat Movement 1919-1924: support for Ottoman Caliph; united Hindus and Muslims briefly",
          },
          {
            type: "summary",
            text: "Peasants, workers, tribals all participated in nationalist movements",
          },
          {
            type: "summary",
            text: "Women played significant role: picketed liquor shops, made salt, participated in marches",
          },
        ],
      },
      {
        name: "Power Sharing",
        fiveMinSummary:
          "Power sharing prevents ethnic conflicts. Belgium model: linguistic groups share power. Sri Lanka denied Tamil demands - civil war. Forms: horizontal (organs of govt), vertical (levels of govt), social groups, political parties.",
        points: [
          {
            type: "definition",
            text: "Power sharing: Sharing of power among different organs, levels and groups in a democracy",
          },
          {
            type: "definition",
            text: "Majoritarianism: Rule by majority community, often suppressing minorities",
          },
          {
            type: "concept",
            text: "Belgium: Dutch 59%, French 40%, German 1%; resolved ethnic conflict through community government",
          },
          {
            type: "concept",
            text: "Sri Lanka: Sinhalese (74%) majority; passed Sinhala Only Act 1956; Tamils marginalized",
          },
          {
            type: "concept",
            text: "Sri Lanka civil war: Tamil Tigers (LTTE) demanded separate state; ended 2009",
          },
          {
            type: "concept",
            text: "Horizontal power sharing: between legislature, executive, judiciary",
          },
          {
            type: "concept",
            text: "Vertical power sharing: Central, State, Local government levels",
          },
          {
            type: "concept",
            text: "Power sharing among social groups: reserved constituencies for SC/ST",
          },
          {
            type: "concept",
            text: "Prudential reason for power sharing: reduces conflict, ensures political stability",
          },
          {
            type: "concept",
            text: "Moral reason for power sharing: it's the very spirit of democracy",
          },
          {
            type: "exam_q",
            text: "Q: What is the difference between prudential and moral reasons for power sharing?",
          },
          {
            type: "exam_q",
            text: "Q: Why did Sinhala nationalists feel insecure about power sharing with Tamils?",
          },
          {
            type: "exam_q",
            text: "Q: How did Belgium solve its ethnic problem through power sharing?",
          },
          {
            type: "summary",
            text: "Community government in Belgium: separate government for each language community",
          },
          {
            type: "summary",
            text: "Federal form: power shared between central and state; unitary: power concentrated",
          },
          {
            type: "summary",
            text: "Coalition government: sharing of power by different political parties",
          },
        ],
      },
      {
        name: "Development",
        fiveMinSummary:
          "Development means different things to different people. Per capita income as main criterion. HDI includes income, education, health. Sustainability: can current development continue? Average income hides distribution.",
        points: [
          {
            type: "definition",
            text: "Development: Progress or improvement in a complex way; includes human well-being",
          },
          {
            type: "definition",
            text: "Per Capita Income: National income divided by total population",
          },
          {
            type: "definition",
            text: "Human Development Index (HDI): composite index of income, education, life expectancy",
          },
          {
            type: "definition",
            text: "Sustainable development: Meeting present needs without compromising future generations",
          },
          {
            type: "concept",
            text: "Different people have different development goals (e.g., girl child vs father)",
          },
          {
            type: "concept",
            text: "World Bank criterion: countries with per capita income >$12,236/year (2020) are rich",
          },
          {
            type: "concept",
            text: "India: lower middle income as per World Bank (2019)",
          },
          {
            type: "concept",
            text: "Kerala vs Punjab: Kerala has better literacy/health despite lower per capita income",
          },
          {
            type: "concept",
            text: "BMI (Body Mass Index): nutrition/health indicator; underweight if BMI < 18.5",
          },
          {
            type: "concept",
            text: "Net Attendance Ratio: % of students enrolled who actually attend",
          },
          {
            type: "exam_q",
            text: "Q: Why do we use average income as a measure of development? What are its limitations?",
          },
          {
            type: "exam_q",
            text: "Q: What is Human Development Index? What are its components?",
          },
          {
            type: "exam_q",
            text: "Q: What are the characteristics of sustainable development?",
          },
          {
            type: "summary",
            text: "Infant Mortality Rate: deaths per 1000 live births before age 1",
          },
          {
            type: "summary",
            text: "Literacy Rate: % of people aged 7+ who can read and write",
          },
          {
            type: "summary",
            text: "Developed countries: high income, good health, high literacy, industrialized",
          },
        ],
      },
    ],
  },
  "11": {
    Mathematics: [
      {
        name: "Sets",
        fiveMinSummary:
          "Set: well-defined collection. Roster vs set-builder form. Operations: union (∪), intersection (∩), difference (-), complement ('). De Morgan's laws. n(A∪B) = n(A)+n(B)-n(A∩B).",
        points: [
          {
            type: "definition",
            text: "Set: Well-defined collection of distinct objects",
          },
          {
            type: "definition",
            text: "Null set (∅): Set with no elements; finite set",
          },
          {
            type: "definition",
            text: "Subset: A ⊆ B if every element of A is also in B",
          },
          { type: "formula", text: "n(A∪B) = n(A) + n(B) - n(A∩B)" },
          {
            type: "formula",
            text: "Number of subsets of set with n elements = 2ⁿ",
          },
          {
            type: "concept",
            text: "Universal set U contains all sets under discussion",
          },
          {
            type: "concept",
            text: "De Morgan's: (A∪B)' = A' ∩ B'; (A∩B)' = A' ∪ B'",
          },
          { type: "concept", text: "A - B = A ∩ B' (elements in A but not B)" },
          {
            type: "exam_q",
            text: "Q: In a group of 60 people, 25 like cricket, 30 like football, 10 like both. How many like neither?",
          },
          {
            type: "exam_q",
            text: "Q: Write the set {x : x is a prime number less than 10} in roster form",
          },
          {
            type: "summary",
            text: "Power set P(A) = set of all subsets; |P(A)| = 2^|A|",
          },
          {
            type: "summary",
            text: "Cartesian product A×B = {(a,b) : a∈A, b∈B}; |A×B| = |A||B|",
          },
        ],
      },
      {
        name: "Trigonometric Functions",
        fiveMinSummary:
          "Trig defined for any angle. sin²x+cos²x=1. Addition formulas: sin(A+B)=sinAcosB+cosAsinB. Double angle: sin2A=2sinAcosA. Period of sin,cos = 2π; tan = π.",
        points: [
          {
            type: "definition",
            text: "Radian: angle subtended at center by arc equal to radius; π radians = 180°",
          },
          {
            type: "formula",
            text: "sin²x + cos²x = 1; 1+tan²x=sec²x; 1+cot²x=cosec²x",
          },
          { type: "formula", text: "sin(A+B) = sinAcosB + cosAsinB" },
          { type: "formula", text: "cos(A+B) = cosAcosB - sinAsinB" },
          {
            type: "formula",
            text: "sin2A = 2sinAcosA; cos2A = cos²A - sin²A = 2cos²A - 1",
          },
          { type: "formula", text: "tan2A = 2tanA / (1 - tan²A)" },
          {
            type: "concept",
            text: "Period of sin/cos = 2π; period of tan/cot = π",
          },
          {
            type: "concept",
            text: "sin(-x) = -sinx (odd); cos(-x) = cosx (even)",
          },
          {
            type: "exam_q",
            text: "Q: Prove that sin(A+B)sin(A-B) = sin²A - sin²B",
          },
          { type: "exam_q", text: "Q: Find the value of sin75°" },
          {
            type: "summary",
            text: "CAST rule: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4",
          },
          {
            type: "summary",
            text: "sin3A = 3sinA - 4sin³A; cos3A = 4cos³A - 3cosA",
          },
        ],
      },
    ],
    Science: [
      {
        name: "Laws of Motion",
        fiveMinSummary:
          "F=ma (Newton's 2nd law). Action=Reaction (3rd law). Momentum p=mv. Impulse=change in momentum. Friction f=μN. For incline: a=g(sinθ-μcosθ). Centripetal force: mv²/r.",
        points: [
          {
            type: "definition",
            text: "Inertia: Tendency of object to resist change in state of rest or motion",
          },
          { type: "definition", text: "Momentum: p = mv (vector quantity)" },
          { type: "formula", text: "Newton's 2nd law: F = ma" },
          { type: "formula", text: "Impulse: J = FΔt = Δp" },
          {
            type: "formula",
            text: "Friction: f = μN (μ = coefficient of friction)",
          },
          {
            type: "concept",
            text: "Conservation of momentum: no external force ⟹ total momentum constant",
          },
          {
            type: "concept",
            text: "Centripetal force = mv²/r directed toward center",
          },
          { type: "concept", text: "Banking angle: tan θ = v²/rg" },
          {
            type: "exam_q",
            text: "Q: A body of mass 5kg is acted upon by two forces. Find acceleration.",
          },
          {
            type: "exam_q",
            text: "Q: Explain why we fall forward when a bus brakes suddenly",
          },
          {
            type: "summary",
            text: "Free body diagram: isolate object, draw all forces acting on it",
          },
          {
            type: "summary",
            text: "Pseudo force: in non-inertial frame, F = -ma (opposite to acceleration)",
          },
        ],
      },
    ],
    "Social Science (SST)": [
      {
        name: "The Rise of Nationalism in Europe",
        fiveMinSummary:
          "Nationalism rose post-French Revolution. Napoleon spread liberal ideas. 1848 revolutions. German unification by Bismarck 1871. Italian unification by Garibaldi, Cavour, Mazzini.",
        points: [
          {
            type: "definition",
            text: "Nationalism: Political ideology based on belief that nation should govern itself",
          },
          {
            type: "concept",
            text: "French Revolution 1789: First mass mobilization around national identity",
          },
          {
            type: "concept",
            text: "Napoleonic Code: civil equality, abolished feudalism, rational administrative system",
          },
          {
            type: "concept",
            text: "Conservative reaction: Metternich, Concert of Europe, Treaty of Vienna 1815",
          },
          {
            type: "concept",
            text: "1848: Year of Revolutions; Frankfurt Parliament; demands for constitutions",
          },
          {
            type: "concept",
            text: "Germany unified under Prussia through 'blood and iron' policy of Bismarck",
          },
          {
            type: "exam_q",
            text: "Q: What was the significance of the Frankfurt Parliament?",
          },
          {
            type: "exam_q",
            text: "Q: How did nations use folk tales and traditions to promote nationalism?",
          },
          {
            type: "summary",
            text: "Zollverein 1834: economic union of German states; prepared ground for political union",
          },
          {
            type: "summary",
            text: "Romanticism: glorified emotion, nature, folk tradition; promoted local language",
          },
        ],
      },
    ],
  },
  "12": {
    Mathematics: [
      {
        name: "Relations and Functions",
        fiveMinSummary:
          "Functions: one-to-one (injective), onto (surjective), bijective. Composition fog(x) = f(g(x)). Inverse exists only for bijective functions. Equivalence relation: reflexive + symmetric + transitive.",
        points: [
          {
            type: "definition",
            text: "Function: Rule that assigns each element of domain to exactly one element of codomain",
          },
          {
            type: "definition",
            text: "Injective (one-to-one): Different inputs give different outputs",
          },
          {
            type: "definition",
            text: "Surjective (onto): Every element of codomain has at least one preimage",
          },
          {
            type: "definition",
            text: "Bijective: Both injective and surjective; has inverse",
          },
          { type: "formula", text: "Composition: (fog)(x) = f(g(x))" },
          { type: "formula", text: "Inverse: f⁻¹ exists iff f is bijective" },
          {
            type: "concept",
            text: "Equivalence relation: reflexive (aRa), symmetric (aRb⟹bRa), transitive (aRb,bRc⟹aRc)",
          },
          { type: "concept", text: "Equivalence classes partition the set" },
          {
            type: "exam_q",
            text: "Q: Show that f(x) = 2x+3 is bijective and find its inverse",
          },
          {
            type: "exam_q",
            text: "Q: Check if relation R = {(a,b): a-b is divisible by 5} is equivalence",
          },
          {
            type: "summary",
            text: "Composition of bijective functions is bijective",
          },
          {
            type: "summary",
            text: "Domain of fog = domain of g where g(x) is in domain of f",
          },
        ],
      },
      {
        name: "Integrals",
        fiveMinSummary:
          "Integration is reverse of differentiation. Power rule: ∫xⁿ = xⁿ⁺¹/(n+1). By parts: ∫u dv = uv - ∫v du (ILATE). Definite integral = area under curve. Properties: symmetry, splitting limits.",
        points: [
          {
            type: "definition",
            text: "Antiderivative: F(x) is antiderivative of f(x) if F'(x) = f(x)",
          },
          { type: "formula", text: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ -1)" },
          { type: "formula", text: "∫eˣ dx = eˣ + C; ∫1/x dx = ln|x| + C" },
          {
            type: "formula",
            text: "Integration by parts: ∫u dv = uv - ∫v du (ILATE order)",
          },
          { type: "formula", text: "∫[a to b] f(x)dx = F(b) - F(a)" },
          {
            type: "concept",
            text: "ILATE: Inverse trig, Logarithm, Algebraic, Trigonometric, Exponential",
          },
          {
            type: "concept",
            text: "Substitution: let u = g(x), then du = g'(x)dx",
          },
          {
            type: "concept",
            text: "Even function integral from -a to a = 2×integral from 0 to a",
          },
          { type: "exam_q", text: "Q: Evaluate ∫x sin x dx" },
          { type: "exam_q", text: "Q: Find ∫[0 to π/2] sin²x dx" },
          {
            type: "summary",
            text: "Partial fractions: decompose rational function before integrating",
          },
          {
            type: "summary",
            text: "∫sin x = -cos x; ∫cos x = sin x; ∫sec²x = tan x",
          },
        ],
      },
    ],
    Science: [
      {
        name: "Electric Charges and Fields",
        fiveMinSummary:
          "Coulomb: F=kq₁q₂/r². E=F/q field. Gauss law: flux=q/ε₀. Dipole: p=qd. Field inside conductor=0. Charge quantized: q=ne.",
        points: [
          {
            type: "definition",
            text: "Electric charge: Fundamental property of matter; positive or negative",
          },
          {
            type: "formula",
            text: "Coulomb's law: F = kq₁q₂/r²; k = 9×10⁹ Nm²C⁻²",
          },
          { type: "formula", text: "Electric field: E = F/q₀ = kQ/r² N/C" },
          { type: "formula", text: "Gauss's law: ΦE = q_enc/ε₀" },
          {
            type: "concept",
            text: "Electric field lines: begin on +ve, end on -ve; never cross",
          },
          {
            type: "concept",
            text: "Conductor in equilibrium: E inside = 0; charge on surface",
          },
          { type: "exam_q", text: "Q: State and prove Gauss's law" },
          {
            type: "exam_q",
            text: "Q: Find electric field due to infinitely long charged wire",
          },
          {
            type: "summary",
            text: "Dipole: p = qd; torque in field: τ = pE sinθ",
          },
          {
            type: "summary",
            text: "Charge is conserved and quantized: q = ne, e = 1.6×10⁻¹⁹ C",
          },
        ],
      },
    ],
    "Social Science (SST)": [
      {
        name: "Globalisation and the Indian Economy",
        fiveMinSummary:
          "Globalisation: integration of economies through trade, investment, technology. MNCs invest globally. WTO oversees trade. Benefits: jobs, technology. Concerns: inequality, job displacement, cultural homogenization.",
        points: [
          {
            type: "definition",
            text: "Globalisation: Process of rapid integration and interconnection of countries through trade, investment, technology",
          },
          {
            type: "definition",
            text: "Multinational Corporation (MNC): Company with operations in multiple countries",
          },
          {
            type: "concept",
            text: "MNCs attract by: cheap labour, proximity to markets, favourable government policies",
          },
          {
            type: "concept",
            text: "Foreign investment by MNCs exceeds government aid to developing countries",
          },
          {
            type: "concept",
            text: "WTO (World Trade Organization): oversees international trade rules since 1995",
          },
          {
            type: "concept",
            text: "Special Economic Zones (SEZs): areas with special economic laws to attract foreign investment",
          },
          {
            type: "concept",
            text: "Liberalisation: Removal of trade barriers (tariffs, quotas) to allow free trade",
          },
          {
            type: "exam_q",
            text: "Q: How has globalisation affected workers in developing and developed countries?",
          },
          {
            type: "exam_q",
            text: "Q: What is the role of WTO in globalisation?",
          },
          {
            type: "summary",
            text: "Fair trade: ensures fair price and better conditions for producers in developing world",
          },
          {
            type: "summary",
            text: "India's IT, textiles, gems & jewellery benefited from globalisation",
          },
        ],
      },
    ],
  },
};

type RevisionFilter = RevisionPoint["type"] | "all";

const filterOptions: { value: RevisionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "definition", label: "Definitions" },
  { value: "formula", label: "Formulas" },
  { value: "concept", label: "Concepts" },
  { value: "exam_q", label: "Exam Qs" },
  { value: "summary", label: "Summaries" },
];

export default function QuickRevisionPage() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("10");
  const [selectedSubject, setSelectedSubject] =
    useState<Subject>("Mathematics");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [filter, setFilter] = useState<RevisionFilter>("all");
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem("revision_bookmarks") || "[]"),
      );
    } catch {
      return new Set();
    }
  });

  const classes: ClassLevel[] = ["10", "11", "12"];
  const subjects: Subject[] = [
    "Mathematics",
    "Science",
    "Social Science (SST)",
  ];

  const chapters = revisionData[selectedClass]?.[selectedSubject] || [];
  const chapter = chapters.find((c) => c.name === selectedChapter);

  const toggleBookmark = (key: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem("revision_bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  const filteredPoints = chapter
    ? chapter.points.filter(
        (p) =>
          (filter === "all" || p.type === filter) &&
          (!search || p.text.toLowerCase().includes(search.toLowerCase())),
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Quick Revision Mode</h1>
        <p className="text-muted-foreground">
          Key concepts, formulas, definitions and exam questions for Classes
          10–12
        </p>
      </div>

      {/* Class & Subject */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          {classes.map((cls) => (
            <Button
              key={cls}
              variant={selectedClass === cls ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedClass(cls);
                setSelectedChapter(null);
              }}
              data-ocid="revision.tab"
            >
              Class {cls}
            </Button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
          {subjects.map((sub) => (
            <Button
              key={sub}
              variant={selectedSubject === sub ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedSubject(sub);
                setSelectedChapter(null);
              }}
              data-ocid="revision.tab"
              className="shrink-0"
            >
              {sub}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapter list */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Chapters ({chapters.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {chapters.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4 text-center">
                  No chapters for this selection
                </p>
              ) : (
                chapters.map((ch) => (
                  <button
                    key={ch.name}
                    type="button"
                    onClick={() =>
                      setSelectedChapter(
                        selectedChapter === ch.name ? null : ch.name,
                      )
                    }
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-1 ${
                      selectedChapter === ch.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    data-ocid="revision.button"
                  >
                    <span className="truncate">{ch.name}</span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {!chapter ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-3">
              <Search className="w-8 h-8 opacity-40" />
              <div>
                <p className="font-medium">
                  Select a chapter to start revising
                </p>
                <p className="text-sm">
                  Chapter-wise definitions, formulas, and exam questions
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 5-min summary */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    5-Minute Revision — {chapter.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    {chapter.fiveMinSummary}
                  </p>
                </CardContent>
              </Card>

              {/* Filters & Search */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-40">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search points..."
                    className="pl-9 h-8 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-ocid="revision.search_input"
                  />
                  {search && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setSearch("")}
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {filterOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={filter === opt.value ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setFilter(opt.value)}
                      data-ocid="revision.tab"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Points */}
              <div className="space-y-2">
                {filteredPoints.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No results for this filter
                  </p>
                ) : (
                  filteredPoints.map((point, i) => {
                    const bookmarkKey = `${chapter.name}-${i}`;
                    return (
                      <Card
                        key={bookmarkKey}
                        className="group"
                        data-ocid="revision.card"
                      >
                        <CardContent className="py-3 px-4 flex items-start gap-3">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${typeColors[point.type]}`}
                          >
                            {typeLabels[point.type]}
                          </span>
                          <p className="flex-1 text-sm leading-relaxed">
                            {point.text}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 opacity-50 group-hover:opacity-100"
                            onClick={() => toggleBookmark(bookmarkKey)}
                            data-ocid="revision.toggle"
                          >
                            {bookmarks.has(bookmarkKey) ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Bookmarks section */}
              {bookmarks.size > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-primary" />
                    Bookmarked ({bookmarks.size})
                  </h3>
                  <div className="space-y-2">
                    {chapter.points
                      .map((p, i) => ({ p, i, key: `${chapter.name}-${i}` }))
                      .filter(({ key }) => bookmarks.has(key))
                      .map(({ p, key }) => (
                        <Card
                          key={key}
                          className="border-primary/30 bg-primary/5"
                        >
                          <CardContent className="py-2 px-4 flex items-start gap-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${typeColors[p.type]}`}
                            >
                              {typeLabels[p.type]}
                            </span>
                            <p className="flex-1 text-sm leading-relaxed">
                              {p.text}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={() => toggleBookmark(key)}
                              data-ocid="revision.toggle"
                            >
                              <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
