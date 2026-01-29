export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[]; // Array de imagens para o carrossel
  description: string;
  category: string;
  condition: string;
  dimensions?: string;
  sold?: boolean; // Flag para produto vendido
}

export const products: Product[] = [
  {
    id: "1",
    name: "Sofá 3 Lugares",
    price: 1200,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop",
    ],
    description: "Sofá confortável de 3 lugares em excelente estado. Tecido cinza claro, estrutura firme e sem manchas. Muito confortável para sala de estar.",
    category: "Móveis",
    condition: "Excelente",
    dimensions: "2.20m x 0.90m x 0.85m"
  },
  {
    id: "2",
    name: "Geladeira Frost Free",
    price: 2500,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&h=800&fit=crop",
    ],
    description: "Geladeira duplex frost free, 400 litros. Inox, com dispenser de água. Economiza energia e funciona perfeitamente.",
    category: "Eletrodomésticos",
    condition: "Muito Bom",
    dimensions: "1.80m x 0.70m x 0.75m",
    sold: true, // Exemplo de produto vendido
  },
  {
    id: "3",
    name: "Mesa de Jantar 6 Lugares",
    price: 800,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop",
    ],
    description: "Mesa de jantar em madeira maciça com 6 cadeiras estofadas. Perfeita para refeições em família.",
    category: "Móveis",
    condition: "Bom",
    dimensions: "1.60m x 0.90m"
  },
  {
    id: "4",
    name: "Smart TV 55 Polegadas",
    price: 1800,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=800&fit=crop",
    ],
    description: "Smart TV LED 55' 4K UHD. Com suporte de parede incluso. Excelente qualidade de imagem.",
    category: "Eletrodomésticos",
    condition: "Excelente",
  },
  {
    id: "5",
    name: "Cama Box Casal",
    price: 900,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop",
    ],
    description: "Cama box casal completa com colchão ortopédico. Muito confortável e em ótimo estado.",
    category: "Móveis",
    condition: "Muito Bom",
    dimensions: "1.88m x 1.38m"
  },
  {
    id: "6",
    name: "Máquina de Lavar 12kg",
    price: 1400,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800&h=800&fit=crop",
    ],
    description: "Máquina de lavar roupas 12kg, com várias funções de lavagem. Economiza água e energia.",
    category: "Eletrodomésticos",
    condition: "Excelente",
  },
  {
    id: "7",
    name: "Estante para Livros",
    price: 450,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1577017040065-650ee4d43339?w=800&h=800&fit=crop",
    ],
    description: "Estante alta em madeira com 5 prateleiras. Ideal para livros, decoração e organização.",
    category: "Móveis",
    condition: "Bom",
    dimensions: "1.80m x 0.80m x 0.30m"
  },
  {
    id: "8",
    name: "Microondas 30L",
    price: 400,
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588854337221-4cf9fa96637b?w=800&h=800&fit=crop",
    ],
    description: "Micro-ondas 30 litros com grill. Várias funções pré-programadas. Funciona perfeitamente.",
    category: "Eletrodomésticos",
    condition: "Muito Bom",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}
