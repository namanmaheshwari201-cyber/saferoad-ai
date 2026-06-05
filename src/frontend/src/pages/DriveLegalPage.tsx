import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Calculator,
  Car,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  MessageSquare,
  Newspaper,
  Scale,
  Send,
  Shield,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface FineResult {
  fineAmount: string;
  additionalPenalties: string;
  licenseImpact: string;
  seizureRisk: string;
}

interface LegalUpdate {
  id: number;
  title: string;
  description: string;
  detail: string;
  date: string;
  scope: "Central" | "State";
  state?: string;
  severity: "Info" | "Important" | "Critical";
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const VEHICLE_TYPES = [
  "Two Wheeler",
  "Four Wheeler",
  "Auto Rickshaw",
  "Bus / Truck",
  "Tractor",
];

const VIOLATIONS = [
  "Speeding",
  "Signal Jumping",
  "No Helmet",
  "No Seatbelt",
  "Triple Riding",
  "Drunk Driving",
  "Wrong Parking",
  "Mobile Phone Use",
  "No License",
  "Expired Insurance",
  "Overloading",
  "No PUC",
];

const FINE_DATA: Record<
  string,
  Record<
    string,
    {
      base: number;
      repeat: number;
      penalties: string;
      license: string;
      seizure: string;
    }
  >
> = {
  "No Helmet": {
    "Two Wheeler": {
      base: 1000,
      repeat: 2000,
      penalties: "Suspension of licence for 3 months",
      license: "3 month suspension on 2nd offense",
      seizure: "Low",
    },
    default: {
      base: 1000,
      repeat: 2000,
      penalties: "Suspension of licence for 3 months",
      license: "3 month suspension",
      seizure: "Low",
    },
  },
  "No Seatbelt": {
    "Four Wheeler": {
      base: 1000,
      repeat: 1500,
      penalties: "Applicable to driver and all passengers",
      license: "No direct impact on 1st offense",
      seizure: "Low",
    },
    default: {
      base: 1000,
      repeat: 1500,
      penalties: "Applicable to driver and all passengers",
      license: "No direct impact",
      seizure: "Low",
    },
  },
  "Signal Jumping": {
    default: {
      base: 5000,
      repeat: 10000,
      penalties: "Up to ₹10,000 fine; community service possible",
      license: "Licence may be suspended for 1 year",
      seizure: "Medium",
    },
  },
  Speeding: {
    "Two Wheeler": {
      base: 2000,
      repeat: 4000,
      penalties: "₹500–2,000 for LMV; ₹2,000–4,000 for medium/heavy",
      license: "Licence suspended if 40 km/h over limit",
      seizure: "Low",
    },
    "Four Wheeler": {
      base: 2000,
      repeat: 4000,
      penalties: "₹500–2,000 for LMV; ₹2,000–4,000 for medium/heavy",
      license: "Licence suspended if 40 km/h over limit",
      seizure: "Low",
    },
    "Bus / Truck": {
      base: 4000,
      repeat: 8000,
      penalties: "Heavy vehicles face higher penalties",
      license: "Licence suspended on repeat",
      seizure: "Medium",
    },
    default: {
      base: 2000,
      repeat: 4000,
      penalties: "Varies by vehicle type and degree of speeding",
      license: "Possible suspension for extreme cases",
      seizure: "Low",
    },
  },
  "Drunk Driving": {
    default: {
      base: 10000,
      repeat: 15000,
      penalties:
        "First: ₹10,000 or 6 months imprisonment; Repeat: ₹15,000 or 2 years",
      license: "Licence cancelled for 2 years on first; permanently on third",
      seizure: "High",
    },
  },
  "Triple Riding": {
    "Two Wheeler": {
      base: 1000,
      repeat: 2000,
      penalties: "Suspension of driving licence",
      license: "Licence suspended",
      seizure: "Low",
    },
    default: {
      base: 1000,
      repeat: 2000,
      penalties: "Applicable only to two-wheelers",
      license: "Licence suspended",
      seizure: "Low",
    },
  },
  "Wrong Parking": {
    default: {
      base: 500,
      repeat: 1000,
      penalties: "Vehicle may be towed; storage charges applicable",
      license: "No direct impact",
      seizure: "Low",
    },
  },
  "Mobile Phone Use": {
    default: {
      base: 5000,
      repeat: 10000,
      penalties: "Up to ₹10,000; enhanced in school/hospital zones",
      license: "Licence suspended on repeat offense",
      seizure: "Low",
    },
  },
  "No License": {
    default: {
      base: 5000,
      repeat: 10000,
      penalties: "Vehicle may be impounded; possible criminal liability",
      license: "Disqualified from obtaining licence for 1 year",
      seizure: "High",
    },
  },
  "Expired Insurance": {
    default: {
      base: 2000,
      repeat: 4000,
      penalties: "Vehicle impounded until valid insurance produced",
      license: "No direct impact on licence",
      seizure: "Medium",
    },
  },
  Overloading: {
    "Bus / Truck": {
      base: 20000,
      repeat: 40000,
      penalties: "₹2,000 per extra tonne; vehicle detained",
      license: "Licence suspended on repeat",
      seizure: "High",
    },
    Tractor: {
      base: 10000,
      repeat: 20000,
      penalties: "Per-tonne charges applied",
      license: "Licence cancelled on repeat",
      seizure: "Medium",
    },
    default: {
      base: 20000,
      repeat: 40000,
      penalties: "₹2,000 per extra tonne of overload",
      license: "Licence suspended",
      seizure: "High",
    },
  },
  "No PUC": {
    default: {
      base: 10000,
      repeat: 10000,
      penalties: "Vehicle may be detained; ₹10,000 or 6 months imprisonment",
      license: "No direct impact unless repeat",
      seizure: "Medium",
    },
  },
};

const AI_RESPONSES: Record<string, string> = {
  "What is the fine for triple riding in Delhi?":
    "Under the Motor Vehicles (Amendment) Act 2019, triple riding on a two-wheeler in Delhi carries a fine of ₹1,000 for the first offense. On a second or subsequent offense, the fine increases to ₹2,000. Additionally, the riding licence may be suspended. Delhi Traffic Police enforces this strictly — especially in central Delhi, Connaught Place, and Lajpat Nagar areas during peak hours.",
  "What documents needed for driving in Maharashtra?":
    "In Maharashtra, drivers must carry: (1) Valid Driving Licence (original or DigiLocker), (2) Vehicle Registration Certificate (RC), (3) Valid Insurance Certificate (Third-Party at minimum), (4) Pollution Under Control (PUC) Certificate, (5) Fitness Certificate (for commercial vehicles). Under MV Act 2019, DigiLocker documents are legally valid. Failure to produce these can result in fines of ₹500–₹5,000 depending on the document.",
  "What are helmet rules in Karnataka?":
    "In Karnataka, wearing a helmet is mandatory for both rider and pillion under the Motor Vehicles Act. The helmet must be ISI-certified (BIS standard). Riding without a helmet carries a fine of ₹1,000 and a 3-month licence suspension for repeat offenders. Karnataka Traffic Police conducts regular helmet-checking drives, particularly in Bengaluru, Mysuru, and Mangaluru. Helmet-free zones do NOT exist — the rule applies everywhere, including residential areas.",
};

const QUICK_QUESTIONS = [
  "No helmet fine?",
  "Documents needed?",
  "Speed limits?",
  "Drunk driving penalty?",
  "Challan check online?",
  "EV rules India?",
];

function generateAIResponse(message: string): string {
  const q = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|namaste|hii+|helo|sup)\b/.test(q) || q.length < 5) {
    return "Namaste! 🙏 I'm your DriveLegal AI Assistant. I can help you with:\n• Traffic fines & challans by state\n• Driving rules and regulations\n• Document requirements\n• License information & renewal\n• Road safety laws under MV Act 2019\n\nTry asking: 'What is the fine for no helmet in Karnataka?' or 'What documents do I need while driving?'";
  }

  // How are you / what can you do
  if (
    /how are you|what can you do|what do you know|your capabilities/.test(q)
  ) {
    return "I'm doing great and ready to help! I'm an AI assistant specialized in Indian traffic laws. I can answer questions about:\n• Fine amounts for any violation (speeding, drunk driving, no helmet, etc.)\n• State-specific traffic rules (Delhi, Mumbai, Karnataka, Tamil Nadu, etc.)\n• Documents required while driving\n• Driving license renewal and application\n• Speed limits on Indian roads\n• Motor Vehicles Act 2019 provisions\n\nJust ask your question in plain English or Hindi!";
  }

  // Drunk driving
  if (/drunk|dui|alcohol|drinking.*driv|driv.*drink|drunken/.test(q)) {
    return "🚨 DUI / Drunk Driving Penalty (MV Act 2019 Section 185):\n\n• First offense: ₹10,000 fine OR 6 months imprisonment\n• Second offense (within 3 years): ₹15,000 fine OR 2 years imprisonment\n• BAC limit: 30 mg per 100 ml of blood\n• License cancelled for 2 years on first offense; permanently on third offense\n• Zero tolerance for commercial vehicle drivers\n• Police can conduct breath analyzer test at any time\n\nIn Maharashtra, the fine was enhanced to ₹15,000 for first offense from Jan 2024.";
  }

  // No helmet
  if (/helmet|two.?wheel|bike|motorcycle|scooter/.test(q)) {
    const isKarnataka = /karnataka|bangalore|bengaluru/.test(q);
    const isTN = /tamil.?nadu|chennai|madras/.test(q);
    if (isKarnataka) {
      return "🪖 Helmet Rules in Karnataka:\n\n• Mandatory for both rider AND pillion under MVA 2019\n• Must be ISI-certified (BIS standard IS 4151)\n• Fine: ₹1,000 for first offense\n• Repeat offense: 3-month license suspension\n• Applies everywhere — including residential areas\n• No helmet-free zones in Karnataka\n• Karnataka Traffic Police conducts regular drives in Bengaluru, Mysuru, Mangaluru\n\nNon-ISI helmets (fashion helmets) are NOT legally compliant.";
    }
    if (isTN) {
      return "🪖 Helmet Rules in Tamil Nadu:\n\n• ISI-certified helmets mandatory for all two-wheeler riders including electric scooters\n• Applies to rider and pillion passenger\n• Fine: ₹1,000 for first offense\n• Sale of open-face helmets banned at registered dealers\n• Enhanced enforcement in Chennai, Coimbatore, Madurai\n\nElectric two-wheeler riders must also wear ISI helmets — exemption does NOT apply.";
    }
    return "🪖 Helmet Rules India 2024 (MV Act 2019):\n\n• ISI-certified helmet mandatory for rider AND pillion\n• Fine for no helmet: ₹1,000 + 3-month license disqualification\n• Applies to all types of two-wheelers (bikes, scooters, electric)\n• Children must also wear helmets\n• Sikh community with turban exempted under Religious Exemption\n• Non-ISI (decorative) helmets are NOT legally valid\n\nState-specific: Karnataka, Tamil Nadu, Maharashtra enforce strictly with regular drives.";
  }

  // Seatbelt
  if (/seatbelt|seat.belt|seat belt|belt/.test(q)) {
    return "🔒 Seatbelt Rules (MV Act 2019 Section 194B):\n\n• Mandatory for ALL passengers including rear-seat occupants in four-wheelers\n• Fine: ₹1,000 per violation\n• Driver is responsible for ensuring all passengers are belted\n• Child restraint systems (car seats) mandatory for children under 14 years\n• Applies to all four-wheelers — cars, SUVs, taxis, Ola/Uber\n\nAs of 2023, Maharashtra, Tamil Nadu, Karnataka have enhanced enforcement for rear-seat seatbelts.";
  }

  // Speeding
  if (/speed|speeding|over.*speed|fast|km.?h|mph/.test(q)) {
    return "🚗 Speeding Fines (MV Act 2019):\n\n• Light Motor Vehicle (car/bike): ₹1,000–₹2,000 first offense; ₹2,000–₹4,000 repeat\n• Heavy vehicles: ₹2,000–₹4,000 first; ₹4,000–₹8,000 repeat\n• Licence suspended if driving 40 km/h over limit\n\n📏 Speed Limits India:\n• City/urban roads: 40–60 km/h\n• National Highways: 100–120 km/h (cars/bikes)\n• Express Highways: up to 120 km/h\n• School/hospital zones: 25 km/h\n• Residential areas: 30 km/h\n• Heavy vehicles: max 65 km/h on highways\n\nAutomated speed cameras active on NH-48, Yamuna Expressway, and most expressways.";
  }

  // Mobile phone
  if (
    /mobile|phone|cell|calling|whatsapp|text.*driv|driv.*text|hands?.free/.test(
      q,
    )
  ) {
    return "📱 Mobile Phone While Driving (MV Act Section 184):\n\n• Using handheld mobile: ₹1,000–₹5,000 first offense\n• Second offense: up to ₹10,000 + license suspension\n• Applies to all vehicle types\n• Checking notifications/texting is always illegal\n• Hands-free calling with car kit may be permissible in some states\n• Enhanced fine in school/hospital zones\n\nDo NOT use your phone while driving — even at traffic signals!";
  }

  // Red light / signal jumping
  if (/red.?light|signal.?jump|traffic.?light|jump.*signal/.test(q)) {
    return "🚦 Red Light Jumping (MV Act 2019):\n\n• Fine: ₹1,000–₹5,000 first offense\n• Repeat offense: up to ₹10,000\n• License may be suspended for 1 year on repeat\n• E-challan automatically generated by signal cameras\n• Applicable for all signal violations including amber-light rushing\n\nE-challans are sent via SMS to the registered mobile number of the vehicle owner within 24 hours.";
  }

  // Triple riding
  if (/triple|three.?person|three.*wheel|3.*person.*bike/.test(q)) {
    const isDelhi = /delhi|new.?delhi/.test(q);
    if (isDelhi) {
      return "🛵 Triple Riding in Delhi (MV Act 2019):\n\n• Fine: ₹1,000 for first offense\n• Repeat offense: ₹2,000 + license suspension\n• Only driver + one pillion allowed on two-wheelers\n• Delhi Traffic Police enforces strictly in central Delhi, CP, and Lajpat Nagar during peak hours\n• E-challan sent automatically via traffic cameras\n\nRemember: Three people on a two-wheeler is a serious safety hazard, not just a legal violation.";
    }
    return "🛵 Triple Riding on Two-Wheelers:\n\n• Fine: ₹1,000 (first offense), ₹2,000 (repeat)\n• License suspension on repeat offense\n• Only rider + ONE pillion passenger allowed\n• Strictly enforced in Delhi, Mumbai, Bengaluru, and Chennai\n• Children count as passengers — parent + child + adult pillion is triple riding\n\nAll states enforce this uniformly under the Motor Vehicles Act 2019.";
  }

  // Wrong side / wrong direction
  if (/wrong.?side|wrong.?way|one.?way|reverse.*lane|contraflow/.test(q)) {
    return "⚠️ Wrong Side Driving:\n\n• Fine: ₹500–₹1,000 for wrong side driving\n• Dangerous driving: up to ₹5,000\n• Points deducted from driving record\n• In Bengaluru, 18 new one-way roads added in 2024 — wrong-way driving attracts towing (₹2,000 storage)\n• Delhi, Mumbai, Pune have strict camera enforcement on one-way zones\n\nDangerous driving that endangers life can attract criminal charges under IPC.";
  }

  // No license / without license
  if (/no.?licen|without.?licen|unlicen|no dl|without dl/.test(q)) {
    return "📋 Driving Without License (MV Act Section 3/181):\n\n• Fine: ₹5,000\n• Repeat offense: ₹10,000\n• Vehicle may be impounded\n• Disqualified from obtaining license for 1 year\n\n🚨 Minors driving (underage):\n• Guardian/owner: ₹25,000 fine + 3-year imprisonment\n• Vehicle registration CANCELLED\n• Minor barred from getting license until age 25\n\nDigiLocker driving license copy is legally valid — carry it on your phone!";
  }

  // No insurance
  if (/no.?insurance|without.?insurance|expired.?insurance|uninsured/.test(q)) {
    return "🔒 Driving Without Insurance (MV Act Section 196):\n\n• First offense: ₹2,000 fine + possible 3-month imprisonment\n• Repeat offense: ₹4,000 fine\n• Vehicle impounded until valid insurance produced\n• Third-party insurance is minimum requirement by law\n• Comprehensive insurance strongly recommended\n\nYou can check vehicle insurance status at: vahan.parivahan.gov.in/vahanservice/\nInsurance must be valid — even one day's gap is a violation.";
  }

  // Overloading
  if (
    /overload|excess.?weight|weight.?limit|extra.*passenger|overcrowded/.test(q)
  ) {
    return "⚖️ Vehicle Overloading Fines:\n\n• Commercial vehicles: ₹20,000 + ₹2,000 per tonne over limit\n• Repeat offense: ₹40,000 + license suspension\n• Tractor overloading: ₹10,000 (first), ₹20,000 (repeat)\n• Vehicle detained at check post until load reduced\n• Strict enforcement on national highways at weigh bridges\n\nPassenger overloading in buses: ₹500 per excess passenger. Driver responsible for compliance.";
  }

  // PUC / pollution
  if (/puc|pollution|emission|bs6|exhaust|smoke/.test(q)) {
    return "🌿 PUC Certificate Rules (MV Act 2019):\n\n• Driving without valid PUC: ₹10,000 fine OR 6-month imprisonment\n• Repeat offense: ₹10,000\n• Vehicle may be detained\n• PUC validity: 1 year for BS6 vehicles; 6 months for older vehicles\n\n✅ Exemptions:\n• Electric vehicles (EVs) are 100% exempt from PUC requirement\n• Hybrid vehicles still need PUC (they have combustion engine)\n\nPUC can be done at any authorized fuel station or testing center.";
  }

  // Wrong parking
  if (/park|no.?park|parking.*fine|tow|towing/.test(q)) {
    return "🅿️ Parking Violations:\n\n• Wrong parking fine: ₹500 (first offense), ₹1,000 (repeat)\n• Vehicle towing: ₹1,000–₹2,000 towing charge + storage fees\n• Mumbai tow-away zones: very strictly enforced\n• Delhi: Yellow-line no-parking areas have zero tolerance\n• Bengaluru: Smart City towing vans operate 24x7 in CBD areas\n\nTo retrieve a towed vehicle: visit nearest traffic police station with RC, DL, and insurance.";
  }

  // Documents required
  if (/document|papers|carry|require|what.*need|id.?proof|rc book/.test(q)) {
    return "📂 Documents Required While Driving (MV Act 2019):\n\n1. **Driving License** — original or DigiLocker copy\n2. **Registration Certificate (RC)** — original or digital\n3. **Insurance Certificate** — valid third-party minimum\n4. **PUC Certificate** — valid Pollution Under Control\n5. **Fitness Certificate** — for commercial vehicles only\n\n✅ Digital documents via DigiLocker or mParivahan app are legally valid nationwide (Rule 139A, CMV Rules).\n\nPolice cannot demand physical copies if valid digital documents are presented. Fine for not carrying: ₹500–₹5,000 per missing document.";
  }

  // Driving license renewal / learner license
  if (
    /licen.*renew|renew.*licen|expired.*licen|learner|llr|learning.*licen/.test(
      q,
    )
  ) {
    return "📋 Driving License Renewal & Application:\n\n🔄 Renewal Process:\n• Apply at Parivahan.gov.in (Sarathi portal) or nearest RTO\n• Required: Form LLR, medical certificate (age 40+/transport license), passport photo, address proof, age proof\n• Fee: ₹200–₹500\n• Driving test required if expired more than 1 year\n\n🆕 Learner License (LLR):\n• Valid for 6 months\n• Minimum age: 16 for gearless <50cc; 18 for all other vehicles\n• Apply online at sarathi.parivahan.gov.in\n• Test includes traffic signs, rules, basic vehicle knowledge\n\nDL validity: 20 years or until age 50 (whichever is earlier). After 50, renewal every 5 years.";
  }

  // Challan check / pay online
  if (
    /challan.*check|check.*challan|pending.*challan|pay.*challan|online.*challan|echallan/.test(
      q,
    )
  ) {
    return "💻 How to Check & Pay Challan Online:\n\n1. **echallan.parivahan.gov.in** — Official Government Portal\n2. **mParivahan App** — Official government mobile app\n3. **State-specific portals**:\n   • Delhi: delhitrafficpolice.nic.in\n   • Maharashtra: mahatrafficpolice.gov.in\n   • Karnataka: karnatakapolice.gov.in\n\nYou need: Vehicle Registration Number or Driving License Number\n\nPayment accepted via: UPI, net banking, debit/credit card\n\nChallan SMS is sent to registered mobile number of vehicle owner within 24 hours of violation.";
  }

  // DigiLocker
  if (/digilocker|mparivahan|digital.?doc|virtual.?doc|e.?doc/.test(q)) {
    return "📱 DigiLocker & mParivahan Documents:\n\nDigiLocker and mParivahan documents are legally valid across India under Rule 139A of Central Motor Vehicles Rules.\n\n✅ Valid documents via DigiLocker:\n• Driving License (DL)\n• Vehicle Registration Certificate (RC)\n• Insurance Certificate\n• PUC Certificate\n• Fitness Certificate\n\nPolice officers CANNOT demand physical copies if you present DigiLocker documents. This was upheld by multiple High Courts after MV Act 2019 amendment.\n\nDownload: DigiLocker app or mParivahan app (both on Play Store/App Store).";
  }

  // Delhi specific
  if (/delhi|new.?delhi/.test(q)) {
    return "🏙️ Delhi Traffic Rules & Regulations:\n\n• E-challan system fully active — cameras cover 1000+ intersections\n• Odd-Even scheme activated during pollution emergencies (Nov–Dec)\n• Congestion charges on certain routes near central Delhi\n• Speed cameras on NH-48, NH-44, Yamuna Expressway\n• No-honking zones: near hospitals, courts, schools\n• New speed limits (2024): NH-48: 100 km/h cars, 80 km/h SUVs/MUVs\n\n📍 ANPR cameras: Automatic Number Plate Recognition is live across Delhi — challans sent automatically within 24 hours.";
  }

  // Maharashtra / Mumbai
  if (/maharashtra|mumbai|pune|nagpur|nashik/.test(q)) {
    return "🏙️ Maharashtra Traffic Rules:\n\n• Drunk driving fine enhanced to ₹15,000 (Jan 2024, up from ₹10,000)\n• Mumbai: strict no-parking tow-away zones operational 24x7\n• Pune-Mumbai Expressway: speed cameras active, 120 km/h limit\n• Toll evasion: 3x penalty at NHAI toll plazas\n• Rear seatbelt enforcement enhanced from 2023\n• Breathalyzer checkpoints at 500+ locations across Mumbai, Pune, Nagpur during night\n\n📱 Check challans: mahatrafficpolice.gov.in or mParivahan app.";
  }

  // Karnataka / Bengaluru
  if (
    /karnataka|bangalore|bengaluru|mysore|mysuru|mangaluru|mangalore/.test(q)
  ) {
    return "🏙️ Karnataka Traffic Rules:\n\n• Helmet mandatory for rider AND pillion (strictly enforced)\n• No-horn zones near hospitals and schools: ₹1,000–₹2,000 fine\n• E-challan system with 50+ cameras citywide in Bengaluru\n• 18 new one-way roads added in Whitefield, Electronic City, Koramangala (Jan 2024)\n• Wrong-way on one-way: ₹500 + towing (₹2,000 storage charge)\n• BMTC bus lanes strictly enforced on Outer Ring Road\n\n📱 Check challans: karnatakapolice.gov.in or mParivahan app.";
  }

  // Tamil Nadu / Chennai
  if (/tamil.?nadu|chennai|coimbatore|madurai|trichy/.test(q)) {
    return "🏙️ Tamil Nadu Traffic Rules:\n\n• Enhanced penalties for rash and negligent driving\n• ISI helmets mandatory — open-face helmet sale banned at registered dealers\n• Chennai OMR speed cameras active\n• Vehicle fitness certificate strict for vehicles more than 5 years old\n• Electric two-wheeler riders: helmet mandatory (no exemption)\n• No-horn enforcement near Anna University, hospitals, and courts\n\n📱 Check challans: tnstc.in or mParivahan app.";
  }

  // Speed limits
  if (/speed.?limit|maximum.?speed|how.?fast|speed.?zone/.test(q)) {
    return "🚗 Speed Limits in India (MV Act 2019):\n\n• City/Urban roads: 40–60 km/h\n• National Highways: 100 km/h (cars), 80 km/h (two-wheelers)\n• Express Highways: up to 120 km/h for cars\n• School/Hospital zones: 25 km/h\n• Residential areas: 30 km/h\n• Heavy vehicles (trucks/buses): max 65 km/h on highways\n\n📸 Speed camera locations:\n• NH-48 (Delhi–Gurgaon), NH-44, Yamuna Expressway\n• Mumbai-Pune Expressway, Bengaluru Outer Ring Road\n• All major expressways have automated cameras\n\nFine for speeding: ₹1,000–₹4,000 depending on vehicle type and excess speed.";
  }

  // MV Act 2019
  if (/mv act|motor.?vehicle|mva|section.*\d+|\d+.*section/.test(q)) {
    return "⚖️ Motor Vehicles Act 2019 — Key Provisions:\n\n• Dramatically increased fines for most violations (5x–10x vs old rules)\n• Electronic challans (e-challan) system mandated\n• DigiLocker documents legally valid\n• Hit-and-run compensation: ₹2 lakh (death), ₹50,000 (grievous injury)\n• Good Samaritan protection: first responders legally protected\n• Mandatory vehicle fitness for all vehicles\n• Third-party insurance compulsory\n\nKey sections: 183 (Speeding), 184 (Dangerous Driving), 185 (DUI), 194 (Overloading), 194B (Seatbelt), 196 (No Insurance).";
  }

  // Insurance
  if (/insurance|insur|third.?party|comprehensive/.test(q)) {
    return "🔒 Vehicle Insurance Rules India:\n\n• Third-party insurance: LEGALLY MANDATORY for all vehicles\n• Comprehensive insurance: highly recommended (covers own damage)\n• Driving without insurance: ₹2,000 fine + possible imprisonment\n• Long-term insurance: 3-year for new two-wheelers, 5-year for new four-wheelers\n• Insurance can be checked at vahan.parivahan.gov.in\n\n📋 Third-party covers: damage to other vehicles, people, and property.\nComprehensive covers: own damage, theft, natural calamities + third-party.\n\nDigiLocker insurance certificate is legally valid at traffic checkpoints.";
  }

  // Hit and run
  if (/hit.?and.?run|accident.?flee|flee.*accident|leave.*scene/.test(q)) {
    return "🚨 Hit-and-Run Laws in India (MV Act 2019 + IPC):\n\n• Fleeing an accident scene: up to 10 years imprisonment under updated IPC\n• Legal duty to provide aid to injured persons (Good Samaritan Rule)\n• Compensation for victims: ₹2 lakh (death), ₹50,000 (grievous injury) from Solatium Fund\n• Claims processed within 30 days\n• Anonymous accident reporting: 1073 (National Accident Helpline)\n\nGood Samaritan Protection: If you help an accident victim, you are LEGALLY PROTECTED from harassment by police or hospitals.";
  }

  // EVs
  if (
    /electric|ev |e-vehicle|electric.?car|electric.?bike|electric.?scooter/.test(
      q,
    )
  ) {
    return "⚡ Electric Vehicle (EV) Rules India:\n\n✅ EVs ARE Exempt from:\n• PUC/Emission certificate (zero tailpipe emissions)\n\n❌ EVs are NOT Exempt from:\n• Driving license requirement\n• Vehicle registration (RC)\n• Third-party insurance (mandatory)\n• All traffic rules (speed limits, signals, etc.)\n• Helmet requirement for two-wheel EVs\n• Seatbelt for four-wheel EVs\n\nHybrid vehicles: still require PUC (they have combustion engine).\nEV charging station use: no special traffic rules, follow standard parking laws.";
  }

  // Emergency / accident
  if (/accident|emergency|crash|collision|injured/.test(q)) {
    return "🚑 In Case of Accident — What to Do:\n\n1. **Stop immediately** — fleeing is a criminal offense\n2. **Call 108** — Ambulance (free, all India)\n3. **Call 100** — Police (mandatory for accidents)\n4. **Call 1073** — National Road Safety Helpline\n5. Provide first aid if safe to do so (you are legally protected)\n\n⚖️ Legal duties:\n• Report accident to nearest police station within 24 hours\n• Cooperate with investigation\n• Get medical help for injured parties immediately\n\nGood Samaritan Law: You will NOT be harassed by police or hospitals if you bring an accident victim to hospital.";
  }

  // Keyword-based fallback for general fine/challan queries
  if (/fine|challan|penalty|fee|amount|how much|cost/.test(q)) {
    return "💰 Common Traffic Fine Reference (MV Act 2019):\n\n| Violation | First Offense | Repeat |\n|-----------|--------------|--------|\n| No Helmet | ₹1,000 | ₹2,000 |\n| No Seatbelt | ₹1,000 | ₹1,500 |\n| Drunk Driving | ₹10,000 | ₹15,000 |\n| Speeding | ₹1,000–₹2,000 | ₹2,000–₹4,000 |\n| Red Light | ₹1,000–₹5,000 | ₹10,000 |\n| Mobile Phone | ₹1,000–₹5,000 | ₹10,000 |\n| No License | ₹5,000 | ₹10,000 |\n| No Insurance | ₹2,000 | ₹4,000 |\n| No PUC | ₹10,000 | ₹10,000 |\n| Overloading | ₹20,000+ | ₹40,000+ |\n\nFor state-specific fines, use the Challan Calculator tab or ask me about a specific violation!";
  }

  // Generic law query
  return `⚖️ Traffic Law Query: "${message}"\n\nUnder the Motor Vehicles Act 2019, India has significantly enhanced traffic fines and enforcement. For your specific query:\n\n• Use the **Challan Calculator** tab for precise fine calculation by state and violation type\n• Check **echallan.parivahan.gov.in** for official fine amounts\n• For state-specific rules, ask me about your state directly (e.g., 'traffic rules in Delhi')\n• For documents, ask: 'What documents are required while driving?'\n• For license queries, ask: 'How to renew driving license?'\n\nI'm here to help! Try asking something like 'What is the fine for drunk driving?' or 'What documents do I need while driving?'`;
}

const AI_QUICK_ANSWERS: Record<string, string> = {
  "What is the fine for drunk driving?":
    "Drunk driving in India is treated as a serious offense under MV Act 2019. First offense: ₹10,000 fine or up to 6 months imprisonment. Second offense within 3 years: ₹15,000 fine or up to 2 years imprisonment. Blood Alcohol Content (BAC) limit is 30 mg per 100 ml of blood. Your licence is cancelled for 2 years on first offense and permanently on the third offense.",
  "Can I show documents on DigiLocker?":
    "Yes! Under Rule 139A of the Central Motor Vehicles Rules, documents stored in DigiLocker (mParivahan app) are legally valid everywhere in India. This includes DL, RC, Insurance, and PUC certificates. Police officers cannot demand physical copies if you present a valid DigiLocker document. This was upheld by multiple High Courts after MV Act 2019 amendment.",
  "What is the seatbelt rule for rear passengers?":
    "As per MV Act 2019, wearing seatbelts is mandatory for ALL passengers including rear-seat occupants in four-wheelers. The fine is ₹1,000 for non-compliance. The driver is responsible for ensuring all passengers are belted. Several states including Maharashtra, Tamil Nadu, and Karnataka have increased enforcement from 2023 onwards.",
  "How do I check my challan online?":
    "You can check your pending challan on: (1) echallan.parivahan.gov.in — official government portal, (2) mParivahan app — official government app, (3) State-specific traffic police websites (e.g., delhitrafficpolice.nic.in). You need your vehicle registration number or DL number. You can also pay challan online via UPI, net banking, or debit card on these platforms.",
  "What is the fine for using mobile while driving?":
    "Using a handheld mobile phone while driving attracts a fine of ₹1,000–₹5,000 under Section 184 of MV Act. On a second offense the fine goes up to ₹10,000 and your licence can be suspended. This applies to all vehicle types. Hands-free calling with a car kit or earphones may be permissible in some states but checking notifications/texting is always illegal.",
  "Are electric vehicles exempt from PUC rules?":
    "Electric vehicles (EVs) are completely exempt from Pollution Under Control (PUC) certificate requirements since they have zero tailpipe emissions. This was clarified by MoRTH in 2019. However, EVs must still comply with all other road safety regulations including valid DL, RC, insurance, and traffic rules. Hybrid vehicles still require PUC as they have an internal combustion engine.",
};

const LEGAL_UPDATES: LegalUpdate[] = [
  {
    id: 1,
    title: "Increased Penalties for Drunk Driving in Maharashtra",
    description:
      "Maharashtra government enhances drunk driving fines by 50% over MV Act baseline.",
    detail:
      "Effective January 2024, Maharashtra has issued state-level guidelines increasing drunk driving penalties. First offense fine raised to ₹15,000 (up from ₹10,000). Breathalyzer checkpoints now mandatory at 500+ locations across Mumbai, Pune, and Nagpur during nights and weekends. Licence suspension period extended from 2 years to 3 years.",
    date: "15 Jan 2024",
    scope: "State",
    state: "Maharashtra",
    severity: "Critical",
  },
  {
    id: 2,
    title: "DigiLocker Documents Now Legally Valid Nationwide",
    description:
      "MoRTH confirms DigiLocker and mParivahan documents are valid alternatives to physical papers.",
    detail:
      "Ministry of Road Transport & Highways has issued a circular confirming that digital documents via DigiLocker and mParivahan are legally valid across all states. Traffic police cannot demand physical documents if digital versions are presented. This covers DL, RC, Insurance Certificate, PUC Certificate, and Fitness Certificate.",
    date: "3 Mar 2024",
    scope: "Central",
    severity: "Important",
  },
  {
    id: 3,
    title: "New Speed Limits on Delhi Expressways",
    description:
      "Delhi Traffic Police revises speed limits on NH-48 and Yamuna Expressway.",
    detail:
      "Delhi Traffic Police has revised speed limits: NH-48 (Delhi-Gurgaon): 100 km/h for cars, 80 km/h for SUVs/MUVs; Yamuna Expressway: 100 km/h for cars, 60 km/h for heavy vehicles during night (10 PM–6 AM). Automated speed cameras installed at 25 new locations. Violations automatically generate e-challans.",
    date: "20 Feb 2024",
    scope: "State",
    state: "Delhi",
    severity: "Important",
  },
  {
    id: 4,
    title: "Mandatory Dashcam Rule Proposed for Commercial Vehicles",
    description:
      "Central government proposes dashcam requirement for all commercial vehicles over 3.5 tonnes.",
    detail:
      "MoRTH has issued a draft notification proposing mandatory dashboard cameras for all commercial vehicles above 3.5 tonnes GVW. The cameras must record continuously and footage must be preserved for 60 days. Deadline for compliance is proposed as December 2024. This move aims to reduce truck-related accidents on national highways.",
    date: "8 Feb 2024",
    scope: "Central",
    severity: "Info",
  },
  {
    id: 5,
    title: "Helmet Mandate Extended to Electric Two-Wheelers in Tamil Nadu",
    description:
      "Tamil Nadu mandates ISI helmets for all electric scooter/motorcycle riders.",
    detail:
      "Tamil Nadu Transport Department has clarified that helmet mandate applies equally to all electric two-wheelers. ISI-certified helmets (IS 4151) are mandatory. Non-ISI helmets are not considered compliant. Fine: ₹1,000 for first offense. State government also banned open-face helmet sales for two-wheelers at registered dealers.",
    date: "1 Feb 2024",
    scope: "State",
    state: "Tamil Nadu",
    severity: "Important",
  },
  {
    id: 6,
    title: "MV Act Section 164A: Enhanced Hit-and-Run Compensation",
    description:
      "Central government triples the compensation amount for hit-and-run accident victims.",
    detail:
      "The Central Motor Vehicles (Amendment) Rules 2024 enhance hit-and-run compensation. Death in road accident: ₹2 lakh (up from ₹50,000). Grievous injury: ₹50,000 (up from ₹12,500). Payments are processed through the Solatium Fund within 30 days of claim. Drivers fleeing accident scenes now face 10-year imprisonment under updated IPC provisions.",
    date: "26 Jan 2024",
    scope: "Central",
    severity: "Critical",
  },
  {
    id: 7,
    title: "Rajasthan Bans Tinted Films on Vehicle Windows",
    description:
      "Rajasthan Transport Department enforces ban on non-standard tinted window films.",
    detail:
      "Rajasthan has cracked down on illegal tinted window films on all vehicle types. Permitted visible light transmission (VLT): front windshield 70%, side/rear windows 50%. Non-compliant films attract ₹500 fine and mandatory film removal. Special drives conducted on NH-48, NH-58, and Jaipur-Ajmer highway.",
    date: "10 Jan 2024",
    scope: "State",
    state: "Rajasthan",
    severity: "Info",
  },
  {
    id: 8,
    title: "GPS Tracking Mandatory for All School Buses: MoRTH Circular",
    description:
      "All school buses must install real-time GPS tracking as per new MoRTH guidelines.",
    detail:
      "MoRTH has issued binding guidelines requiring all school buses to install VLTD (Vehicle Location Tracking Device). The device must be connected to the state transport authority's monitoring centre. Non-compliance: ₹2,000 fine for first offense; permit cancellation on repeat. The rule covers private school buses, government school transport, and contract carriages transporting children.",
    date: "5 Dec 2023",
    scope: "Central",
    severity: "Important",
  },
  {
    id: 9,
    title: "New One-Way Zones in Bengaluru — Traffic Violations Alert",
    description:
      "Bengaluru Traffic Police implements 18 new one-way streets from January 2024.",
    detail:
      "Bengaluru Traffic Police has converted 18 roads to one-way traffic in Whitefield, Electronic City, and Koramangala areas to ease congestion. Driving the wrong way on these roads: ₹500 fine. Signboards and road markings are being installed. Violations also attract towing with ₹2,000 storage charge. The full list of new one-way roads is available on Bengaluru Traffic Police website.",
    date: "1 Jan 2024",
    scope: "State",
    state: "Karnataka",
    severity: "Info",
  },
  {
    id: 10,
    title: "Bike Taxi Services Legalised in More States",
    description:
      "UP, Haryana, and Gujarat join Delhi and Karnataka in legalising bike taxi operations.",
    detail:
      "Three more states have legalised bike taxi services under new state motor vehicle rules. Bike taxi riders must have commercial driving endorsement on their licence (available at RTO). Passenger insurance is mandatory. Apps like Rapido and Ola Bike can now operate legally. Drivers must wear reflective jackets and carry valid permits. Fine for operating without permit: ₹5,000.",
    date: "15 Nov 2023",
    scope: "Central",
    severity: "Info",
  },
];

function calculateFine(
  violation: string,
  vehicleType: string,
  offense: string,
): FineResult {
  const violationData = FINE_DATA[violation] ?? FINE_DATA["Signal Jumping"];
  const entry = violationData[vehicleType] ?? violationData.default;
  const isRepeat = offense !== "1st Offense";
  const amount = isRepeat ? entry.repeat : entry.base;
  const multiplier = offense === "3rd Offense" ? 2 : 1;
  return {
    fineAmount: `₹${(amount * multiplier).toLocaleString("en-IN")}`,
    additionalPenalties: entry.penalties,
    licenseImpact: entry.license,
    seizureRisk: entry.seizure,
  };
}

function SeverityBadge({ severity }: { severity: LegalUpdate["severity"] }) {
  if (severity === "Critical")
    return (
      <Badge className="bg-destructive/20 text-destructive border-destructive/40 text-xs">
        Critical
      </Badge>
    );
  if (severity === "Important")
    return (
      <Badge className="bg-warning/20 text-warning border-warning/40 text-xs">
        Important
      </Badge>
    );
  return (
    <Badge className="bg-primary/20 text-primary border-primary/40 text-xs">
      Info
    </Badge>
  );
}

function SeverityIcon({ severity }: { severity: LegalUpdate["severity"] }) {
  if (severity === "Critical")
    return <AlertCircle className="h-4 w-4 text-destructive shrink-0" />;
  if (severity === "Important")
    return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
  return <Info className="h-4 w-4 text-primary shrink-0" />;
}

function ChatTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Namaste! I'm your DriveLegal AI Assistant. Ask me anything about Indian traffic laws, fines, challans, or road rules. I can help you understand the Motor Vehicles Act 2019 and state-specific regulations.",
      timestamp: new Date(),
    },
    {
      id: 2,
      role: "user",
      content: "What is the fine for triple riding in Delhi?",
      timestamp: new Date(),
    },
    {
      id: 3,
      role: "ai",
      content: AI_RESPONSES["What is the fine for triple riding in Delhi?"],
      timestamp: new Date(),
    },
    {
      id: 4,
      role: "user",
      content: "What documents needed for driving in Maharashtra?",
      timestamp: new Date(),
    },
    {
      id: 5,
      role: "ai",
      content:
        AI_RESPONSES["What documents needed for driving in Maharashtra?"],
      timestamp: new Date(),
    },
    {
      id: 6,
      role: "user",
      content: "What are helmet rules in Karnataka?",
      timestamp: new Date(),
    },
    {
      id: 7,
      role: "ai",
      content: AI_RESPONSES["What are helmet rules in Karnataka?"],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(8);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll-to-bottom on message count/typing change
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    const delay = 800 + Math.floor(Math.random() * 600);
    setTimeout(() => {
      const aiReply =
        AI_QUICK_ANSWERS[text.trim()] ??
        AI_RESPONSES[text.trim()] ??
        generateAIResponse(text.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "ai",
          content: aiReply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[480px]">
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            data-ocid="drivelegal.quick_question"
            onClick={() => sendMessage(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-primary/10 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {q}
          </button>
        ))}
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3"
        data-ocid="drivelegal.chat_list"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mr-2 shrink-0 mt-1">
                <Scale className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent/25 text-foreground border border-accent/40 rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}
            >
              {msg.role === "ai" ? (
                <span className="whitespace-pre-wrap">
                  {msg.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                    i % 2 === 1 ? (
                      <strong
                        // biome-ignore lint/suspicious/noArrayIndexKey: static split array, safe
                        key={i}
                        className="font-semibold text-primary/90"
                      >
                        {part}
                      </strong>
                    ) : (
                      part
                    ),
                  )}
                </span>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mr-2 shrink-0">
              <Scale className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          data-ocid="drivelegal.chat_input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about traffic laws, fines, documents..."
          className="flex-1 bg-card border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
        />
        <Button
          type="button"
          data-ocid="drivelegal.send_button"
          onClick={() => sendMessage(input)}
          disabled={isTyping || !input.trim()}
          className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ChallanCalculatorTab() {
  const [state, setState] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [violation, setViolation] = useState("");
  const [offense, setOffense] = useState("1st Offense");
  const [result, setResult] = useState<FineResult | null>(null);

  function handleCalculate() {
    if (!state || !vehicle || !violation) return;
    setResult(calculateFine(violation, vehicle, offense));
  }

  const seizureColor =
    result?.seizureRisk === "High"
      ? "text-destructive"
      : result?.seizureRisk === "Medium"
        ? "text-warning"
        : "text-[oklch(0.62_0.19_155)]";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            State / UT
          </span>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger
              data-ocid="drivelegal.state_select"
              className="bg-card border-input"
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Vehicle Type
          </span>
          <Select value={vehicle} onValueChange={setVehicle}>
            <SelectTrigger
              data-ocid="drivelegal.vehicle_select"
              className="bg-card border-input"
            >
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Violation</span>
          <Select value={violation} onValueChange={setViolation}>
            <SelectTrigger
              data-ocid="drivelegal.violation_select"
              className="bg-card border-input"
            >
              <SelectValue placeholder="Select violation" />
            </SelectTrigger>
            <SelectContent>
              {VIOLATIONS.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">
            Number of Offenses
          </span>
          <Select value={offense} onValueChange={setOffense}>
            <SelectTrigger
              data-ocid="drivelegal.offense_select"
              className="bg-card border-input"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Offense">1st Offense</SelectItem>
              <SelectItem value="2nd Offense">2nd Offense</SelectItem>
              <SelectItem value="3rd Offense">3rd Offense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        type="button"
        data-ocid="drivelegal.calculate_button"
        onClick={handleCalculate}
        disabled={!state || !vehicle || !violation}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 rounded-xl"
      >
        <Calculator className="h-4 w-4 mr-2" />
        Calculate Fine
      </Button>
      {result && (
        <Card
          className="bg-card border-border"
          data-ocid="drivelegal.fine_result"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Fine Calculation Result
              <Badge className="ml-auto bg-primary/20 text-primary border-primary/40 text-xs">
                MV Act 2019
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Fine Amount
                </p>
                <p className="text-2xl font-bold font-display text-foreground">
                  {result.fineAmount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {offense} · {state}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Seizure Risk
                </p>
                <p
                  className={`text-2xl font-bold font-display ${seizureColor}`}
                >
                  {result.seizureRisk}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{vehicle}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Additional Penalties
                </p>
                <p className="text-sm text-foreground">
                  {result.additionalPenalties}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  License Impact
                </p>
                <p className="text-sm text-foreground">
                  {result.licenseImpact}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * Fine amounts based on Motor Vehicles (Amendment) Act 2019. State
              governments may levy additional surcharges. Consult local RTO for
              exact current amounts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LegalUpdatesTab() {
  const [scopeFilter, setScopeFilter] = useState<"All" | "Central" | "State">(
    "All",
  );
  const [severityFilter, setSeverityFilter] = useState<
    "All" | "Critical" | "Important" | "Info"
  >("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = LEGAL_UPDATES.filter((u) => {
    if (scopeFilter !== "All" && u.scope !== scopeFilter) return false;
    if (severityFilter !== "All" && u.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground mr-1">Scope:</span>
        {(["All", "Central", "State"] as const).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid={`drivelegal.scope_filter.${f.toLowerCase()}`}
            onClick={() => setScopeFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              scopeFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="text-xs text-muted-foreground mx-2">Severity:</span>
        {(["All", "Critical", "Important", "Info"] as const).map((f) => (
          <button
            key={f}
            type="button"
            data-ocid={`drivelegal.severity_filter.${f.toLowerCase()}`}
            onClick={() => setSeverityFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              severityFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2" data-ocid="drivelegal.updates_list">
        {filtered.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="drivelegal.updates.empty_state"
          >
            No updates match the selected filters.
          </div>
        )}
        {filtered.map((update, idx) => (
          <Card
            key={update.id}
            className="bg-card border-border overflow-hidden"
            data-ocid={`drivelegal.update.item.${idx + 1}`}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() =>
                setExpandedId(expandedId === update.id ? null : update.id)
              }
            >
              <div className="flex items-start gap-3 p-4">
                <SeverityIcon severity={update.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {update.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {update.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <SeverityBadge severity={update.severity} />
                    <Badge
                      variant="outline"
                      className="text-xs border-border text-muted-foreground"
                    >
                      {update.scope === "State" ? update.state : "Central"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {update.date}
                    </span>
                  </div>
                </div>
                {expandedId === update.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                )}
              </div>
            </button>
            {expandedId === update.id && (
              <div className="px-4 pb-4 border-t border-border pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {update.detail}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

const LICENSE_SECTIONS = [
  {
    title: "Learner's Licence (LL)",
    icon: BookOpen,
    color: "text-primary",
    agility: "Must hold for minimum 30 days before applying for permanent DL.",
    age: "16 years (50cc two-wheeler); 18 years (all other vehicles)",
    fee: "₹200 (application) + ₹50 (test fee)",
    validity: "6 months from issue date",
    steps: [
      {
        label: "Eligibility Check",
        detail:
          "Verify age: 16+ for 50cc two-wheelers, 18+ for all other vehicles. No vision impairment.",
      },
      {
        label: "Fill Form 1 & 2",
        detail:
          "Form 1: medical self-declaration. Form 2: LL application. Available at RTO or online at parivahan.gov.in.",
      },
      {
        label: "Submit Documents",
        detail:
          "Age proof (Aadhaar/Birth Certificate), Address proof (Aadhaar/Voter ID), 2 passport photos, ₹200 fee.",
      },
      {
        label: "LL Test (Online)",
        detail:
          "Multiple-choice theory test at RTO. 20 questions, 60% pass mark. Test covers traffic signs, rules, first aid.",
      },
      {
        label: "Collect LL",
        detail:
          "LL issued same day. Valid 6 months. Must carry LL while driving under supervision.",
      },
    ],
    documents: [
      "Aadhaar Card / Passport (age + address proof)",
      "Date of Birth proof (if not on Aadhaar)",
      "2 recent passport-size photographs",
      "Form 1 (medical self-declaration)",
      "Application fee: ₹200",
    ],
  },
  {
    title: "Permanent Driving Licence (DL)",
    icon: Shield,
    color: "text-[oklch(0.62_0.19_155)]",
    agility: "Apply after holding Learner's Licence for at least 30 days.",
    age: "18 years (private vehicles); 20 years (transport/commercial vehicles)",
    fee: "₹400 (application) + ₹200 (test fee) + ₹200 (smart card)",
    validity:
      "20 years or until age 50 (whichever is earlier); then renewable every 5 years",
    steps: [
      {
        label: "Wait 30 Days",
        detail:
          "You must have held your Learner's Licence for at least 30 days before applying.",
      },
      {
        label: "Book Driving Test Slot",
        detail:
          "Book online at parivahan.gov.in or visit RTO. Slots are available at dedicated testing tracks.",
      },
      {
        label: "Practical Driving Test",
        detail:
          "Test conducted at RTO on a designated course. Inspector evaluates vehicle control, road sense, and following traffic rules.",
      },
      {
        label: "Document Verification",
        detail:
          "Submit LL, age proof, address proof, medical certificate (Form 1A for transport vehicles), and fees.",
      },
      {
        label: "Smart Card Issuance",
        detail:
          "DL smart card issued within 7 working days by post. Digital DL available on DigiLocker immediately.",
      },
    ],
    documents: [
      "Original Learner's Licence",
      "Aadhaar Card / Passport",
      "Form 1A medical certificate (for commercial/transport)",
      "2 recent passport-size photographs",
      "Application fee: ₹400 + ₹200 smart card",
    ],
  },
];

const RENEWAL_STEPS = [
  {
    label: "Check Expiry",
    detail:
      "Renewal can be done 1 year before expiry. After 30 days of expiry, fine is levied.",
  },
  {
    label: "Apply Online or at RTO",
    detail:
      "Apply via parivahan.gov.in or Sarathi portal. Fill Form 9 (application for renewal).",
  },
  {
    label: "Medical Certificate",
    detail:
      "Form 1 medical self-declaration required. Form 1A needed for those above 40 years.",
  },
  {
    label: "Pay Fee & Submit",
    detail:
      "Renewal fee: ₹200. Late renewal: ₹300 extra penalty. Documents: current DL, Aadhaar, photograph.",
  },
  {
    label: "Collect Renewed DL",
    detail:
      "New smart card issued within 7 working days. DigiLocker updated immediately after approval.",
  },
];

function LicenseAccordionItem({
  label,
  detail,
}: { label: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium text-foreground">{label}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-3 pt-2 bg-muted/20">
          <p className="text-sm text-muted-foreground">{detail}</p>
        </div>
      )}
    </div>
  );
}

function LicenseGuideTab() {
  return (
    <div className="space-y-6">
      {LICENSE_SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.title} className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`h-5 w-5 ${section.color}`} />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Min Age", value: section.age.split(";")[0] },
                  { label: "Fees", value: section.fee },
                  { label: "Validity", value: section.validity },
                  { label: "Note", value: section.agility },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-xs text-foreground font-medium leading-snug">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Required Documents
                </p>
                <ul className="space-y-1">
                  {section.documents.map((doc) => (
                    <li
                      key={doc}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Application Steps
                </p>
                <div className="space-y-2">
                  {section.steps.map((step, i) => (
                    <LicenseAccordionItem
                      key={step.label}
                      label={`Step ${i + 1}: ${step.label}`}
                      detail={step.detail}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Card
        className="bg-card border-border"
        data-ocid="drivelegal.renewal_guide"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Car className="h-5 w-5 text-warning" />
            Driving Licence Renewal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {[
              { label: "Renewal Fee", value: "₹200", cls: "text-foreground" },
              {
                label: "Late Penalty",
                value: "₹300 extra",
                cls: "text-destructive",
              },
              {
                label: "Online Portal",
                value: "parivahan.gov.in",
                cls: "text-primary",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg bg-muted/30 border border-border"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className={`text-sm font-semibold ${item.cls}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {RENEWAL_STEPS.map((step, i) => (
              <LicenseAccordionItem
                key={step.label}
                label={`Step ${i + 1}: ${step.label}`}
                detail={step.detail}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DriveLegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
          <Scale className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            DriveLegal AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Smart Traffic Law Assistant · Motor Vehicles Act 2019
          </p>
        </div>
        <Badge className="ml-auto bg-[oklch(0.62_0.19_155)]/20 text-[oklch(0.62_0.19_155)] border-[oklch(0.62_0.19_155)]/40 hidden sm:flex">
          All 25 States
        </Badge>
      </div>

      <Tabs defaultValue="chatbot" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-card border border-border h-auto p-1 rounded-xl">
          <TabsTrigger
            value="chatbot"
            data-ocid="drivelegal.tab.chatbot"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">AI Chatbot</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="calculator"
            data-ocid="drivelegal.tab.calculator"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Challan Calc</span>
            <span className="sm:hidden">Fines</span>
          </TabsTrigger>
          <TabsTrigger
            value="updates"
            data-ocid="drivelegal.tab.updates"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">Legal Updates</span>
            <span className="sm:hidden">Updates</span>
          </TabsTrigger>
          <TabsTrigger
            value="license"
            data-ocid="drivelegal.tab.license"
            className="flex items-center gap-1.5 text-xs sm:text-sm py-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">DL Guide</span>
            <span className="sm:hidden">Guide</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.19_155)] animate-pulse" />
                AI Legal Assistant · Indian Traffic Laws
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ChatTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Challan Fine Calculator · MV Act 2019
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ChallanCalculatorTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="updates" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                Latest Traffic Law Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <LegalUpdatesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license" className="mt-4">
          <LicenseGuideTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
