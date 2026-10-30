import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Categories ----
  const categories = [
    {
      name: "Silk",
      slug: "silk",
      description: "Luxurious silk sarees for every occasion — from pure Mulberry silk to raw silk blends.",
      sortOrder: 1,
    },
    {
      name: "Banarasi",
      slug: "banarasi",
      description: "Exquisite Banarasi sarees woven with gold and silver zari from the looms of Varanasi.",
      sortOrder: 2,
    },
    {
      name: "Cotton",
      slug: "cotton",
      description: "Comfortable and elegant cotton sarees — perfect for daily wear and summer occasions.",
      sortOrder: 3,
    },
    {
      name: "Kanjivaram",
      slug: "kanjivaram",
      description: "Traditional Kanjivaram silk sarees from Tamil Nadu — the pride of South Indian weaving.",
      sortOrder: 4,
    },
    {
      name: "Chanderi",
      slug: "chanderi",
      description: "Lightweight Chanderi sarees known for their sheer texture and golden borders.",
      sortOrder: 5,
    },
    {
      name: "Organza",
      slug: "organza",
      description: "Elegant organza sarees with a glass-like finish — ideal for parties and celebrations.",
      sortOrder: 6,
    },
    {
      name: "Linen",
      slug: "linen",
      description: "Premium linen sarees that combine comfort with sophistication.",
      sortOrder: 7,
    },
    {
      name: "Tussar",
      slug: "tussar",
      description: "Rich Tussar silk sarees with a natural gold sheen and earthy textures.",
      sortOrder: 8,
    },
    {
      name: "Chiffon",
      slug: "chiffon",
      description: "Flowy chiffon sarees for a graceful and effortless look.",
      sortOrder: 9,
    },
    {
      name: "Georgette",
      slug: "georgette",
      description: "Versatile georgette sarees — lightweight, easy to drape, and perfect for any occasion.",
      sortOrder: 10,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`  ✅ ${categories.length} categories seeded`);

  // ---- Fetch category IDs ----
  const categoryMap = new Map<string, string>();
  const allCategories = await prisma.category.findMany();
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, cat.id);
  }

  // ---- Products ----
  const products = [
    {
      name: "Royal Banarasi Silk Saree with Gold Zari",
      slug: "royal-banarasi-silk-saree-gold-zari",
      description:
        "This stunning Banarasi silk saree features intricate gold zari work with traditional motifs inspired by Mughal art. The rich fabric drapes beautifully and is perfect for weddings, festivities, and special occasions. Comes with an unstitched blouse piece.",
      shortDescription: "Handwoven Banarasi silk saree with gold zari motifs. Perfect for weddings.",
      categoryId: categoryMap.get("banarasi")!,
      basePrice: 8999,
      salePrice: 6999,
      sku: "VRH-BNR-001",
      fabric: "Silk",
      occasion: "Wedding",
      color: "Red",
      weight: 800,
      length: 6.3,
      blousePiece: true,
      washCare: "Dry clean only",
      isFeatured: true,
      isTrending: true,
      isBestSeller: true,
      metaTitle: "Royal Banarasi Silk Saree with Gold Zari | Varah Store",
      metaDescription: "Shop authentic handwoven Banarasi silk saree with intricate gold zari work. Perfect for weddings and festivities. Free shipping across India.",
    },
    {
      name: "Pure Kanjivaram Wedding Saree",
      slug: "pure-kanjivaram-wedding-saree",
      description:
        "A magnificent pure Kanjivaram silk saree with traditional temple border and rich pallu. Woven by master weavers of Kanchipuram using time-honored techniques passed down through generations. The contrasting blouse piece adds to its elegance.",
      shortDescription: "Authentic Kanjivaram silk with temple border. Bridal collection.",
      categoryId: categoryMap.get("kanjivaram")!,
      basePrice: 15999,
      salePrice: 12999,
      sku: "VRH-KNJ-001",
      fabric: "Silk",
      occasion: "Wedding",
      color: "Maroon",
      weight: 900,
      length: 6.3,
      blousePiece: true,
      washCare: "Dry clean only",
      isFeatured: true,
      isNewArrival: true,
      metaTitle: "Pure Kanjivaram Wedding Saree | Varah Store",
      metaDescription: "Buy pure Kanjivaram silk saree with temple border online. Authentic handwoven bridal saree from Kanchipuram.",
    },
    {
      name: "Handloom Cotton Tant Saree",
      slug: "handloom-cotton-tant-saree",
      description:
        "A beautiful handloom cotton Tant saree from Bengal. Known for its lightweight and airy feel, this saree is ideal for everyday wear and summer occasions. Features delicate jamdani patterns woven into the fabric.",
      shortDescription: "Lightweight Bengal Tant cotton saree with jamdani work.",
      categoryId: categoryMap.get("cotton")!,
      basePrice: 1799,
      salePrice: 1299,
      sku: "VRH-CTN-001",
      fabric: "Cotton",
      occasion: "Casual",
      color: "White",
      weight: 400,
      length: 5.5,
      blousePiece: true,
      washCare: "Hand wash in cold water",
      isTrending: true,
      isBestSeller: true,
      metaTitle: "Handloom Cotton Tant Saree | Varah Store",
      metaDescription: "Shop handloom cotton Tant saree online. Lightweight Bengal saree perfect for daily wear.",
    },
    {
      name: "Designer Organza Party Saree",
      slug: "designer-organza-party-saree",
      description:
        "A gorgeous designer organza saree with floral embroidery and sequin work. The glass-like sheen of organza fabric creates a stunning visual effect. Perfect for cocktail parties, receptions, and evening events.",
      shortDescription: "Embroidered organza saree with sequin work for parties.",
      categoryId: categoryMap.get("organza")!,
      basePrice: 5999,
      salePrice: 4599,
      sku: "VRH-ORG-001",
      fabric: "Organza",
      occasion: "Party Wear",
      color: "Peach",
      weight: 500,
      length: 5.5,
      blousePiece: true,
      washCare: "Dry clean only",
      isFeatured: true,
      isNewArrival: true,
      metaTitle: "Designer Organza Party Saree | Varah Store",
      metaDescription: "Buy designer organza saree with floral embroidery online. Perfect for parties and events.",
    },
    {
      name: "Chanderi Silk Festive Saree",
      slug: "chanderi-silk-festive-saree",
      description:
        "An elegant Chanderi silk saree featuring traditional butis and a luxurious golden border. The fabric is lightweight yet rich, making it perfect for festive celebrations and puja occasions.",
      shortDescription: "Lightweight Chanderi silk with golden border for festivals.",
      categoryId: categoryMap.get("chanderi")!,
      basePrice: 3999,
      salePrice: 3299,
      sku: "VRH-CHN-001",
      fabric: "Chanderi",
      occasion: "Festive",
      color: "Green",
      weight: 450,
      length: 5.5,
      blousePiece: true,
      washCare: "Dry clean recommended",
      isNewArrival: true,
      metaTitle: "Chanderi Silk Festive Saree | Varah Store",
      metaDescription: "Shop Chanderi silk saree online. Elegant festive saree with golden border.",
    },
    {
      name: "Pure Linen Handwoven Saree",
      slug: "pure-linen-handwoven-saree",
      description:
        "A premium pure linen saree handwoven with natural fibers. The fabric breathes beautifully and gets softer with each wash. Minimalistic design with a contrast border makes it versatile for office and casual wear.",
      shortDescription: "Premium handwoven linen saree. Perfect for office and casual wear.",
      categoryId: categoryMap.get("linen")!,
      basePrice: 2799,
      sku: "VRH-LNN-001",
      fabric: "Linen",
      occasion: "Office Wear",
      color: "Beige",
      weight: 350,
      length: 5.5,
      blousePiece: false,
      washCare: "Hand wash in cold water",
      isNewArrival: true,
      metaTitle: "Pure Linen Handwoven Saree | Varah Store",
      metaDescription: "Buy pure linen handwoven saree online. Minimalistic design perfect for office wear.",
    },
    {
      name: "Tussar Silk Embroidered Saree",
      slug: "tussar-silk-embroidered-saree",
      description:
        "A rich Tussar silk saree with beautiful kantha embroidery. The natural golden sheen of Tussar silk combined with hand-embroidered motifs creates a piece of wearable art. Ideal for receptions and cultural events.",
      shortDescription: "Tussar silk with kantha embroidery. Wearable art piece.",
      categoryId: categoryMap.get("tussar")!,
      basePrice: 6499,
      salePrice: 5499,
      sku: "VRH-TSR-001",
      fabric: "Tussar",
      occasion: "Reception",
      color: "Gold",
      weight: 600,
      length: 5.5,
      blousePiece: true,
      washCare: "Dry clean only",
      isFeatured: true,
      metaTitle: "Tussar Silk Embroidered Saree | Varah Store",
      metaDescription: "Shop Tussar silk saree with kantha embroidery online. Premium saree for receptions.",
    },
    {
      name: "Georgette Printed Daily Wear Saree",
      slug: "georgette-printed-daily-wear-saree",
      description:
        "A versatile georgette saree with vibrant digital prints. The lightweight fabric drapes effortlessly and is easy to maintain. Perfect for daily wear and casual outings. Available with matching blouse piece.",
      shortDescription: "Vibrant printed georgette saree for daily wear.",
      categoryId: categoryMap.get("georgette")!,
      basePrice: 999,
      salePrice: 749,
      sku: "VRH-GRG-001",
      fabric: "Georgette",
      occasion: "Daily Wear",
      color: "Blue",
      weight: 300,
      length: 5.5,
      blousePiece: true,
      washCare: "Machine wash gentle cycle",
      isBestSeller: true,
      metaTitle: "Georgette Printed Daily Wear Saree | Varah Store",
      metaDescription: "Buy affordable georgette printed saree online. Perfect for daily wear.",
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existing) {
      const created = await prisma.product.create({
        data: product,
      });

      // Create a default variant with inventory
      await prisma.productVariant.create({
        data: {
          productId: created.id,
          name: `${product.color} - Free Size`,
          sku: `${product.sku}-FS`,
          color: product.color,
          size: "Free Size",
          inventory: {
            create: {
              quantity: Math.floor(Math.random() * 50) + 10,
              lowStockThreshold: 5,
            },
          },
        },
      });
    }
  }
  console.log(`  ✅ ${products.length} products seeded`);

  // ---- Coupons ----
  const coupons = [
    {
      code: "VARAH10",
      description: "10% off on your first order",
      discountType: "PERCENTAGE" as const,
      discountValue: 10,
      maxDiscount: 500,
      minOrderAmount: 999,
      usageLimit: 1000,
      usageLimitPerUser: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      code: "WEDDING25",
      description: "25% off on wedding sarees",
      discountType: "PERCENTAGE" as const,
      discountValue: 25,
      maxDiscount: 2000,
      minOrderAmount: 2999,
      usageLimit: 500,
      usageLimitPerUser: 2,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    },
    {
      code: "FLAT500",
      description: "Flat ₹500 off on orders above ₹3,000",
      discountType: "FIXED" as const,
      discountValue: 500,
      minOrderAmount: 3000,
      usageLimit: 200,
      usageLimitPerUser: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }
  console.log(`  ✅ ${coupons.length} coupons seeded`);

  console.log("\n✨ Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
