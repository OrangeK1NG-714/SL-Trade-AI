export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: { label: string; value: string }[];
  applications: string[];
  packaging: string;
  image: string;
}

export const categories = [
  { id: "pp", name: "PP", fullName: "Polypropylene", icon: "🔵" },
  { id: "pe", name: "PE", fullName: "Polyethylene", icon: "🟢" },
  { id: "pvc", name: "PVC", fullName: "Polyvinyl Chloride", icon: "🟠" },
  { id: "abs", name: "ABS", fullName: "ABS Resin", icon: "🔴" },
  { id: "pet", name: "PET", fullName: "Polyethylene Terephthalate", icon: "🟣" },
  { id: "ps", name: "PS", fullName: "Polystyrene", icon: "🟡" },
];

export const products: Product[] = [
  {
    id: "pp-t30s",
    name: "PP T30S",
    category: "pp",
    description:
      "High-quality homopolymer polypropylene with excellent rigidity and heat resistance. Ideal for injection molding applications in packaging and household goods.",
    specs: [
      { label: "MFR", value: "3.0 g/10min" },
      { label: "Density", value: "0.90 g/cm³" },
      { label: "Tensile Strength", value: "35 MPa" },
      { label: "Heat Deflection", value: "105°C" },
    ],
    applications: ["Woven bags", "Packaging films", "Injection molding", "Fibers"],
    packaging: "25kg bags on pallets, 1000kg jumbo bags available",
    image: "/images/pp.jpg",
  },
  {
    id: "pp-v30g",
    name: "PP V30G",
    category: "pp",
    description:
      "Random copolymer PP with good transparency, flexibility, and impact strength. Suitable for transparent containers and medical packaging.",
    specs: [
      { label: "MFR", value: "8.0 g/10min" },
      { label: "Density", value: "0.90 g/cm³" },
      { label: "Tensile Strength", value: "30 MPa" },
      { label: "Transparency", value: "Good" },
    ],
    applications: ["Transparent containers", "Medical packaging", "Pipes", "Sheets"],
    packaging: "25kg bags on pallets",
    image: "/images/pp.jpg",
  },
  {
    id: "hdpe-5000s",
    name: "HDPE 5000S",
    category: "pe",
    description:
      "High-density polyethylene with excellent stiffness and chemical resistance. Perfect for blow molding containers, pipes, and industrial applications.",
    specs: [
      { label: "MFR", value: "0.35 g/10min" },
      { label: "Density", value: "0.954 g/cm³" },
      { label: "Tensile Strength", value: "28 MPa" },
      { label: "ESCR", value: ">1000 hrs" },
    ],
    applications: ["Bottles", "Containers", "Pipes", "Industrial tanks"],
    packaging: "25kg bags on pallets, 1000kg jumbo bags available",
    image: "/images/pe.jpg",
  },
  {
    id: "ldpe-2426h",
    name: "LDPE 2426H",
    category: "pe",
    description:
      "Low-density polyethylene with excellent flexibility and transparency. Widely used for film applications, agricultural films, and packaging.",
    specs: [
      { label: "MFR", value: "2.0 g/10min" },
      { label: "Density", value: "0.923 g/cm³" },
      { label: "Tensile Strength", value: "12 MPa" },
      { label: "Elongation", value: "400%" },
    ],
    applications: ["Packaging films", "Agricultural films", "Shrink wrap", "Bags"],
    packaging: "25kg bags on pallets",
    image: "/images/pe.jpg",
  },
  {
    id: "lldpe-7042",
    name: "LLDPE 7042",
    category: "pe",
    description:
      "Linear low-density polyethylene with excellent tear resistance and puncture strength. Ideal for stretch films and heavy-duty packaging.",
    specs: [
      { label: "MFR", value: "2.0 g/10min" },
      { label: "Density", value: "0.920 g/cm³" },
      { label: "Tensile Strength", value: "16 MPa" },
      { label: "Dart Impact", value: "120g" },
    ],
    applications: ["Stretch films", "Heavy-duty bags", "Lamination", "Agricultural films"],
    packaging: "25kg bags on pallets, 1000kg jumbo bags available",
    image: "/images/pe.jpg",
  },
  {
    id: "pvc-sg5",
    name: "PVC SG-5",
    category: "pvc",
    description:
      "Suspension grade PVC resin with versatile processing characteristics. Suitable for pipes, profiles, films, and cable insulation.",
    specs: [
      { label: "K Value", value: "66-68" },
      { label: "Density", value: "1.35-1.45 g/cm³" },
      { label: "Volatile Matter", value: "≤0.3%" },
      { label: "Plasticizer Absorption", value: "≥23%" },
    ],
    applications: ["Pipes & fittings", "Window profiles", "Cable insulation", "Films & sheets"],
    packaging: "25kg bags on pallets",
    image: "/images/pvc.jpg",
  },
  {
    id: "pvc-sg3",
    name: "PVC SG-3",
    category: "pvc",
    description:
      "High molecular weight PVC resin for soft products requiring excellent flexibility and durability. Ideal for artificial leather and flexible films.",
    specs: [
      { label: "K Value", value: "73-75" },
      { label: "Density", value: "1.35-1.45 g/cm³" },
      { label: "Volatile Matter", value: "≤0.3%" },
      { label: "Plasticizer Absorption", value: "≥30%" },
    ],
    applications: ["Artificial leather", "Flexible films", "Soft sheets", "Medical products"],
    packaging: "25kg bags on pallets",
    image: "/images/pvc.jpg",
  },
  {
    id: "abs-750a",
    name: "ABS 750A",
    category: "abs",
    description:
      "General-purpose ABS resin with balanced mechanical properties and excellent surface gloss. Widely used in electronics housings and automotive parts.",
    specs: [
      { label: "MFR", value: "22 g/10min" },
      { label: "Density", value: "1.05 g/cm³" },
      { label: "Tensile Strength", value: "43 MPa" },
      { label: "Impact Strength", value: "200 J/m" },
    ],
    applications: ["Electronics housings", "Automotive parts", "Home appliances", "Toys"],
    packaging: "25kg bags on pallets",
    image: "/images/abs.jpg",
  },
  {
    id: "pet-cz328",
    name: "PET CZ-328",
    category: "pet",
    description:
      "Bottle-grade PET resin with excellent clarity and barrier properties. Designed for beverage bottles, food containers, and packaging applications.",
    specs: [
      { label: "IV", value: "0.80 dL/g" },
      { label: "Density", value: "1.33 g/cm³" },
      { label: "Melting Point", value: "252°C" },
      { label: "Acetaldehyde", value: "≤1.0 ppm" },
    ],
    applications: ["Beverage bottles", "Food containers", "Packaging", "Thermoforming"],
    packaging: "1000kg jumbo bags, 25kg bags available",
    image: "/images/pet.jpg",
  },
  {
    id: "gpps-525",
    name: "GPPS 525",
    category: "ps",
    description:
      "General-purpose polystyrene with excellent transparency and rigidity. Suitable for disposable food packaging, display cases, and stationery.",
    specs: [
      { label: "MFR", value: "8.0 g/10min" },
      { label: "Density", value: "1.05 g/cm³" },
      { label: "Tensile Strength", value: "45 MPa" },
      { label: "Light Transmittance", value: "88%" },
    ],
    applications: ["Food packaging", "Display cases", "Stationery", "Light fixtures"],
    packaging: "25kg bags on pallets",
    image: "/images/ps.jpg",
  },
];
