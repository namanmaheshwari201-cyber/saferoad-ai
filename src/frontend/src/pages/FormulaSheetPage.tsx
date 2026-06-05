import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, BookmarkCheck, ChevronRight, Search, X } from "lucide-react";
import { useState } from "react";

type ClassLevel = "10" | "11" | "12";
type Subject = "Mathematics" | "Science";

interface Formula {
  id: string;
  formula: string;
  description: string;
}

interface Chapter {
  name: string;
  formulas: Formula[];
}

const mathData: Record<ClassLevel, Chapter[]> = {
  "10": [
    {
      name: "Real Numbers",
      formulas: [
        {
          id: "m10-rn-1",
          formula: "Euclid's Division Lemma: a = bq + r, 0 ≤ r < b",
          description: "For any two positive integers a and b",
        },
        {
          id: "m10-rn-2",
          formula: "HCF(a,b) × LCM(a,b) = a × b",
          description: "Product of HCF and LCM equals product of two numbers",
        },
        {
          id: "m10-rn-3",
          formula: "√2, √3, √5 are irrational numbers",
          description: "Square roots of non-perfect squares are irrational",
        },
        {
          id: "m10-rn-4",
          formula: "Terminating decimal: q = 2ⁿ × 5ᵐ",
          description:
            "p/q is terminating if q has only 2 and 5 as prime factors",
        },
        {
          id: "m10-rn-5",
          formula: "log(ab) = log a + log b",
          description: "Logarithm of product",
        },
        {
          id: "m10-rn-6",
          formula: "log(a/b) = log a - log b",
          description: "Logarithm of quotient",
        },
        {
          id: "m10-rn-7",
          formula: "log(aⁿ) = n log a",
          description: "Logarithm of power",
        },
        {
          id: "m10-rn-8",
          formula:
            "Fundamental Theorem of Arithmetic: Every composite number has a unique prime factorization",
          description: "Unique prime factorization theorem",
        },
        {
          id: "m10-rn-9",
          formula: "Prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...",
          description: "First few prime numbers",
        },
        {
          id: "m10-rn-10",
          formula: "Number of factors of n = p^a × q^b = (a+1)(b+1)",
          description: "Formula to find total number of factors",
        },
        {
          id: "m10-rn-11",
          formula:
            "HCF by prime factorization: take lowest powers of common primes",
          description: "Method to find HCF",
        },
        {
          id: "m10-rn-12",
          formula:
            "LCM by prime factorization: take highest powers of all primes",
          description: "Method to find LCM",
        },
        {
          id: "m10-rn-13",
          formula: "√(a × b) = √a × √b",
          description: "Product rule for square roots",
        },
        {
          id: "m10-rn-14",
          formula: "√(a/b) = √a / √b",
          description: "Quotient rule for square roots",
        },
        {
          id: "m10-rn-15",
          formula: "Rational number: can be expressed as p/q where q ≠ 0",
          description: "Definition of rational number",
        },
      ],
    },
    {
      name: "Polynomials",
      formulas: [
        {
          id: "m10-poly-1",
          formula: "Sum of zeroes: α + β = -b/a",
          description: "For quadratic ax² + bx + c",
        },
        {
          id: "m10-poly-2",
          formula: "Product of zeroes: α × β = c/a",
          description: "For quadratic ax² + bx + c",
        },
        {
          id: "m10-poly-3",
          formula: "Quadratic with zeroes: x² - (α+β)x + αβ",
          description: "Form a quadratic from its zeroes",
        },
        {
          id: "m10-poly-4",
          formula: "Cubic sum of zeroes: α+β+γ = -b/a",
          description: "For cubic ax³ + bx² + cx + d",
        },
        {
          id: "m10-poly-5",
          formula: "Cubic sum of products: αβ+βγ+γα = c/a",
          description: "For cubic polynomial",
        },
        {
          id: "m10-poly-6",
          formula: "Cubic product of zeroes: αβγ = -d/a",
          description: "For cubic polynomial",
        },
        {
          id: "m10-poly-7",
          formula: "Degree of polynomial = highest power of variable",
          description: "Definition of degree",
        },
        {
          id: "m10-poly-8",
          formula: "Dividend = Divisor × Quotient + Remainder",
          description: "Division algorithm for polynomials",
        },
        {
          id: "m10-poly-9",
          formula: "(a+b)² = a² + 2ab + b²",
          description: "Square of sum identity",
        },
        {
          id: "m10-poly-10",
          formula: "(a-b)² = a² - 2ab + b²",
          description: "Square of difference identity",
        },
        {
          id: "m10-poly-11",
          formula: "(a+b)(a-b) = a² - b²",
          description: "Difference of squares",
        },
        {
          id: "m10-poly-12",
          formula: "(a+b)³ = a³ + 3a²b + 3ab² + b³",
          description: "Cube of sum",
        },
        {
          id: "m10-poly-13",
          formula: "(a-b)³ = a³ - 3a²b + 3ab² - b³",
          description: "Cube of difference",
        },
        {
          id: "m10-poly-14",
          formula: "a³ + b³ = (a+b)(a²-ab+b²)",
          description: "Sum of cubes factorization",
        },
        {
          id: "m10-poly-15",
          formula: "a³ - b³ = (a-b)(a²+ab+b²)",
          description: "Difference of cubes factorization",
        },
      ],
    },
    {
      name: "Quadratic Equations",
      formulas: [
        {
          id: "m10-qe-1",
          formula: "Quadratic formula: x = [-b ± √(b²-4ac)] / 2a",
          description: "General solution of ax² + bx + c = 0",
        },
        {
          id: "m10-qe-2",
          formula: "Discriminant: D = b² - 4ac",
          description: "Determines nature of roots",
        },
        {
          id: "m10-qe-3",
          formula: "D > 0: two distinct real roots",
          description: "Nature of roots when D > 0",
        },
        {
          id: "m10-qe-4",
          formula: "D = 0: two equal real roots",
          description: "Nature of roots when D = 0",
        },
        {
          id: "m10-qe-5",
          formula: "D < 0: no real roots (complex roots)",
          description: "Nature of roots when D < 0",
        },
        {
          id: "m10-qe-6",
          formula: "Equal roots: x = -b/2a",
          description: "When discriminant is zero",
        },
        {
          id: "m10-qe-7",
          formula: "Sum of roots: α + β = -b/a",
          description: "Sum of roots relation",
        },
        {
          id: "m10-qe-8",
          formula: "Product of roots: αβ = c/a",
          description: "Product of roots relation",
        },
        {
          id: "m10-qe-9",
          formula: "Standard form: ax² + bx + c = 0, a ≠ 0",
          description: "Standard form of quadratic equation",
        },
        {
          id: "m10-qe-10",
          formula: "Factorization method: split b as sum of factors of ac",
          description: "Middle term splitting",
        },
        {
          id: "m10-qe-11",
          formula: "Completing the square: x² + bx = (x + b/2)² - (b/2)²",
          description: "Method to solve quadratics",
        },
        {
          id: "m10-qe-12",
          formula: "If α is a root, aα² + bα + c = 0",
          description: "Root substitution property",
        },
        {
          id: "m10-qe-13",
          formula: "Quadratic whose roots are 1/α, 1/β: cx² + bx + a = 0",
          description: "Reciprocal roots",
        },
        {
          id: "m10-qe-14",
          formula: "Quadratic with roots (α+k),(β+k): replace x by (x-k)",
          description: "Shifted roots",
        },
        {
          id: "m10-qe-15",
          formula:
            "Every quadratic has exactly 2 roots (counting multiplicity)",
          description: "Fundamental theorem applied to degree 2",
        },
      ],
    },
    {
      name: "Arithmetic Progressions",
      formulas: [
        {
          id: "m10-ap-1",
          formula: "General term: aₙ = a + (n-1)d",
          description: "nth term of AP",
        },
        {
          id: "m10-ap-2",
          formula: "Sum: Sₙ = n/2 [2a + (n-1)d]",
          description: "Sum of n terms",
        },
        {
          id: "m10-ap-3",
          formula: "Sum: Sₙ = n/2 [a + l]",
          description: "Sum using first and last term",
        },
        {
          id: "m10-ap-4",
          formula: "Common difference: d = aₙ - aₙ₋₁",
          description: "Difference between consecutive terms",
        },
        {
          id: "m10-ap-5",
          formula: "If l = last term: aₙ = l, n = (l-a)/d + 1",
          description: "Number of terms formula",
        },
        {
          id: "m10-ap-6",
          formula: "Middle term of AP with n terms (n odd) = (n+1)/2 th term",
          description: "Middle term",
        },
        {
          id: "m10-ap-7",
          formula: "Sum of first n natural numbers: n(n+1)/2",
          description: "Special AP sum",
        },
        {
          id: "m10-ap-8",
          formula: "Sum of first n odd numbers: n²",
          description: "Odd numbers AP sum",
        },
        {
          id: "m10-ap-9",
          formula: "Sum of first n even numbers: n(n+1)",
          description: "Even numbers AP sum",
        },
        {
          id: "m10-ap-10",
          formula: "Three terms in AP: a-d, a, a+d",
          description: "Convenient form for 3 terms",
        },
        {
          id: "m10-ap-11",
          formula: "Four terms in AP: a-3d, a-d, a+d, a+3d",
          description: "Convenient form for 4 terms",
        },
        {
          id: "m10-ap-12",
          formula: "Arithmetic mean between a and b: (a+b)/2",
          description: "AM between two numbers",
        },
        {
          id: "m10-ap-13",
          formula: "aₙ = Sₙ - Sₙ₋₁ (for n > 1)",
          description: "nth term from sum",
        },
        {
          id: "m10-ap-14",
          formula: "AP condition: 2b = a + c (three terms a, b, c in AP)",
          description: "Condition for AP",
        },
        {
          id: "m10-ap-15",
          formula: "Sum of squares of first n naturals: n(n+1)(2n+1)/6",
          description: "Sum of squares",
        },
      ],
    },
    {
      name: "Triangles",
      formulas: [
        {
          id: "m10-tri-1",
          formula:
            "Basic Proportionality Theorem (Thales): DE ∥ BC ⟹ AD/DB = AE/EC",
          description: "BPT theorem",
        },
        {
          id: "m10-tri-2",
          formula: "AAA similarity criterion: all three angles equal",
          description: "Angle-Angle-Angle",
        },
        {
          id: "m10-tri-3",
          formula: "AA similarity: two angles equal ⟹ triangles similar",
          description: "Angle-Angle criterion",
        },
        {
          id: "m10-tri-4",
          formula: "SSS similarity: all three sides proportional",
          description: "Side-Side-Side criterion",
        },
        {
          id: "m10-tri-5",
          formula:
            "SAS similarity: two sides proportional and included angle equal",
          description: "Side-Angle-Side",
        },
        {
          id: "m10-tri-6",
          formula:
            "Ratio of areas of similar triangles = (ratio of corresponding sides)²",
          description: "Area ratio for similar triangles",
        },
        {
          id: "m10-tri-7",
          formula: "Pythagoras: a² + b² = c² (right triangle)",
          description: "Pythagorean theorem",
        },
        {
          id: "m10-tri-8",
          formula: "Converse Pythagoras: if a²+b²=c², angle C = 90°",
          description: "Converse of Pythagoras",
        },
        {
          id: "m10-tri-9",
          formula: "Altitude on hypotenuse: h² = p × q (geometric mean)",
          description: "Altitude relation",
        },
        {
          id: "m10-tri-10",
          formula: "Perimeter ratio of similar triangles = ratio of sides",
          description: "Perimeter of similar triangles",
        },
        {
          id: "m10-tri-11",
          formula: "Median divides triangle into two equal area triangles",
          description: "Median property",
        },
        {
          id: "m10-tri-12",
          formula: "Sum of angles in triangle = 180°",
          description: "Angle sum property",
        },
        {
          id: "m10-tri-13",
          formula: "Exterior angle = sum of two non-adjacent interior angles",
          description: "Exterior angle theorem",
        },
        {
          id: "m10-tri-14",
          formula: "Triangle inequality: a + b > c",
          description: "Sum of two sides > third side",
        },
        {
          id: "m10-tri-15",
          formula: "Area = (1/2) × base × height",
          description: "Area of triangle",
        },
      ],
    },
    {
      name: "Coordinate Geometry",
      formulas: [
        {
          id: "m10-cg-1",
          formula: "Distance: d = √[(x₂-x₁)² + (y₂-y₁)²]",
          description: "Distance between two points",
        },
        {
          id: "m10-cg-2",
          formula: "Midpoint: M = [(x₁+x₂)/2, (y₁+y₂)/2]",
          description: "Midpoint of line segment",
        },
        {
          id: "m10-cg-3",
          formula:
            "Section formula (internal): x = (mx₂+nx₁)/(m+n), y = (my₂+ny₁)/(m+n)",
          description: "Point dividing in ratio m:n",
        },
        {
          id: "m10-cg-4",
          formula: "Area of triangle: |x₁(y₂-y₃)+x₂(y₃-y₁)+x₃(y₁-y₂)|/2",
          description: "Area using coordinates",
        },
        {
          id: "m10-cg-5",
          formula: "Slope: m = (y₂-y₁)/(x₂-x₁)",
          description: "Slope of line",
        },
        {
          id: "m10-cg-6",
          formula: "Collinearity: Area = 0 for three collinear points",
          description: "Condition for collinearity",
        },
        {
          id: "m10-cg-7",
          formula: "Centroid: G = [(x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3]",
          description: "Centroid of triangle",
        },
        {
          id: "m10-cg-8",
          formula: "External division: x = (mx₂-nx₁)/(m-n)",
          description: "External section formula",
        },
        {
          id: "m10-cg-9",
          formula: "Origin distance: d = √(x² + y²)",
          description: "Distance from origin",
        },
        {
          id: "m10-cg-10",
          formula: "Slope-intercept: y = mx + c",
          description: "Equation of line",
        },
        {
          id: "m10-cg-11",
          formula: "Point-slope: y - y₁ = m(x - x₁)",
          description: "Line through a point",
        },
        {
          id: "m10-cg-12",
          formula: "Two-point form: (y-y₁)/(y₂-y₁) = (x-x₁)/(x₂-x₁)",
          description: "Line through two points",
        },
        {
          id: "m10-cg-13",
          formula: "Intercept form: x/a + y/b = 1",
          description: "Line with intercepts a and b",
        },
        {
          id: "m10-cg-14",
          formula: "Parallel lines: same slope (m₁ = m₂)",
          description: "Condition for parallel lines",
        },
        {
          id: "m10-cg-15",
          formula: "Perpendicular lines: m₁ × m₂ = -1",
          description: "Condition for perpendicular lines",
        },
      ],
    },
    {
      name: "Introduction to Trigonometry",
      formulas: [
        {
          id: "m10-trig-1",
          formula: "sin θ = Opposite/Hypotenuse",
          description: "Definition of sine",
        },
        {
          id: "m10-trig-2",
          formula: "cos θ = Adjacent/Hypotenuse",
          description: "Definition of cosine",
        },
        {
          id: "m10-trig-3",
          formula: "tan θ = Opposite/Adjacent = sin θ/cos θ",
          description: "Definition of tangent",
        },
        {
          id: "m10-trig-4",
          formula: "cosec θ = 1/sin θ",
          description: "Cosecant definition",
        },
        {
          id: "m10-trig-5",
          formula: "sec θ = 1/cos θ",
          description: "Secant definition",
        },
        {
          id: "m10-trig-6",
          formula: "cot θ = 1/tan θ = cos θ/sin θ",
          description: "Cotangent definition",
        },
        {
          id: "m10-trig-7",
          formula: "sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3",
          description: "30° values",
        },
        {
          id: "m10-trig-8",
          formula: "sin 45° = 1/√2, cos 45° = 1/√2, tan 45° = 1",
          description: "45° values",
        },
        {
          id: "m10-trig-9",
          formula: "sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3",
          description: "60° values",
        },
        {
          id: "m10-trig-10",
          formula: "sin 0° = 0, cos 0° = 1, sin 90° = 1, cos 90° = 0",
          description: "Extreme values",
        },
        {
          id: "m10-trig-11",
          formula: "sin²θ + cos²θ = 1",
          description: "Pythagorean identity",
        },
        {
          id: "m10-trig-12",
          formula: "1 + tan²θ = sec²θ",
          description: "Second Pythagorean identity",
        },
        {
          id: "m10-trig-13",
          formula: "1 + cot²θ = cosec²θ",
          description: "Third Pythagorean identity",
        },
        {
          id: "m10-trig-14",
          formula: "sin(90°-θ) = cos θ, cos(90°-θ) = sin θ",
          description: "Complementary angle",
        },
        {
          id: "m10-trig-15",
          formula: "tan(90°-θ) = cot θ, cot(90°-θ) = tan θ",
          description: "Complementary angle for tan",
        },
      ],
    },
    {
      name: "Circles",
      formulas: [
        {
          id: "m10-cir-1",
          formula: "Tangent is perpendicular to radius at point of contact",
          description: "Tangent-radius theorem",
        },
        {
          id: "m10-cir-2",
          formula: "Two tangents from external point are equal in length",
          description: "Equal tangents theorem",
        },
        {
          id: "m10-cir-3",
          formula: "Tangent-secant: PT² = PA × PB",
          description: "Power of a point",
        },
        {
          id: "m10-cir-4",
          formula: "Angle in semicircle = 90°",
          description: "Thales theorem",
        },
        {
          id: "m10-cir-5",
          formula: "Angle at center = 2 × angle at circumference",
          description: "Central angle theorem",
        },
        {
          id: "m10-cir-6",
          formula: "Angles in same segment are equal",
          description: "Inscribed angle theorem",
        },
        {
          id: "m10-cir-7",
          formula: "Sum of opposite angles of cyclic quadrilateral = 180°",
          description: "Cyclic quadrilateral property",
        },
        {
          id: "m10-cir-8",
          formula: "Circumference = 2πr",
          description: "Circumference formula",
        },
        {
          id: "m10-cir-9",
          formula: "Area = πr²",
          description: "Area of circle",
        },
        {
          id: "m10-cir-10",
          formula: "Arc length = (θ/360) × 2πr",
          description: "Length of arc",
        },
        {
          id: "m10-cir-11",
          formula: "Area of sector = (θ/360) × πr²",
          description: "Area of sector",
        },
        {
          id: "m10-cir-12",
          formula: "Area of segment = Area of sector - Area of triangle",
          description: "Area of minor segment",
        },
        {
          id: "m10-cir-13",
          formula: "Chord perpendicular from center bisects the chord",
          description: "Perpendicular from center",
        },
        {
          id: "m10-cir-14",
          formula: "Equal chords are equidistant from center",
          description: "Equal chords theorem",
        },
        {
          id: "m10-cir-15",
          formula: "If OP ⊥ AB (chord), then AP = PB",
          description: "Bisection of chord",
        },
      ],
    },
    {
      name: "Surface Areas and Volumes",
      formulas: [
        {
          id: "m10-sav-1",
          formula: "Cube: SA = 6a², V = a³",
          description: "Cube surface area and volume",
        },
        {
          id: "m10-sav-2",
          formula: "Cuboid: SA = 2(lb+bh+hl), V = lbh",
          description: "Cuboid formulas",
        },
        {
          id: "m10-sav-3",
          formula: "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h",
          description: "Cylinder formulas",
        },
        {
          id: "m10-sav-4",
          formula: "Cone: CSA = πrl, TSA = πr(r+l), V = (1/3)πr²h",
          description: "Cone formulas",
        },
        {
          id: "m10-sav-5",
          formula: "Cone slant height: l = √(r² + h²)",
          description: "Slant height of cone",
        },
        {
          id: "m10-sav-6",
          formula: "Sphere: SA = 4πr², V = (4/3)πr³",
          description: "Sphere formulas",
        },
        {
          id: "m10-sav-7",
          formula: "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³",
          description: "Hemisphere formulas",
        },
        {
          id: "m10-sav-8",
          formula: "Frustum: CSA = π(r₁+r₂)l, V = (πh/3)(r₁²+r₂²+r₁r₂)",
          description: "Frustum formulas",
        },
        {
          id: "m10-sav-9",
          formula: "Frustum slant height: l = √[h² + (r₁-r₂)²]",
          description: "Slant height of frustum",
        },
        {
          id: "m10-sav-10",
          formula: "TSA of frustum: π(r₁+r₂)l + π(r₁²+r₂²)",
          description: "Total surface area of frustum",
        },
        {
          id: "m10-sav-11",
          formula: "Diagonal of cuboid: √(l²+b²+h²)",
          description: "Space diagonal",
        },
        {
          id: "m10-sav-12",
          formula: "Diagonal of cube: a√3",
          description: "Diagonal of cube",
        },
        {
          id: "m10-sav-13",
          formula: "Volume of combined solid = sum of individual volumes",
          description: "Combined solids",
        },
        {
          id: "m10-sav-14",
          formula: "Volume of hollow cylinder: π(R²-r²)h",
          description: "Hollow cylinder",
        },
        {
          id: "m10-sav-15",
          formula: "π ≈ 22/7 ≈ 3.14159",
          description: "Value of pi",
        },
      ],
    },
    {
      name: "Statistics",
      formulas: [
        {
          id: "m10-stat-1",
          formula: "Mean (Direct): x̄ = Σfᵢxᵢ / Σfᵢ",
          description: "Direct method for mean",
        },
        {
          id: "m10-stat-2",
          formula: "Mean (Assumed): x̄ = a + Σfᵢdᵢ/Σfᵢ, dᵢ = xᵢ - a",
          description: "Assumed mean method",
        },
        {
          id: "m10-stat-3",
          formula: "Mean (Step deviation): x̄ = a + (Σfᵢuᵢ/Σfᵢ) × h",
          description: "Step deviation method",
        },
        {
          id: "m10-stat-4",
          formula: "Median = l + [(n/2 - cf)/f] × h",
          description: "Median of grouped data",
        },
        {
          id: "m10-stat-5",
          formula: "Mode = l + [(f₁-f₀)/(2f₁-f₀-f₂)] × h",
          description: "Mode of grouped data",
        },
        {
          id: "m10-stat-6",
          formula: "Empirical relation: Mode = 3 Median - 2 Mean",
          description: "Relationship between measures",
        },
        {
          id: "m10-stat-7",
          formula: "Cumulative frequency: running total of frequencies",
          description: "CF definition",
        },
        {
          id: "m10-stat-8",
          formula: "Class mark = (upper limit + lower limit)/2",
          description: "Mid-value of class",
        },
        {
          id: "m10-stat-9",
          formula: "Class width h = upper class limit - lower class limit",
          description: "Class size",
        },
        {
          id: "m10-stat-10",
          formula: "Range = Maximum value - Minimum value",
          description: "Range of data",
        },
        {
          id: "m10-stat-11",
          formula: "n = Σfᵢ (total frequency)",
          description: "Total of all frequencies",
        },
        {
          id: "m10-stat-12",
          formula:
            "Ogive: graph of cumulative frequency vs upper class boundary",
          description: "Cumulative frequency graph",
        },
        {
          id: "m10-stat-13",
          formula: "Median from ogive: value at n/2 on CF axis",
          description: "Graphical median",
        },
        {
          id: "m10-stat-14",
          formula: "Modal class: class with highest frequency",
          description: "Identifying modal class",
        },
        {
          id: "m10-stat-15",
          formula: "Median class: class where cumulative frequency ≥ n/2",
          description: "Identifying median class",
        },
      ],
    },
    {
      name: "Probability",
      formulas: [
        {
          id: "m10-prob-1",
          formula: "P(E) = Number of favourable outcomes / Total outcomes",
          description: "Classical probability",
        },
        {
          id: "m10-prob-2",
          formula: "0 ≤ P(E) ≤ 1",
          description: "Range of probability",
        },
        {
          id: "m10-prob-3",
          formula: "P(E) + P(Ē) = 1",
          description: "Complementary events",
        },
        {
          id: "m10-prob-4",
          formula: "P(impossible event) = 0",
          description: "Impossible event",
        },
        {
          id: "m10-prob-5",
          formula: "P(certain event) = 1",
          description: "Certain event",
        },
        {
          id: "m10-prob-6",
          formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
          description: "Addition rule",
        },
        {
          id: "m10-prob-7",
          formula: "P(A ∩ B) = 0 for mutually exclusive events",
          description: "Mutually exclusive",
        },
        {
          id: "m10-prob-8",
          formula: "P(A ∪ B) = P(A) + P(B) for mutually exclusive",
          description: "Addition for ME events",
        },
        {
          id: "m10-prob-9",
          formula: "Sample space of a coin: {H, T}",
          description: "Coin sample space",
        },
        {
          id: "m10-prob-10",
          formula: "Sample space of a die: {1,2,3,4,5,6}",
          description: "Die sample space",
        },
        {
          id: "m10-prob-11",
          formula: "P(head) = P(tail) = 1/2 for fair coin",
          description: "Fair coin probability",
        },
        {
          id: "m10-prob-12",
          formula: "P(any face of die) = 1/6",
          description: "Fair die probability",
        },
        {
          id: "m10-prob-13",
          formula: "Total outcomes for n coins = 2ⁿ",
          description: "Outcomes for coins",
        },
        {
          id: "m10-prob-14",
          formula: "Total outcomes for two dice = 36",
          description: "Two dice outcomes",
        },
        {
          id: "m10-prob-15",
          formula:
            "Experimental probability = frequency of event / total trials",
          description: "Empirical probability",
        },
      ],
    },
  ],
  "11": [
    {
      name: "Sets",
      formulas: [
        {
          id: "m11-set-1",
          formula: "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
          description: "Union formula",
        },
        {
          id: "m11-set-2",
          formula:
            "n(A ∪ B ∪ C) = n(A)+n(B)+n(C)-n(A∩B)-n(B∩C)-n(A∩C)+n(A∩B∩C)",
          description: "Three sets union",
        },
        {
          id: "m11-set-3",
          formula: "A ∪ B = {x : x ∈ A or x ∈ B}",
          description: "Union definition",
        },
        {
          id: "m11-set-4",
          formula: "A ∩ B = {x : x ∈ A and x ∈ B}",
          description: "Intersection definition",
        },
        {
          id: "m11-set-5",
          formula: "A' = {x : x ∈ U, x ∉ A}",
          description: "Complement definition",
        },
        {
          id: "m11-set-6",
          formula: "De Morgan's: (A ∪ B)' = A' ∩ B'",
          description: "De Morgan's first law",
        },
        {
          id: "m11-set-7",
          formula: "De Morgan's: (A ∩ B)' = A' ∪ B'",
          description: "De Morgan's second law",
        },
        {
          id: "m11-set-8",
          formula: "Power set P(A): set of all subsets of A",
          description: "Power set definition",
        },
        {
          id: "m11-set-9",
          formula: "If |A| = n, then |P(A)| = 2ⁿ",
          description: "Number of subsets",
        },
        {
          id: "m11-set-10",
          formula: "A - B = A ∩ B' = {x : x ∈ A, x ∉ B}",
          description: "Set difference",
        },
        {
          id: "m11-set-11",
          formula: "A × B = {(a,b) : a ∈ A, b ∈ B}",
          description: "Cartesian product",
        },
        {
          id: "m11-set-12",
          formula: "|A × B| = |A| × |B|",
          description: "Number of elements in Cartesian product",
        },
        {
          id: "m11-set-13",
          formula: "Subset: A ⊆ B iff every element of A is in B",
          description: "Subset definition",
        },
        {
          id: "m11-set-14",
          formula: "n(A only) = n(A) - n(A ∩ B)",
          description: "Elements only in A",
        },
        {
          id: "m11-set-15",
          formula: "Equal sets: A = B iff A ⊆ B and B ⊆ A",
          description: "Equality of sets",
        },
      ],
    },
    {
      name: "Trigonometric Functions",
      formulas: [
        {
          id: "m11-trig-1",
          formula: "sin²x + cos²x = 1",
          description: "Fundamental identity",
        },
        {
          id: "m11-trig-2",
          formula: "1 + tan²x = sec²x",
          description: "Second identity",
        },
        {
          id: "m11-trig-3",
          formula: "1 + cot²x = cosec²x",
          description: "Third identity",
        },
        {
          id: "m11-trig-4",
          formula: "sin(A+B) = sinA cosB + cosA sinB",
          description: "Addition formula",
        },
        {
          id: "m11-trig-5",
          formula: "cos(A+B) = cosA cosB - sinA sinB",
          description: "Cosine addition",
        },
        {
          id: "m11-trig-6",
          formula: "tan(A+B) = (tanA+tanB)/(1-tanA tanB)",
          description: "Tangent addition",
        },
        {
          id: "m11-trig-7",
          formula: "sin 2A = 2 sinA cosA",
          description: "Double angle sine",
        },
        {
          id: "m11-trig-8",
          formula: "cos 2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A",
          description: "Double angle cosine",
        },
        {
          id: "m11-trig-9",
          formula: "tan 2A = 2tanA/(1-tan²A)",
          description: "Double angle tangent",
        },
        {
          id: "m11-trig-10",
          formula: "sin 3A = 3sinA - 4sin³A",
          description: "Triple angle sine",
        },
        {
          id: "m11-trig-11",
          formula: "cos 3A = 4cos³A - 3cosA",
          description: "Triple angle cosine",
        },
        {
          id: "m11-trig-12",
          formula: "sinC + sinD = 2sin[(C+D)/2]cos[(C-D)/2]",
          description: "Sum to product",
        },
        {
          id: "m11-trig-13",
          formula: "cosC + cosD = 2cos[(C+D)/2]cos[(C-D)/2]",
          description: "Sum to product cosine",
        },
        {
          id: "m11-trig-14",
          formula: "2sinA cosB = sin(A+B) + sin(A-B)",
          description: "Product to sum",
        },
        {
          id: "m11-trig-15",
          formula: "Period of sin and cos = 2π; period of tan and cot = π",
          description: "Periods",
        },
      ],
    },
    {
      name: "Permutations and Combinations",
      formulas: [
        {
          id: "m11-pc-1",
          formula: "nPr = n!/(n-r)!",
          description: "Permutation formula",
        },
        {
          id: "m11-pc-2",
          formula: "nCr = n!/[r!(n-r)!]",
          description: "Combination formula",
        },
        {
          id: "m11-pc-3",
          formula: "nCr = nCn-r",
          description: "Symmetry of combinations",
        },
        { id: "m11-pc-4", formula: "nC0 = nCn = 1", description: "Edge cases" },
        {
          id: "m11-pc-5",
          formula: "nPr = r! × nCr",
          description: "Relation between P and C",
        },
        {
          id: "m11-pc-6",
          formula: "n! = n × (n-1)!",
          description: "Factorial recursion",
        },
        { id: "m11-pc-7", formula: "0! = 1", description: "Zero factorial" },
        {
          id: "m11-pc-8",
          formula: "nCr + nCr-1 = (n+1)Cr",
          description: "Pascal's identity",
        },
        {
          id: "m11-pc-9",
          formula: "Arrangements of n things with p alike, q alike: n!/(p!q!)",
          description: "Multinomial permutation",
        },
        {
          id: "m11-pc-10",
          formula: "Circular permutations = (n-1)!",
          description: "Circular arrangement",
        },
        {
          id: "m11-pc-11",
          formula: "Total subsets of n-element set = 2ⁿ",
          description: "Subsets count",
        },
        {
          id: "m11-pc-12",
          formula: "Σ nCr = 2ⁿ (sum for r = 0 to n)",
          description: "Sum of combinations",
        },
        { id: "m11-pc-13", formula: "nC1 = n", description: "Choose one" },
        {
          id: "m11-pc-14",
          formula: "Fundamental counting: m × n ways for m and n choices",
          description: "Multiplication principle",
        },
        {
          id: "m11-pc-15",
          formula:
            "Arrangements with restrictions: fix restricted, arrange rest",
          description: "Permutations with restrictions",
        },
      ],
    },
    {
      name: "Binomial Theorem",
      formulas: [
        {
          id: "m11-bt-1",
          formula: "(a+b)ⁿ = Σ nCr × aⁿ⁻ʳ × bʳ (r=0 to n)",
          description: "Binomial expansion",
        },
        {
          id: "m11-bt-2",
          formula: "General term: Tr+1 = nCr × aⁿ⁻ʳ × bʳ",
          description: "(r+1)th term",
        },
        {
          id: "m11-bt-3",
          formula: "Number of terms in (a+b)ⁿ = n+1",
          description: "Total terms",
        },
        {
          id: "m11-bt-4",
          formula: "Middle term (n even): T(n/2+1)",
          description: "Middle term for even n",
        },
        {
          id: "m11-bt-5",
          formula: "Middle terms (n odd): T((n+1)/2) and T((n+3)/2)",
          description: "Middle terms for odd n",
        },
        {
          id: "m11-bt-6",
          formula: "(1+x)ⁿ = 1 + nx + n(n-1)x²/2! + ...",
          description: "Binomial for (1+x)ⁿ",
        },
        {
          id: "m11-bt-7",
          formula: "Sum of coefficients: put a=b=1 → 2ⁿ",
          description: "Sum of binomial coefficients",
        },
        {
          id: "m11-bt-8",
          formula:
            "Sum of odd-position coefficients = sum of even-position = 2ⁿ⁻¹",
          description: "Alternate sum",
        },
        {
          id: "m11-bt-9",
          formula: "(a-b)ⁿ = Σ nCr × aⁿ⁻ʳ × (-b)ʳ",
          description: "Expansion of (a-b)ⁿ",
        },
        {
          id: "m11-bt-10",
          formula: "Pascal's triangle: each row starts/ends with 1",
          description: "Pascal's triangle",
        },
        {
          id: "m11-bt-11",
          formula: "Binomial coefficients: C(n,0), C(n,1), ..., C(n,n)",
          description: "Coefficients",
        },
        {
          id: "m11-bt-12",
          formula: "Term independent of x: set power of x = 0 and solve for r",
          description: "Constant term",
        },
        {
          id: "m11-bt-13",
          formula: "C(n,0) + C(n,2) + ... = 2ⁿ⁻¹ (sum of even indexed)",
          description: "Even index sum",
        },
        {
          id: "m11-bt-14",
          formula: "Tr+1 / Tr = (n-r+1)/r × b/a (ratio of consecutive terms)",
          description: "Ratio of terms",
        },
        {
          id: "m11-bt-15",
          formula: "Greatest term: find r where |Tr+1/Tr| ≥ 1",
          description: "Numerically greatest term",
        },
      ],
    },
    {
      name: "Sequences and Series",
      formulas: [
        {
          id: "m11-ss-1",
          formula: "GP nth term: aₙ = arⁿ⁻¹",
          description: "General term of GP",
        },
        {
          id: "m11-ss-2",
          formula: "GP sum (r≠1): Sₙ = a(rⁿ-1)/(r-1)",
          description: "Sum of n terms of GP",
        },
        {
          id: "m11-ss-3",
          formula: "GP sum (r=1): Sₙ = na",
          description: "Sum when r=1",
        },
        {
          id: "m11-ss-4",
          formula: "Infinite GP sum: S = a/(1-r), |r| < 1",
          description: "Infinite GP sum",
        },
        {
          id: "m11-ss-5",
          formula: "Geometric mean: G = √(ab) between a and b",
          description: "GM between two numbers",
        },
        {
          id: "m11-ss-6",
          formula: "AM ≥ GM ≥ HM for positive numbers",
          description: "AM-GM-HM inequality",
        },
        {
          id: "m11-ss-7",
          formula: "AM × HM = GM²",
          description: "AM-GM-HM relation",
        },
        {
          id: "m11-ss-8",
          formula: "Σ n = n(n+1)/2",
          description: "Sum of first n naturals",
        },
        {
          id: "m11-ss-9",
          formula: "Σ n² = n(n+1)(2n+1)/6",
          description: "Sum of squares",
        },
        {
          id: "m11-ss-10",
          formula: "Σ n³ = [n(n+1)/2]²",
          description: "Sum of cubes",
        },
        {
          id: "m11-ss-11",
          formula: "Three terms in GP: a/r, a, ar",
          description: "Convenient GP form",
        },
        {
          id: "m11-ss-12",
          formula: "Four terms in GP: a/r³, a/r, ar, ar³",
          description: "Four terms in GP",
        },
        {
          id: "m11-ss-13",
          formula: "Harmonic mean: H = 2ab/(a+b)",
          description: "HM between a and b",
        },
        {
          id: "m11-ss-14",
          formula: "Arithmetico-Geometric series: a, (a+d)r, (a+2d)r², ...",
          description: "AGP series",
        },
        {
          id: "m11-ss-15",
          formula: "If a, b, c in GP then b² = ac",
          description: "GP condition",
        },
      ],
    },
  ],
  "12": [
    {
      name: "Matrices",
      formulas: [
        {
          id: "m12-mat-1",
          formula: "Order of matrix: m × n (m rows, n columns)",
          description: "Matrix order",
        },
        {
          id: "m12-mat-2",
          formula: "(AB)ᵀ = BᵀAᵀ",
          description: "Transpose of product",
        },
        {
          id: "m12-mat-3",
          formula: "(A+B)ᵀ = Aᵀ + Bᵀ",
          description: "Transpose of sum",
        },
        {
          id: "m12-mat-4",
          formula: "A is symmetric if Aᵀ = A",
          description: "Symmetric matrix",
        },
        {
          id: "m12-mat-5",
          formula: "A is skew-symmetric if Aᵀ = -A",
          description: "Skew-symmetric matrix",
        },
        {
          id: "m12-mat-6",
          formula: "A + (-A) = O (zero matrix)",
          description: "Additive inverse",
        },
        {
          id: "m12-mat-7",
          formula: "Any matrix = (A+Aᵀ)/2 + (A-Aᵀ)/2 (symmetric + skew)",
          description: "Decomposition",
        },
        {
          id: "m12-mat-8",
          formula: "AI = IA = A (identity matrix)",
          description: "Identity property",
        },
        {
          id: "m12-mat-9",
          formula: "A(BC) = (AB)C (associativity)",
          description: "Associativity",
        },
        {
          id: "m12-mat-10",
          formula: "A(B+C) = AB + AC (distributivity)",
          description: "Distributivity",
        },
        {
          id: "m12-mat-11",
          formula: "AB ≠ BA in general",
          description: "Non-commutativity",
        },
        {
          id: "m12-mat-12",
          formula: "Number of elements in m×n matrix = mn",
          description: "Total elements",
        },
        {
          id: "m12-mat-13",
          formula: "Diagonal matrix: all off-diagonal elements = 0",
          description: "Diagonal matrix",
        },
        {
          id: "m12-mat-14",
          formula:
            "Scalar matrix: diagonal matrix with equal diagonal elements",
          description: "Scalar matrix",
        },
        {
          id: "m12-mat-15",
          formula: "Square matrix: m = n (equal rows and columns)",
          description: "Square matrix",
        },
      ],
    },
    {
      name: "Determinants",
      formulas: [
        {
          id: "m12-det-1",
          formula: "|A| for 2×2: ad - bc where A = [[a,b],[c,d]]",
          description: "2×2 determinant",
        },
        {
          id: "m12-det-2",
          formula: "|AB| = |A| × |B|",
          description: "Product determinant",
        },
        {
          id: "m12-det-3",
          formula: "|Aᵀ| = |A|",
          description: "Transpose determinant",
        },
        {
          id: "m12-det-4",
          formula: "|kA| = kⁿ|A| for n×n matrix",
          description: "Scalar multiple determinant",
        },
        {
          id: "m12-det-5",
          formula: "Singular matrix: |A| = 0",
          description: "Singular matrix definition",
        },
        {
          id: "m12-det-6",
          formula: "A⁻¹ = adj(A) / |A|",
          description: "Inverse formula",
        },
        {
          id: "m12-det-7",
          formula: "A × adj(A) = |A| × I",
          description: "Adjugate property",
        },
        {
          id: "m12-det-8",
          formula: "For 2×2: adj(A) = [[d,-b],[-c,a]]",
          description: "Adjugate of 2×2",
        },
        {
          id: "m12-det-9",
          formula: "AA⁻¹ = A⁻¹A = I",
          description: "Inverse property",
        },
        {
          id: "m12-det-10",
          formula: "(AB)⁻¹ = B⁻¹A⁻¹",
          description: "Inverse of product",
        },
        {
          id: "m12-det-11",
          formula: "Cramer's rule: x = D₁/D, y = D₂/D",
          description: "Cramer's rule for 2 vars",
        },
        {
          id: "m12-det-12",
          formula: "Area of triangle = (1/2)|x₁(y₂-y₃)+x₂(y₃-y₁)+x₃(y₁-y₂)|",
          description: "Area via determinant",
        },
        {
          id: "m12-det-13",
          formula: "If any two rows/columns identical, |A| = 0",
          description: "Zero determinant condition",
        },
        {
          id: "m12-det-14",
          formula: "Cofactor Cᵢⱼ = (-1)^(i+j) × Mᵢⱼ",
          description: "Cofactor definition",
        },
        {
          id: "m12-det-15",
          formula: "Expansion along any row/column gives same determinant",
          description: "Expansion property",
        },
      ],
    },
    {
      name: "Applications of Derivatives",
      formulas: [
        {
          id: "m12-ad-1",
          formula: "Rate of change: dy/dx = rate of y w.r.t. x",
          description: "Derivative as rate",
        },
        {
          id: "m12-ad-2",
          formula: "Tangent slope at (x₁,y₁): m = dy/dx|(x₁,y₁)",
          description: "Slope of tangent",
        },
        {
          id: "m12-ad-3",
          formula: "Normal slope = -1/(slope of tangent)",
          description: "Normal is perpendicular",
        },
        {
          id: "m12-ad-4",
          formula: "Tangent equation: y-y₁ = m(x-x₁)",
          description: "Equation of tangent",
        },
        {
          id: "m12-ad-5",
          formula: "Normal equation: y-y₁ = (-1/m)(x-x₁)",
          description: "Equation of normal",
        },
        {
          id: "m12-ad-6",
          formula: "f is increasing if f'(x) > 0",
          description: "Increasing function",
        },
        {
          id: "m12-ad-7",
          formula: "f is decreasing if f'(x) < 0",
          description: "Decreasing function",
        },
        {
          id: "m12-ad-8",
          formula: "Local max at x=c if f'(c)=0 and f''(c)<0",
          description: "Local maximum test",
        },
        {
          id: "m12-ad-9",
          formula: "Local min at x=c if f'(c)=0 and f''(c)>0",
          description: "Local minimum test",
        },
        {
          id: "m12-ad-10",
          formula:
            "Absolute max/min: compare f at critical points and endpoints",
          description: "Absolute extrema",
        },
        {
          id: "m12-ad-11",
          formula: "Approximation: Δy ≈ dy = f'(x)Δx",
          description: "Linear approximation",
        },
        {
          id: "m12-ad-12",
          formula: "Rolle's theorem: if f(a)=f(b), ∃ c such that f'(c)=0",
          description: "Rolle's theorem",
        },
        {
          id: "m12-ad-13",
          formula: "MVT: f'(c) = [f(b)-f(a)]/(b-a) for some c ∈ (a,b)",
          description: "Mean value theorem",
        },
        {
          id: "m12-ad-14",
          formula: "Inflection point: f''(x) changes sign",
          description: "Point of inflection",
        },
        {
          id: "m12-ad-15",
          formula: "d/dx[f(g(x))] = f'(g(x)) × g'(x) (chain rule)",
          description: "Chain rule",
        },
      ],
    },
    {
      name: "Integrals",
      formulas: [
        {
          id: "m12-int-1",
          formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ -1",
          description: "Power rule",
        },
        {
          id: "m12-int-2",
          formula: "∫1/x dx = ln|x| + C",
          description: "Integral of 1/x",
        },
        {
          id: "m12-int-3",
          formula: "∫eˣ dx = eˣ + C",
          description: "Integral of exponential",
        },
        {
          id: "m12-int-4",
          formula: "∫sin x dx = -cos x + C",
          description: "Integral of sin",
        },
        {
          id: "m12-int-5",
          formula: "∫cos x dx = sin x + C",
          description: "Integral of cos",
        },
        {
          id: "m12-int-6",
          formula: "∫sec²x dx = tan x + C",
          description: "Integral of sec²",
        },
        {
          id: "m12-int-7",
          formula: "∫cosec²x dx = -cot x + C",
          description: "Integral of cosec²",
        },
        {
          id: "m12-int-8",
          formula: "∫sec x tan x dx = sec x + C",
          description: "Integral of sec·tan",
        },
        {
          id: "m12-int-9",
          formula: "∫1/(1+x²) dx = tan⁻¹x + C",
          description: "Arctan integral",
        },
        {
          id: "m12-int-10",
          formula: "∫1/√(1-x²) dx = sin⁻¹x + C",
          description: "Arcsin integral",
        },
        {
          id: "m12-int-11",
          formula: "Integration by parts: ∫u dv = uv - ∫v du (ILATE)",
          description: "IBP rule",
        },
        {
          id: "m12-int-12",
          formula: "∫[a to b] f(x)dx = F(b) - F(a)",
          description: "Fundamental theorem",
        },
        {
          id: "m12-int-13",
          formula: "∫[a to b] f(x)dx = ∫[a to c] + ∫[c to b]",
          description: "Splitting integral",
        },
        {
          id: "m12-int-14",
          formula:
            "∫[-a to a] f(x)dx = 2∫[0 to a] f(x)dx if f is even; 0 if odd",
          description: "Symmetry property",
        },
        {
          id: "m12-int-15",
          formula: "∫[0 to 2a] f(x)dx = 2∫[0 to a] f(x)dx if f(2a-x)=f(x)",
          description: "Periodicity property",
        },
      ],
    },
    {
      name: "Probability",
      formulas: [
        {
          id: "m12-prob-1",
          formula: "P(A|B) = P(A ∩ B)/P(B), P(B) > 0",
          description: "Conditional probability",
        },
        {
          id: "m12-prob-2",
          formula: "P(A ∩ B) = P(A|B) × P(B) = P(B|A) × P(A)",
          description: "Multiplication theorem",
        },
        {
          id: "m12-prob-3",
          formula: "Independent events: P(A ∩ B) = P(A) × P(B)",
          description: "Independence",
        },
        {
          id: "m12-prob-4",
          formula: "Total probability: P(A) = Σ P(A|Bᵢ)P(Bᵢ)",
          description: "Law of total probability",
        },
        {
          id: "m12-prob-5",
          formula: "Bayes: P(Bᵢ|A) = P(A|Bᵢ)P(Bᵢ) / Σ P(A|Bⱼ)P(Bⱼ)",
          description: "Bayes' theorem",
        },
        {
          id: "m12-prob-6",
          formula: "P(X=k) = nCk × pᵏ × (1-p)ⁿ⁻ᵏ",
          description: "Binomial distribution",
        },
        {
          id: "m12-prob-7",
          formula: "Mean of binomial: μ = np",
          description: "Binomial mean",
        },
        {
          id: "m12-prob-8",
          formula: "Variance of binomial: σ² = np(1-p)",
          description: "Binomial variance",
        },
        {
          id: "m12-prob-9",
          formula: "E(X) = Σ xᵢP(xᵢ)",
          description: "Expected value",
        },
        {
          id: "m12-prob-10",
          formula: "Var(X) = E(X²) - [E(X)]²",
          description: "Variance formula",
        },
        {
          id: "m12-prob-11",
          formula: "SD = √Var(X)",
          description: "Standard deviation",
        },
        {
          id: "m12-prob-12",
          formula: "P(A') = 1 - P(A)",
          description: "Complement rule",
        },
        {
          id: "m12-prob-13",
          formula: "P(A∪B) = P(A)+P(B)-P(A∩B)",
          description: "Addition theorem",
        },
        {
          id: "m12-prob-14",
          formula: "For mutually exclusive: P(A₁∪A₂∪...∪Aₙ) = ΣP(Aᵢ)",
          description: "ME addition",
        },
        {
          id: "m12-prob-15",
          formula:
            "Random variable: function mapping sample space to real numbers",
          description: "Random variable definition",
        },
      ],
    },
  ],
};

const scienceData: Record<ClassLevel, Chapter[]> = {
  "10": [
    {
      name: "Chemical Reactions & Equations",
      formulas: [
        {
          id: "s10-cr-1",
          formula: "Combination: A + B → AB",
          description: "Two substances combine to form one",
        },
        {
          id: "s10-cr-2",
          formula: "Decomposition: AB → A + B",
          description: "One substance breaks into two",
        },
        {
          id: "s10-cr-3",
          formula: "Displacement: A + BC → AC + B",
          description: "More reactive displaces less reactive",
        },
        {
          id: "s10-cr-4",
          formula: "Double displacement: AB + CD → AD + CB",
          description: "Exchange of ions",
        },
        {
          id: "s10-cr-5",
          formula: "Oxidation: loss of electrons / gain of oxygen",
          description: "Oxidation definition",
        },
        {
          id: "s10-cr-6",
          formula: "Reduction: gain of electrons / loss of oxygen",
          description: "Reduction definition",
        },
        {
          id: "s10-cr-7",
          formula: "Redox: oxidation and reduction occur simultaneously",
          description: "Redox reaction",
        },
        {
          id: "s10-cr-8",
          formula: "2Mg + O₂ → 2MgO (combination + oxidation)",
          description: "Magnesium burning",
        },
        {
          id: "s10-cr-9",
          formula: "2H₂O → 2H₂ + O₂ (electrolytic decomposition)",
          description: "Water decomposition",
        },
        {
          id: "s10-cr-10",
          formula: "Fe + CuSO₄ → FeSO₄ + Cu (displacement)",
          description: "Iron displacing copper",
        },
        {
          id: "s10-cr-11",
          formula:
            "Law of conservation of mass: mass of reactants = mass of products",
          description: "Conservation of mass",
        },
        {
          id: "s10-cr-12",
          formula: "Endothermic: heat absorbed (ΔH > 0)",
          description: "Energy absorbed",
        },
        {
          id: "s10-cr-13",
          formula: "Exothermic: heat released (ΔH < 0)",
          description: "Energy released",
        },
        {
          id: "s10-cr-14",
          formula: "Corrosion: 4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O",
          description: "Rusting of iron",
        },
        {
          id: "s10-cr-15",
          formula: "Rancidity: oxidation of fats/oils in food",
          description: "Rancidity reaction",
        },
      ],
    },
    {
      name: "Electricity",
      formulas: [
        {
          id: "s10-el-1",
          formula: "Ohm's Law: V = IR",
          description: "Voltage, current, resistance relation",
        },
        {
          id: "s10-el-2",
          formula: "Current: I = Q/t (amperes = coulombs/second)",
          description: "Electric current definition",
        },
        {
          id: "s10-el-3",
          formula: "Resistance: R = ρl/A",
          description: "Resistance of a conductor",
        },
        {
          id: "s10-el-4",
          formula: "Series: R_total = R₁ + R₂ + R₃ + ...",
          description: "Resistors in series",
        },
        {
          id: "s10-el-5",
          formula: "Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃",
          description: "Resistors in parallel",
        },
        {
          id: "s10-el-6",
          formula: "Power: P = VI = I²R = V²/R",
          description: "Electric power",
        },
        {
          id: "s10-el-7",
          formula: "Energy: E = Pt = VIt",
          description: "Electrical energy",
        },
        {
          id: "s10-el-8",
          formula: "1 kWh = 3.6 × 10⁶ J",
          description: "Unit of electrical energy",
        },
        {
          id: "s10-el-9",
          formula: "Joule's heating: H = I²Rt",
          description: "Heat produced in resistor",
        },
        {
          id: "s10-el-10",
          formula: "Work done: W = VQ = VIt",
          description: "Work by electric field",
        },
        {
          id: "s10-el-11",
          formula: "EMF: ε = W/Q (work per unit charge)",
          description: "EMF definition",
        },
        {
          id: "s10-el-12",
          formula: "Kirchhoff's current law: ΣI_in = ΣI_out at node",
          description: "KCL",
        },
        {
          id: "s10-el-13",
          formula: "Kirchhoff's voltage law: ΣV = 0 in closed loop",
          description: "KVL",
        },
        {
          id: "s10-el-14",
          formula: "Same current through series resistors",
          description: "Series property",
        },
        {
          id: "s10-el-15",
          formula: "Same voltage across parallel resistors",
          description: "Parallel property",
        },
      ],
    },
    {
      name: "Light – Reflection & Refraction",
      formulas: [
        {
          id: "s10-lr-1",
          formula: "Mirror equation: 1/f = 1/v + 1/u",
          description: "Mirror formula",
        },
        {
          id: "s10-lr-2",
          formula: "Focal length of mirror: f = R/2",
          description: "Relation between f and R",
        },
        {
          id: "s10-lr-3",
          formula: "Magnification (mirror): m = -v/u = h'/h",
          description: "Mirror magnification",
        },
        {
          id: "s10-lr-4",
          formula: "Lens formula: 1/f = 1/v - 1/u",
          description: "Lens formula",
        },
        {
          id: "s10-lr-5",
          formula: "Magnification (lens): m = v/u = h'/h",
          description: "Lens magnification",
        },
        {
          id: "s10-lr-6",
          formula: "Power of lens: P = 1/f (in metres), unit = dioptre",
          description: "Lens power",
        },
        {
          id: "s10-lr-7",
          formula: "Snell's law: n₁sinθ₁ = n₂sinθ₂",
          description: "Law of refraction",
        },
        {
          id: "s10-lr-8",
          formula: "Refractive index: n = c/v = sin i / sin r",
          description: "Refractive index",
        },
        {
          id: "s10-lr-9",
          formula: "Angle of incidence = angle of reflection",
          description: "Law of reflection",
        },
        {
          id: "s10-lr-10",
          formula: "Total internal reflection: i > critical angle",
          description: "TIR condition",
        },
        {
          id: "s10-lr-11",
          formula: "Combined lens power: P = P₁ + P₂",
          description: "Power of combined lenses",
        },
        {
          id: "s10-lr-12",
          formula: "Concave mirror: real inverted image (usually)",
          description: "Concave mirror image",
        },
        {
          id: "s10-lr-13",
          formula: "Convex mirror: virtual erect diminished image always",
          description: "Convex mirror image",
        },
        {
          id: "s10-lr-14",
          formula: "Convex lens: converging; concave lens: diverging",
          description: "Lens types",
        },
        {
          id: "s10-lr-15",
          formula:
            "Sign convention: distances from pole/optical center, +ve in direction of light",
          description: "New Cartesian sign convention",
        },
      ],
    },
    {
      name: "Life Processes",
      formulas: [
        {
          id: "s10-lp-1",
          formula: "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
          description: "Photosynthesis equation",
        },
        {
          id: "s10-lp-2",
          formula: "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38ATP",
          description: "Aerobic respiration",
        },
        {
          id: "s10-lp-3",
          formula: "Anaerobic (yeast): C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂",
          description: "Fermentation",
        },
        {
          id: "s10-lp-4",
          formula: "Anaerobic (muscle): Glucose → Lactic acid",
          description: "Anaerobic in muscles",
        },
        {
          id: "s10-lp-5",
          formula: "Transpiration: loss of water vapour from plant leaves",
          description: "Transpiration definition",
        },
        {
          id: "s10-lp-6",
          formula:
            "Osmosis: movement of water from low to high solute concentration through semipermeable membrane",
          description: "Osmosis",
        },
        {
          id: "s10-lp-7",
          formula: "Turgidity: cell swells when water enters by osmosis",
          description: "Turgidity",
        },
        {
          id: "s10-lp-8",
          formula: "Plasmolysis: cell shrinks when water exits by osmosis",
          description: "Plasmolysis",
        },
        {
          id: "s10-lp-9",
          formula: "Stomata open in light (K⁺ pumped in) → guard cells turgid",
          description: "Stomatal opening mechanism",
        },
        {
          id: "s10-lp-10",
          formula: "Blood pressure: systolic/diastolic (120/80 mmHg normal)",
          description: "Normal BP values",
        },
        {
          id: "s10-lp-11",
          formula: "Glomerular filtration rate: ~125 mL/min in humans",
          description: "GFR value",
        },
        {
          id: "s10-lp-12",
          formula: "Urea formed in liver; excreted by kidneys",
          description: "Urea pathway",
        },
        {
          id: "s10-lp-13",
          formula: "Bile juice emulsifies fats (no enzymes in bile)",
          description: "Bile function",
        },
        {
          id: "s10-lp-14",
          formula: "pH of stomach = ~2 (acidic, HCl)",
          description: "Stomach pH",
        },
        {
          id: "s10-lp-15",
          formula:
            "Villi: finger-like projections in small intestine for absorption",
          description: "Villi function",
        },
      ],
    },
  ],
  "11": [
    {
      name: "Laws of Motion",
      formulas: [
        {
          id: "s11-lm-1",
          formula: "Newton's 1st law: F = 0 ⟹ a = 0 (inertia)",
          description: "Law of inertia",
        },
        {
          id: "s11-lm-2",
          formula: "Newton's 2nd law: F = ma",
          description: "Force equals mass times acceleration",
        },
        {
          id: "s11-lm-3",
          formula: "Newton's 3rd law: F₁₂ = -F₂₁",
          description: "Action-reaction",
        },
        {
          id: "s11-lm-4",
          formula: "Momentum: p = mv",
          description: "Linear momentum",
        },
        {
          id: "s11-lm-5",
          formula: "Impulse: J = FΔt = Δp",
          description: "Impulse-momentum theorem",
        },
        {
          id: "s11-lm-6",
          formula: "Friction: f = μN",
          description: "Friction force",
        },
        {
          id: "s11-lm-7",
          formula: "Static friction: f_s ≤ μ_s N",
          description: "Static friction limit",
        },
        {
          id: "s11-lm-8",
          formula: "Free body diagram: draw all forces on object",
          description: "FBD method",
        },
        {
          id: "s11-lm-9",
          formula: "Tension in string: T = mg for hanging mass (at rest)",
          description: "Tension formula",
        },
        {
          id: "s11-lm-10",
          formula: "On inclined plane: a = g(sinθ - μcosθ)",
          description: "Motion on incline",
        },
        {
          id: "s11-lm-11",
          formula:
            "Conservation of momentum: p_initial = p_final (no external force)",
          description: "Momentum conservation",
        },
        {
          id: "s11-lm-12",
          formula: "For elevator going up: N = m(g+a)",
          description: "Normal force in elevator",
        },
        {
          id: "s11-lm-13",
          formula: "For elevator going down: N = m(g-a)",
          description: "Apparent weight in descending elevator",
        },
        {
          id: "s11-lm-14",
          formula: "Circular motion: F_c = mv²/r (centripetal)",
          description: "Centripetal force",
        },
        {
          id: "s11-lm-15",
          formula: "Banking angle: tan θ = v²/rg",
          description: "Banking of roads",
        },
      ],
    },
    {
      name: "Work, Energy and Power",
      formulas: [
        {
          id: "s11-wep-1",
          formula: "Work: W = F·d·cosθ",
          description: "Work done by force",
        },
        {
          id: "s11-wep-2",
          formula: "Kinetic energy: KE = (1/2)mv²",
          description: "KE formula",
        },
        {
          id: "s11-wep-3",
          formula: "Potential energy (gravity): PE = mgh",
          description: "Gravitational PE",
        },
        {
          id: "s11-wep-4",
          formula: "Spring PE: PE = (1/2)kx²",
          description: "Elastic potential energy",
        },
        {
          id: "s11-wep-5",
          formula: "Work-energy theorem: W_net = ΔKE",
          description: "Work-energy theorem",
        },
        {
          id: "s11-wep-6",
          formula: "Conservation of energy: KE + PE = constant",
          description: "Energy conservation",
        },
        {
          id: "s11-wep-7",
          formula: "Power: P = W/t = F·v",
          description: "Power definition",
        },
        {
          id: "s11-wep-8",
          formula: "1 horsepower = 746 W",
          description: "HP to watts",
        },
        {
          id: "s11-wep-9",
          formula: "Efficiency: η = useful output / total input × 100%",
          description: "Efficiency",
        },
        {
          id: "s11-wep-10",
          formula: "Elastic collision: KE and momentum both conserved",
          description: "Elastic collision",
        },
        {
          id: "s11-wep-11",
          formula: "Inelastic collision: only momentum conserved",
          description: "Inelastic collision",
        },
        {
          id: "s11-wep-12",
          formula:
            "Perfectly inelastic: objects stick together, v = (m₁u₁+m₂u₂)/(m₁+m₂)",
          description: "Perfect inelastic collision",
        },
        {
          id: "s11-wep-13",
          formula:
            "Coefficient of restitution: e = relative speed after / relative speed before",
          description: "Coefficient of restitution",
        },
        {
          id: "s11-wep-14",
          formula: "W against gravity = mgh (path independent)",
          description: "Conservative force",
        },
        {
          id: "s11-wep-15",
          formula: "Escape velocity: v_e = √(2gR)",
          description: "Escape velocity",
        },
      ],
    },
    {
      name: "Thermodynamics",
      formulas: [
        {
          id: "s11-thermo-1",
          formula: "First law: ΔU = Q - W",
          description: "First law of thermodynamics",
        },
        {
          id: "s11-thermo-2",
          formula: "Isothermal process: T = constant, ΔU = 0",
          description: "Isothermal",
        },
        {
          id: "s11-thermo-3",
          formula: "Adiabatic: Q = 0, ΔU = -W",
          description: "Adiabatic process",
        },
        {
          id: "s11-thermo-4",
          formula: "Isochoric: V = constant, W = 0, ΔU = Q",
          description: "Constant volume",
        },
        {
          id: "s11-thermo-5",
          formula: "Isobaric: P = constant, W = PΔV",
          description: "Constant pressure",
        },
        {
          id: "s11-thermo-6",
          formula: "Ideal gas: PV = nRT",
          description: "Ideal gas law",
        },
        {
          id: "s11-thermo-7",
          formula: "R = 8.314 J mol⁻¹ K⁻¹",
          description: "Gas constant",
        },
        {
          id: "s11-thermo-8",
          formula: "Carnot efficiency: η = 1 - T_L/T_H",
          description: "Carnot engine efficiency",
        },
        {
          id: "s11-thermo-9",
          formula: "Second law: heat flows from hot to cold spontaneously",
          description: "Second law",
        },
        {
          id: "s11-thermo-10",
          formula: "Entropy: ΔS = Q_rev/T",
          description: "Entropy change",
        },
        {
          id: "s11-thermo-11",
          formula: "Specific heat: Q = mcΔT",
          description: "Heat absorbed",
        },
        {
          id: "s11-thermo-12",
          formula: "Latent heat: Q = mL",
          description: "Phase change heat",
        },
        {
          id: "s11-thermo-13",
          formula: "Cp - Cv = R (for ideal gas)",
          description: "Mayer's relation",
        },
        {
          id: "s11-thermo-14",
          formula: "γ = Cp/Cv (ratio of specific heats)",
          description: "Adiabatic index",
        },
        {
          id: "s11-thermo-15",
          formula:
            "Zeroth law: two systems in thermal equilibrium with third ⟹ in equilibrium with each other",
          description: "Zeroth law",
        },
      ],
    },
  ],
  "12": [
    {
      name: "Electric Charges and Fields",
      formulas: [
        {
          id: "s12-ecf-1",
          formula: "Coulomb's law: F = kq₁q₂/r²",
          description: "Force between charges",
        },
        {
          id: "s12-ecf-2",
          formula: "k = 1/(4πε₀) = 9 × 10⁹ N m² C⁻²",
          description: "Coulomb's constant",
        },
        {
          id: "s12-ecf-3",
          formula: "Electric field: E = F/q = kQ/r²",
          description: "Electric field definition",
        },
        {
          id: "s12-ecf-4",
          formula: "Electric flux: Φ = E·A·cosθ",
          description: "Electric flux",
        },
        {
          id: "s12-ecf-5",
          formula: "Gauss's law: Φ = q_enclosed/ε₀",
          description: "Gauss's law",
        },
        {
          id: "s12-ecf-6",
          formula: "Field due to infinite line charge: E = λ/(2πε₀r)",
          description: "Line charge field",
        },
        {
          id: "s12-ecf-7",
          formula: "Field due to infinite plane: E = σ/(2ε₀)",
          description: "Plane charge field",
        },
        {
          id: "s12-ecf-8",
          formula: "Field inside conductor = 0",
          description: "Conductor shielding",
        },
        {
          id: "s12-ecf-9",
          formula: "Electric dipole moment: p = qd",
          description: "Dipole moment",
        },
        {
          id: "s12-ecf-10",
          formula: "Torque on dipole: τ = pE sinθ",
          description: "Torque in field",
        },
        {
          id: "s12-ecf-11",
          formula: "Energy of dipole: U = -pE cosθ",
          description: "Dipole potential energy",
        },
        {
          id: "s12-ecf-12",
          formula: "Superposition principle: F_net = ΣFᵢ",
          description: "Superposition of forces",
        },
        {
          id: "s12-ecf-13",
          formula: "Charge quantization: q = ne, e = 1.6 × 10⁻¹⁹ C",
          description: "Quantization of charge",
        },
        {
          id: "s12-ecf-14",
          formula: "Field on axis of dipole: E = 2kp/r³",
          description: "Axial dipole field",
        },
        {
          id: "s12-ecf-15",
          formula: "Field on equatorial of dipole: E = kp/r³",
          description: "Equatorial dipole field",
        },
      ],
    },
    {
      name: "Current Electricity",
      formulas: [
        {
          id: "s12-ce-1",
          formula: "Ohm's law: V = IR",
          description: "Ohm's law",
        },
        {
          id: "s12-ce-2",
          formula: "Resistivity: ρ = RA/l",
          description: "Resistivity formula",
        },
        {
          id: "s12-ce-3",
          formula: "Temperature coefficient: R_T = R₀(1 + αT)",
          description: "Resistance vs temperature",
        },
        {
          id: "s12-ce-4",
          formula: "EMF: ε = V + Ir (terminal voltage = EMF - voltage drop)",
          description: "EMF and terminal voltage",
        },
        {
          id: "s12-ce-5",
          formula: "Power: P = I²R = V²/R = VI",
          description: "Power dissipation",
        },
        {
          id: "s12-ce-6",
          formula: "Kirchhoff's 1st law (KCL): ΣI = 0 at a junction",
          description: "KCL",
        },
        {
          id: "s12-ce-7",
          formula: "Kirchhoff's 2nd law (KVL): ΣV = 0 in a loop",
          description: "KVL",
        },
        {
          id: "s12-ce-8",
          formula: "Wheatstone bridge balanced: P/Q = R/S",
          description: "Wheatstone bridge",
        },
        {
          id: "s12-ce-9",
          formula:
            "Potentiometer: V ∝ l (potential drop proportional to length)",
          description: "Potentiometer principle",
        },
        {
          id: "s12-ce-10",
          formula: "Drift velocity: v_d = eEτ/m = I/(nAe)",
          description: "Drift velocity",
        },
        {
          id: "s12-ce-11",
          formula: "Conductance: G = 1/R (siemens)",
          description: "Conductance",
        },
        {
          id: "s12-ce-12",
          formula: "Conductivity: σ = 1/ρ",
          description: "Conductivity",
        },
        {
          id: "s12-ce-13",
          formula: "Current density: J = I/A = nev_d",
          description: "Current density",
        },
        {
          id: "s12-ce-14",
          formula: "Cells in series: ε_total = Σεᵢ, r_total = Σrᵢ",
          description: "Cells in series",
        },
        {
          id: "s12-ce-15",
          formula: "Cells in parallel: ε_eff = ε (same), r_eff = r/n",
          description: "Cells in parallel",
        },
      ],
    },
    {
      name: "Ray Optics",
      formulas: [
        {
          id: "s12-ro-1",
          formula: "Mirror formula: 1/v + 1/u = 1/f = 2/R",
          description: "Mirror equation",
        },
        {
          id: "s12-ro-2",
          formula: "Lens formula: 1/v - 1/u = 1/f",
          description: "Lens equation",
        },
        {
          id: "s12-ro-3",
          formula: "Lens maker's: 1/f = (n-1)[1/R₁ - 1/R₂]",
          description: "Lens maker's formula",
        },
        {
          id: "s12-ro-4",
          formula: "Magnification: m = v/u (lens), m = -v/u (mirror)",
          description: "Magnification",
        },
        {
          id: "s12-ro-5",
          formula: "Power: P = 1/f (m), P₁+P₂ for combined",
          description: "Power of lens",
        },
        {
          id: "s12-ro-6",
          formula: "Snell's law: n₁sinθ₁ = n₂sinθ₂",
          description: "Refraction law",
        },
        {
          id: "s12-ro-7",
          formula: "Critical angle: sinC = 1/n (for n₂/n₁ = n)",
          description: "Critical angle",
        },
        {
          id: "s12-ro-8",
          formula: "Prism: δ = (i₁+i₂) - A, n = sin[(A+δ_m)/2] / sin(A/2)",
          description: "Prism formula",
        },
        {
          id: "s12-ro-9",
          formula: "Microscope: m = m_objective × m_eyepiece",
          description: "Microscope magnification",
        },
        {
          id: "s12-ro-10",
          formula: "Telescope: m = f_objective / f_eyepiece",
          description: "Telescope magnification",
        },
        {
          id: "s12-ro-11",
          formula: "Near point of human eye = 25 cm (D)",
          description: "Least distance of distinct vision",
        },
        {
          id: "s12-ro-12",
          formula: "Compound microscope: m = (L/f_o) × (D/f_e)",
          description: "Compound microscope",
        },
        {
          id: "s12-ro-13",
          formula: "Speed of light: c = 3 × 10⁸ m/s",
          description: "Speed of light",
        },
        {
          id: "s12-ro-14",
          formula: "n = c/v (refractive index = c/speed in medium)",
          description: "Refractive index",
        },
        {
          id: "s12-ro-15",
          formula:
            "Lateral displacement in slab: d = t sinθ(1 - cosθ/√(n²-sin²θ))",
          description: "Lateral shift in slab",
        },
      ],
    },
  ],
};

const subjects: Subject[] = ["Mathematics", "Science"];
const classes: ClassLevel[] = ["10", "11", "12"];

export default function FormulaSheetPage() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>("10");
  const [selectedSubject, setSelectedSubject] =
    useState<Subject>("Mathematics");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      return new Set(
        JSON.parse(localStorage.getItem("formula_bookmarks") || "[]"),
      );
    } catch {
      return new Set();
    }
  });

  const chapters =
    selectedSubject === "Mathematics"
      ? mathData[selectedClass] || []
      : scienceData[selectedClass] || [];

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("formula_bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  const filteredChapters = searchQuery
    ? chapters
        .map((ch) => ({
          ...ch,
          formulas: ch.formulas.filter(
            (f) =>
              f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
              f.description.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((ch) => ch.formulas.length > 0)
    : selectedChapter
      ? chapters.filter((ch) => ch.name === selectedChapter)
      : [];

  const displayChapters = searchQuery ? filteredChapters : filteredChapters;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Formula Sheet</h1>
        <p className="text-muted-foreground">
          Quick access to important formulas for Classes 10, 11 & 12
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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
              data-ocid="formula.tab"
            >
              Class {cls}
            </Button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
          {subjects.map((sub) => (
            <Button
              key={sub}
              variant={selectedSubject === sub ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedSubject(sub);
                setSelectedChapter(null);
              }}
              data-ocid="formula.tab"
            >
              {sub}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search formulas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedChapter(null);
            }}
            data-ocid="formula.search_input"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapter list */}
        {!searchQuery && (
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
                    No chapters available for Class {selectedClass}{" "}
                    {selectedSubject}
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
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2 ${
                        selectedChapter === ch.name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      data-ocid="formula.button"
                    >
                      <span className="truncate">{ch.name}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Formula cards */}
        <div
          className={searchQuery ? "col-span-1 lg:col-span-4" : "lg:col-span-3"}
        >
          {!selectedChapter && !searchQuery ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-3">
              <Search className="w-8 h-8 opacity-40" />
              <div>
                <p className="font-medium">Select a chapter to view formulas</p>
                <p className="text-sm">Or search by keyword above</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {(searchQuery ? displayChapters : filteredChapters).map(
                (chapter) => (
                  <div key={chapter.name}>
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      {chapter.name}
                      <Badge variant="secondary">
                        {chapter.formulas.length} formulas
                      </Badge>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {chapter.formulas.map((f) => (
                        <Card
                          key={f.id}
                          className="group hover:shadow-md transition-shadow"
                          data-ocid="formula.card"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-mono text-sm font-medium break-words leading-relaxed text-primary">
                                  {f.formula}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {f.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0 opacity-50 group-hover:opacity-100"
                                onClick={() => toggleBookmark(f.id)}
                                data-ocid="formula.toggle"
                              >
                                {bookmarks.has(f.id) ? (
                                  <BookmarkCheck className="w-4 h-4 text-primary" />
                                ) : (
                                  <Bookmark className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ),
              )}
              {searchQuery && displayChapters.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  No formulas found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {/* Bookmarks section */}
          {!searchQuery && !selectedChapter && bookmarks.size > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-3">
                Bookmarked Formulas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chapters
                  .flatMap((ch) =>
                    ch.formulas.filter((f) => bookmarks.has(f.id)),
                  )
                  .map((f) => (
                    <Card key={f.id} className="border-primary/30">
                      <CardContent className="p-4 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-sm font-medium text-primary">
                            {f.formula}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {f.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => toggleBookmark(f.id)}
                          data-ocid="formula.toggle"
                        >
                          <BookmarkCheck className="w-4 h-4 text-primary" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
