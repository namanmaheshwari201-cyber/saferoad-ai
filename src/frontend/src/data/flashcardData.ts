export interface Flashcard {
  id: number;
  front: string; // question
  back: string; // answer
  learned: boolean;
  difficult: boolean;
}

export interface FlashcardChapter {
  id: string;
  name: string;
  cards: Flashcard[];
}

export interface FlashcardSubject {
  id: string;
  name: string;
  chapters: FlashcardChapter[];
}

export interface FlashcardClass {
  id: string;
  label: string;
  subjects: FlashcardSubject[];
}

let _id = 1;
const card = (front: string, back: string): Flashcard => ({
  id: _id++,
  front,
  back,
  learned: false,
  difficult: false,
});

export const flashcardData: FlashcardClass[] = [
  {
    id: "class-10",
    label: "Class 10",
    subjects: [
      {
        id: "science-10",
        name: "Science",
        chapters: [
          {
            id: "life-processes",
            name: "Life Processes",
            cards: [
              card(
                "What is photosynthesis?",
                "The process by which green plants make food using sunlight, CO₂ and water. Equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
              ),
              card(
                "What is the role of mitochondria?",
                "Mitochondria are the powerhouse of the cell — they produce energy (ATP) through cellular respiration.",
              ),
              card(
                "What is the difference between aerobic and anaerobic respiration?",
                "Aerobic uses oxygen and produces CO₂ + water + energy. Anaerobic occurs without oxygen and produces lactic acid (in muscles) or ethanol + CO₂ (in yeast).",
              ),
              card(
                "What is osmoregulation?",
                "The process of maintaining the balance of water and salts in the body.",
              ),
            ],
          },
          {
            id: "chemical-reactions",
            name: "Chemical Reactions",
            cards: [
              card(
                "What is a chemical equation?",
                "A symbolic representation of a chemical reaction showing reactants on the left and products on the right, separated by an arrow.",
              ),
              card(
                "What is a combination reaction?",
                "A reaction where two or more substances combine to form a single product. Example: 2H₂ + O₂ → 2H₂O",
              ),
              card(
                "What is a decomposition reaction?",
                "A reaction where a single compound breaks down into two or more simpler substances. Example: 2H₂O → 2H₂ + O₂",
              ),
              card(
                "What is a redox reaction?",
                "A reaction involving both oxidation (loss of electrons) and reduction (gain of electrons) simultaneously.",
              ),
            ],
          },
          {
            id: "electricity",
            name: "Electricity",
            cards: [
              card(
                "What is Ohm's Law?",
                "V = IR. The voltage (V) across a conductor is directly proportional to the current (I) through it, given resistance (R) remains constant.",
              ),
              card("What is the SI unit of resistance?", "Ohm (Ω)"),
              card(
                "What is the difference between series and parallel circuits?",
                "In series, components share the same current; total resistance adds up. In parallel, components share the same voltage; total resistance decreases.",
              ),
            ],
          },
        ],
      },
      {
        id: "maths-10",
        name: "Mathematics",
        chapters: [
          {
            id: "real-numbers",
            name: "Real Numbers",
            cards: [
              card(
                "What is the Fundamental Theorem of Arithmetic?",
                "Every composite number can be expressed as a product of prime numbers in a unique way (ignoring order).",
              ),
              card(
                "What is HCF?",
                "Highest Common Factor — the largest number that divides two or more numbers without remainder.",
              ),
              card(
                "What is LCM?",
                "Lowest Common Multiple — the smallest number that is a multiple of two or more numbers.",
              ),
              card(
                "What is the relation between HCF and LCM?",
                "HCF × LCM = Product of the two numbers.",
              ),
            ],
          },
          {
            id: "quadratic-equations",
            name: "Quadratic Equations",
            cards: [
              card(
                "What is a quadratic equation?",
                "An equation of the form ax² + bx + c = 0 where a ≠ 0.",
              ),
              card(
                "What is the quadratic formula?",
                "x = (-b ± √(b²-4ac)) / 2a",
              ),
              card(
                "What is the discriminant?",
                "D = b² - 4ac. If D > 0: two real roots; D = 0: one real root; D < 0: no real roots.",
              ),
              card(
                "What is completing the square?",
                "A method to solve quadratic equations by rewriting ax² + bx + c in the form (x + p)² = q.",
              ),
            ],
          },
          {
            id: "triangles",
            name: "Triangles",
            cards: [
              card(
                "State the Basic Proportionality Theorem (BPT).",
                "If a line is drawn parallel to one side of a triangle, it divides the other two sides proportionally.",
              ),
              card(
                "What are similar triangles?",
                "Triangles with the same shape but different sizes — corresponding angles are equal and corresponding sides are proportional.",
              ),
              card(
                "State the Pythagoras Theorem.",
                "In a right-angled triangle, (hypotenuse)² = (base)² + (perpendicular)².",
              ),
            ],
          },
        ],
      },
      {
        id: "english-10",
        name: "English",
        chapters: [
          {
            id: "first-flight-prose",
            name: "First Flight - Prose",
            cards: [
              card("Who wrote 'A Letter to God'?", "G.L. Fuentes"),
              card(
                "What is the theme of 'Nelson Mandela: Long Walk to Freedom'?",
                "The struggle against apartheid and the meaning of freedom — that freedom is indivisible; the oppressor is also a prisoner.",
              ),
              card(
                "Who is Bholi and what is her story?",
                "Bholi is a girl who was considered slow and unattractive. Through education, she gains confidence and refuses an unfair marriage.",
              ),
            ],
          },
          {
            id: "first-flight-poetry",
            name: "First Flight - Poetry",
            cards: [
              card(
                "What is the central idea of 'Dust of Snow' by Robert Frost?",
                "A small moment — a crow shaking snow off a hemlock tree onto the poet — changed his mood and saved a day that had gone wrong.",
              ),
              card(
                "What does the fire represent in 'Fire and Ice'?",
                "Desire/passion — the poet suggests the world could end in fire (desire) or ice (hatred).",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "class-9",
    label: "Class 9",
    subjects: [
      {
        id: "science-9",
        name: "Science",
        chapters: [
          {
            id: "matter-surroundings",
            name: "Matter in Our Surroundings",
            cards: [
              card(
                "What are the three states of matter?",
                "Solid, liquid, and gas. They differ in arrangement and movement of particles.",
              ),
              card(
                "What is evaporation?",
                "The process by which liquid converts to vapour at its surface below its boiling point.",
              ),
              card(
                "What factors affect evaporation?",
                "Surface area, temperature, humidity, and wind speed.",
              ),
            ],
          },
          {
            id: "motion",
            name: "Motion",
            cards: [
              card(
                "What is the difference between distance and displacement?",
                "Distance is the total path length; displacement is the shortest straight-line distance between start and end points.",
              ),
              card(
                "What is uniform motion?",
                "When an object covers equal distances in equal time intervals.",
              ),
              card(
                "What is acceleration?",
                "Rate of change of velocity. a = (v - u) / t. Unit: m/s²",
              ),
            ],
          },
        ],
      },
      {
        id: "maths-9",
        name: "Mathematics",
        chapters: [
          {
            id: "number-systems",
            name: "Number Systems",
            cards: [
              card(
                "What are irrational numbers?",
                "Numbers that cannot be expressed as p/q where p, q are integers and q ≠ 0. Examples: √2, π.",
              ),
              card(
                "What is the decimal expansion of a rational number?",
                "Either terminating (e.g. 1/4 = 0.25) or non-terminating repeating (e.g. 1/3 = 0.333...).",
              ),
            ],
          },
          {
            id: "lines-angles",
            name: "Lines and Angles",
            cards: [
              card(
                "What are complementary angles?",
                "Two angles whose sum is 90°.",
              ),
              card(
                "What are supplementary angles?",
                "Two angles whose sum is 180°.",
              ),
              card(
                "What is the vertically opposite angles theorem?",
                "When two lines intersect, the vertically opposite angles are equal.",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "class-11",
    label: "Class 11",
    subjects: [
      {
        id: "physics-11",
        name: "Physics",
        chapters: [
          {
            id: "laws-of-motion",
            name: "Laws of Motion",
            cards: [
              card(
                "State Newton's First Law.",
                "A body remains at rest or in uniform motion unless acted upon by an external unbalanced force (Law of Inertia).",
              ),
              card(
                "State Newton's Second Law.",
                "Force = mass × acceleration. F = ma. The direction of force is the same as acceleration.",
              ),
              card(
                "State Newton's Third Law.",
                "For every action, there is an equal and opposite reaction. Forces always come in pairs.",
              ),
              card(
                "What is inertia?",
                "The tendency of an object to resist any change in its state of rest or motion.",
              ),
            ],
          },
          {
            id: "work-energy-power",
            name: "Work, Energy and Power",
            cards: [
              card(
                "What is work?",
                "W = F × d × cos θ. Work is done when a force causes displacement in the direction of force.",
              ),
              card(
                "What is kinetic energy?",
                "Energy possessed by a body due to its motion. KE = ½mv²",
              ),
              card(
                "What is potential energy?",
                "Energy possessed by a body due to its position or configuration. For gravity: PE = mgh",
              ),
              card(
                "State the law of conservation of energy.",
                "Energy can neither be created nor destroyed; it can only be converted from one form to another. Total energy remains constant.",
              ),
            ],
          },
        ],
      },
      {
        id: "chemistry-11",
        name: "Chemistry",
        chapters: [
          {
            id: "atomic-structure",
            name: "Atomic Structure",
            cards: [
              card(
                "What is an atom?",
                "The smallest unit of an element that retains its chemical properties.",
              ),
              card(
                "What are isotopes?",
                "Atoms of the same element with same atomic number but different mass numbers (different neutrons).",
              ),
              card(
                "What is the Bohr model of the atom?",
                "Electrons revolve around the nucleus in fixed circular orbits (shells). Energy is absorbed/emitted when electrons jump between shells.",
              ),
            ],
          },
          {
            id: "chemical-bonding",
            name: "Chemical Bonding",
            cards: [
              card(
                "What is ionic bonding?",
                "The electrostatic attraction between oppositely charged ions formed by transfer of electrons. Example: NaCl.",
              ),
              card(
                "What is covalent bonding?",
                "A chemical bond formed by sharing of electron pairs between atoms. Example: H₂O, CO₂.",
              ),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "class-12",
    label: "Class 12",
    subjects: [
      {
        id: "maths-12",
        name: "Mathematics",
        chapters: [
          {
            id: "relations-functions",
            name: "Relations and Functions",
            cards: [
              card(
                "What is a function?",
                "A relation where every element of the domain has exactly one image in the codomain.",
              ),
              card(
                "What is a bijective function?",
                "A function that is both injective (one-to-one) and surjective (onto).",
              ),
              card(
                "What is an inverse function?",
                "If f: A → B is bijective, then f⁻¹: B → A such that f⁻¹(f(x)) = x.",
              ),
            ],
          },
          {
            id: "differentiation",
            name: "Calculus - Differentiation",
            cards: [
              card(
                "What is a derivative?",
                "The derivative of f(x) gives the rate of change of f with respect to x. It represents the slope of the tangent at a point.",
              ),
              card(
                "What is the chain rule?",
                "d/dx[f(g(x))] = f'(g(x)) × g'(x)",
              ),
              card("What is the product rule?", "d/dx[u·v] = u'v + uv'"),
            ],
          },
        ],
      },
      {
        id: "physics-12",
        name: "Physics",
        chapters: [
          {
            id: "electrostatics",
            name: "Electrostatics",
            cards: [
              card(
                "What is Coulomb's Law?",
                "F = kq₁q₂/r². The force between two point charges is proportional to the product of charges and inversely proportional to the square of distance.",
              ),
              card(
                "What is electric potential?",
                "The work done per unit charge to bring a test charge from infinity to a point. V = W/q. Unit: Volt.",
              ),
              card(
                "What is a capacitor?",
                "A device that stores electrical energy in the form of an electric field between two conducting plates.",
              ),
            ],
          },
          {
            id: "current-electricity",
            name: "Current Electricity",
            cards: [
              card(
                "What is Kirchhoff's Current Law?",
                "The sum of currents entering a junction equals the sum of currents leaving it (conservation of charge).",
              ),
              card(
                "What is Kirchhoff's Voltage Law?",
                "The sum of all voltages around a closed loop equals zero (conservation of energy).",
              ),
            ],
          },
        ],
      },
    ],
  },
];
