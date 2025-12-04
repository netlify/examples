export interface Bird {
  name: string;
  scientificName: string;
  slug: string;
  family: string;
  habitat: string[];
  diet: string;
  size: string;
  conservation: string;
  region: string[];
  excerpt: string;
  imageUrl: string;
}

export const birds: Bird[] = [
  {
    name: "Resplendent Quetzal",
    scientificName: "Pharomachrus mocinno",
    slug: "resplendent-quetzal",
    family: "Trogonidae",
    habitat: ["Cloud forests", "Montane forests"],
    diet: "Fruits, insects, small vertebrates",
    size: "36-40 cm",
    conservation: "Near Threatened",
    region: ["Monteverde", "San Gerardo de Dota"],
    excerpt: "One of the most spectacular birds in Central America, revered by ancient Mayan and Aztec civilizations.",
    imageUrl: "/resplendent-quetzal.jpg"
  },
  {
    name: "Scarlet Macaw",
    scientificName: "Ara macao",
    slug: "scarlet-macaw",
    family: "Psittacidae",
    habitat: ["Tropical rainforests", "Dry forests"],
    diet: "Seeds, nuts, fruits",
    size: "81-96 cm",
    conservation: "Least Concern",
    region: ["Osa Peninsula", "Carara National Park"],
    excerpt: "A large, vibrant parrot known for its brilliant red, yellow, and blue plumage.",
    imageUrl: "/scarlet-macaw.jpg"
  },
  {
    name: "Three-wattled Bellbird",
    scientificName: "Procnias tricarunculatus",
    slug: "three-wattled-bellbird",
    family: "Cotingidae",
    habitat: ["Montane forests", "Cloud forests"],
    diet: "Fruits, particularly laurels",
    size: "25-30 cm",
    conservation: "Vulnerable",
    region: ["Monteverde", "Los Angeles Cloud Forest"],
    excerpt: "Named for its distinctive metallic bell-like call and three worm-like wattles.",
    imageUrl: "/three-wattled-bellbird.jpg"
  },
  {
    name: "Keel-billed Toucan",
    scientificName: "Ramphastos sulfuratus",
    slug: "keel-billed-toucan",
    family: "Ramphastidae",
    habitat: ["Lowland forests", "Forest edges"],
    diet: "Fruits, insects, eggs",
    size: "42-55 cm",
    conservation: "Least Concern",
    region: ["Caribbean lowlands", "Tortuguero"],
    excerpt: "Costa Rica's most iconic toucan, featuring a rainbow-colored bill.",
    imageUrl: "/keel-billed-toucan.jpg"
  },
  {
    name: "Clay-colored Thrush",
    scientificName: "Turdus grayi",
    slug: "clay-colored-thrush",
    family: "Turdidae",
    habitat: ["Gardens", "Urban areas", "Forest edges"],
    diet: "Insects, fruits, seeds",
    size: "23-27 cm",
    conservation: "Least Concern",
    region: ["Throughout Costa Rica"],
    excerpt: "Costa Rica's national bird, known for its melodious song during the rainy season.",
    imageUrl: "/clay-colored-thrush.jpg"
  },
  {
    name: "Violet Sabrewing",
    scientificName: "Campylopterus hemileucurus",
    slug: "violet-sabrewing",
    family: "Trochilidae",
    habitat: ["Cloud forests", "Montane forests"],
    diet: "Nectar, small insects",
    size: "13-15 cm",
    conservation: "Least Concern",
    region: ["Monteverde", "Central highlands"],
    excerpt: "One of the largest hummingbirds in Costa Rica, with brilliant violet plumage.",
    imageUrl: "/violet-sabrewing.jpg"
  },
  {
    name: "Fiery-billed Aracari",
    scientificName: "Pteroglossus frantzii",
    slug: "fiery-billed-aracari",
    family: "Ramphastidae",
    habitat: ["Humid lowland forests", "Forest edges"],
    diet: "Fruits, insects, small reptiles",
    size: "43 cm",
    conservation: "Least Concern",
    region: ["Pacific slope", "Carara"],
    excerpt: "A smaller toucan species endemic to southern Costa Rica and western Panama.",
    imageUrl: "/fiery-billed-aracari.jpg"
  },
  {
    name: "Bare-necked Umbrellabird",
    scientificName: "Cephalopterus glabricollis",
    slug: "bare-necked-umbrellabird",
    family: "Cotingidae",
    habitat: ["Humid lowland forests", "Foothill forests"],
    diet: "Fruits, large insects",
    size: "41 cm",
    conservation: "Vulnerable",
    region: ["Caribbean lowlands", "Braulio Carrillo"],
    excerpt: "A rare species known for its distinctive umbrella-like crest and bare red throat.",
    imageUrl: "/bare-necked-umbrellabird.jpg"
  },
  {
    name: "Montezuma Oropendola",
    scientificName: "Psarocolius montezuma",
    slug: "montezuma-oropendola",
    family: "Icteridae",
    habitat: ["Lowland forests", "Forest edges", "Plantations"],
    diet: "Fruits, nectar, insects",
    size: "46-48 cm",
    conservation: "Least Concern",
    region: ["Caribbean and Pacific lowlands"],
    excerpt: "Large colonial nesting bird known for elaborate hanging nests and liquid vocalizations.",
    imageUrl: "/montezuma-oropendola.jpg"
  },
  {
    name: "Great Green Macaw",
    scientificName: "Ara ambiguus",
    slug: "great-green-macaw",
    family: "Psittacidae",
    habitat: ["Lowland rainforests"],
    diet: "Seeds, nuts, fruits",
    size: "77-85 cm",
    conservation: "Critically Endangered",
    region: ["Caribbean lowlands", "Sarapiqui"],
    excerpt: "The largest parrot in Central America, critically endangered due to habitat loss.",
    imageUrl: "/great-green-macaw.jpg"
  },
  {
    name: "Snowcap",
    scientificName: "Microchera albocoronata",
    slug: "snowcap",
    family: "Trochilidae",
    habitat: ["Lowland forests", "Forest edges"],
    diet: "Nectar, small insects",
    size: "6.5 cm",
    conservation: "Least Concern",
    region: ["Caribbean lowlands"],
    excerpt: "A tiny hummingbird with a distinctive white cap, endemic to Central America.",
    imageUrl: "/snowcap.jpg"
  },
  {
    name: "Lesson's Motmot",
    scientificName: "Momotus lessonii",
    slug: "lessons-motmot",
    family: "Momotidae",
    habitat: ["Humid forests", "Forest edges"],
    diet: "Insects, small reptiles, fruits",
    size: "41-48 cm",
    conservation: "Least Concern",
    region: ["Caribbean slope"],
    excerpt: "Recognized by its racquet-tipped tail and turquoise crown.",
    imageUrl: "/lessons-motmot.jpg"
  },
  {
    name: "Long-tailed Manakin",
    scientificName: "Chiroxiphia linearis",
    slug: "long-tailed-manakin",
    family: "Pipridae",
    habitat: ["Dry forests", "Secondary forests"],
    diet: "Fruits, insects",
    size: "10 cm (plus long tail)",
    conservation: "Least Concern",
    region: ["Pacific slope", "Guanacaste"],
    excerpt: "Males perform elaborate cooperative courtship dances with distinctive vocalizations.",
    imageUrl: "/long-tailed-manakin.jpg"
  },
  {
    name: "Sunbittern",
    scientificName: "Eurypyga helias",
    slug: "sunbittern",
    family: "Eurypygidae",
    habitat: ["Forested streams", "Wetlands"],
    diet: "Fish, insects, crustaceans",
    size: "43-48 cm",
    conservation: "Least Concern",
    region: ["Throughout forested areas"],
    excerpt: "Displays spectacular orange, yellow, and black wing patterns when threatened.",
    imageUrl: "/sunbittern.jpg"
  },
  {
    name: "Blue-crowned Motmot",
    scientificName: "Momotus coeruliceps",
    slug: "blue-crowned-motmot",
    family: "Momotidae",
    habitat: ["Forests", "Forest edges", "Gardens"],
    diet: "Insects, small vertebrates, fruits",
    size: "38-43 cm",
    conservation: "Least Concern",
    region: ["Central and Pacific regions"],
    excerpt: "Often seen swinging its distinctive racquet tail while perched.",
    imageUrl: "/blue-crowned-motmot.jpg"
  },
  {
    name: "White-throated Magpie-Jay",
    scientificName: "Calocitta formosa",
    slug: "white-throated-magpie-jay",
    family: "Corvidae",
    habitat: ["Dry forests", "Woodland edges"],
    diet: "Insects, fruits, seeds, small animals",
    size: "46-56 cm",
    conservation: "Least Concern",
    region: ["Pacific slope", "Guanacaste"],
    excerpt: "Intelligent and social bird with striking blue and white plumage and long curved crest.",
    imageUrl: "/white-throated-magpie-jay.jpg"
  },
  {
    name: "Rufous-tailed Hummingbird",
    scientificName: "Amazilia tzacatl",
    slug: "rufous-tailed-hummingbird",
    family: "Trochilidae",
    habitat: ["Gardens", "Forest edges", "Clearings"],
    diet: "Nectar, small insects",
    size: "10 cm",
    conservation: "Least Concern",
    region: ["Throughout Costa Rica"],
    excerpt: "One of the most common and adaptable hummingbirds in Costa Rica.",
    imageUrl: "/rufous-tailed-hummingbird.jpg"
  },
  {
    name: "Black Guan",
    scientificName: "Chamaepetes unicolor",
    slug: "black-guan",
    family: "Cracidae",
    habitat: ["Montane forests", "Cloud forests"],
    diet: "Fruits, leaves, flowers",
    size: "63-69 cm",
    conservation: "Near Threatened",
    region: ["Central highlands", "Monteverde"],
    excerpt: "A large, turkey-like bird endemic to the mountains of Costa Rica and western Panama.",
    imageUrl: "/black-guan.jpg"
  },
  {
    name: "Turquoise-browed Motmot",
    scientificName: "Eumomota superciliosa",
    slug: "turquoise-browed-motmot",
    family: "Momotidae",
    habitat: ["Dry forests", "Open woodlands"],
    diet: "Insects, small reptiles, fruits",
    size: "30-34 cm",
    conservation: "Least Concern",
    region: ["Guanacaste", "Northern Pacific"],
    excerpt: "Nicaragua's national bird, also found in northwestern Costa Rica's dry forests.",
    imageUrl: "/turquoise-browed-motmot.jpg"
  },
  {
    name: "Scarlet-thighed Dacnis",
    scientificName: "Dacnis venusta",
    slug: "scarlet-thighed-dacnis",
    family: "Thraupidae",
    habitat: ["Humid forests", "Forest edges"],
    diet: "Insects, fruits, nectar",
    size: "12 cm",
    conservation: "Least Concern",
    region: ["Caribbean and southern Pacific slopes"],
    excerpt: "A small, brilliantly colored tanager endemic to Costa Rica and western Panama.",
    imageUrl: "/scarlet-thighed-dacnis.jpg"
  }
];
