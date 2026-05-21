const prisma = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Seeding VARAH database...\n');

  // ---- 1. Create Admin User ----
  const adminHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@varah.com' },
    update: {},
    create: {
      name: 'VARAH Admin',
      email: 'admin@varah.com',
      phone: '9999999999',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // ---- 2. Create Test Customer ----
  const customerHash = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'customer@test.com',
      phone: '9876543210',
      passwordHash: customerHash,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // ---- 3. Create Sellers ----
  const sellerData = [
    {
      name: 'Raj Mehta', email: 'raj@varanasisilk.com', phone: '9111111111',
      shop: {
        shopName: 'Varanasi Silk House', pan: 'ABCDE1234F', gstin: '09ABCDE1234F1Z5',
        description: 'Three generations of master weavers crafting the finest Banarasi silk sarees since 1968.',
        city: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001',
        category: 'sarees', status: 'VERIFIED',
      },
    },
    {
      name: 'Lakshmi Iyer', email: 'lakshmi@kanchicreations.com', phone: '9222222222',
      shop: {
        shopName: 'Kanchipuram Creations', pan: 'FGHIJ5678K', gstin: '33FGHIJ5678K1Z5',
        description: 'Authentic Kanjeevaram sarees woven with real gold and silver zari by skilled artisans.',
        city: 'Kanchipuram', state: 'Tamil Nadu', pincode: '631501',
        category: 'sarees', status: 'VERIFIED',
      },
    },
    {
      name: 'Ananya Roy', email: 'ananya@mumbaifashion.com', phone: '9333333333',
      shop: {
        shopName: 'Mumbai Fashion Studio', pan: 'KLMNO9012L', gstin: '27KLMNO9012L1Z5',
        description: 'Contemporary designer wear blending modern aesthetics with traditional craftsmanship.',
        city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
        category: 'lehengas', status: 'VERIFIED',
      },
    },
    {
      name: 'Vikram Singh', email: 'vikram@jaipurcouture.com', phone: '9444444444',
      shop: {
        shopName: 'Jaipur Couture', pan: 'PQRST3456M',
        description: 'Luxury bridal lehengas with exquisite mirror and gota patti work.',
        city: 'Jaipur', state: 'Rajasthan', pincode: '302001',
        category: 'lehengas', status: 'VERIFIED',
      },
    },
    {
      name: 'Meena Devi', email: 'meena@chanderi.com', phone: '9555555555',
      shop: {
        shopName: 'Chanderi Weavers Co-op', pan: 'UVWXY7890N',
        description: 'A cooperative of 50+ handloom weavers preserving the 700-year-old Chanderi weaving tradition.',
        city: 'Chanderi', state: 'Madhya Pradesh', pincode: '473446',
        category: 'sarees', status: 'VERIFIED',
      },
    },
  ];

  const sellers = [];
  for (const s of sellerData) {
    const hash = await bcrypt.hash('seller123', 12);
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { name: s.name, email: s.email, phone: s.phone, passwordHash: hash, role: 'SELLER' },
    });

    const seller = await prisma.seller.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, ...s.shop },
    });
    sellers.push(seller);
    console.log(`✅ Seller created: ${seller.shopName}`);
  }

  // ---- 4. Create Products ----
  const productData = [
    {
      sellerId: sellers[0].id, name: 'Royal Banarasi Silk Saree', slug: 'royal-banarasi-silk-saree',
      description: 'Exquisite handwoven Banarasi silk saree with intricate zari work, perfect for weddings and festive occasions.',
      price: 4999, originalPrice: 8999, discount: 44, stockCount: 12,
      category: 'sarees', subcategory: 'Banarasi', fabric: 'Pure Silk', work: 'Zari Weaving',
      occasion: 'Wedding', color: 'Red & Gold', weight: '800g', length: '6.3 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Only',
      images: ['/images/products/saree-1.png'], tags: ['bestseller', 'handwoven'],
      status: 'ACTIVE', rating: 4.8, reviewCount: 234,
    },

    {
      sellerId: sellers[1].id, name: 'Emerald Kanjeevaram Temple Saree', slug: 'emerald-kanjeevaram-temple-saree',
      description: 'Authentic Kanjeevaram silk saree featuring traditional temple border with real gold zari.',
      price: 7499, originalPrice: 12999, discount: 42, stockCount: 5,
      category: 'sarees', subcategory: 'Kanjeevaram', fabric: 'Pure Mulberry Silk', work: 'Gold Zari',
      occasion: 'Wedding', color: 'Emerald Green & Gold', weight: '950g', length: '6.3 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Only',
      images: ['/images/products/saree-2.png'], tags: ['premium', 'handwoven', 'gold-zari'],
      status: 'ACTIVE', rating: 4.9, reviewCount: 189,
    },
    {
      sellerId: sellers[2].id, name: 'Blush Pink Sequin Saree', slug: 'blush-pink-sequin-saree',
      description: 'Elegant pastel pink chiffon saree adorned with delicate sequin and thread embroidery.',
      price: 2999, originalPrice: 5499, discount: 45, stockCount: 28,
      category: 'sarees', subcategory: 'Designer', fabric: 'Georgette', work: 'Sequin Embroidery',
      occasion: 'Party', color: 'Blush Pink', weight: '500g', length: '5.5 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Only',
      images: ['/images/products/saree-3.png'], tags: ['trending', 'lightweight'],
      status: 'ACTIVE', rating: 4.6, reviewCount: 312,
    },
    {
      sellerId: sellers[3].id, name: 'Royal Blue Bridal Lehenga', slug: 'royal-blue-bridal-lehenga',
      description: 'Stunning royal blue bridal lehenga set with heavy embroidery and mirror work.',
      price: 15999, originalPrice: 28999, discount: 45, stockCount: 3,
      category: 'lehengas', subcategory: 'Bridal', fabric: 'Raw Silk & Net', work: 'Embroidery & Mirror Work',
      occasion: 'Wedding', color: 'Royal Blue & Gold', weight: '3.5kg',
      components: 'Lehenga + Choli + Dupatta', size: 'Semi-stitched (Customizable)',
      washCare: 'Dry Clean Only',
      images: ['/images/products/lehenga-1.png'], tags: ['bridal', 'premium', 'handcrafted'],
      status: 'ACTIVE', rating: 4.9, reviewCount: 87,
    },
    {
      sellerId: sellers[4].id, name: 'Maroon Chanderi Silk Saree', slug: 'maroon-chanderi-silk-saree',
      description: 'Classic Chanderi silk saree in deep maroon with gold butis and border.',
      price: 4299, originalPrice: 6599, discount: 35, stockCount: 18,
      category: 'sarees', subcategory: 'Chanderi', fabric: 'Chanderi Silk', work: 'Handloom',
      occasion: 'Festival', color: 'Maroon & Gold', weight: '400g', length: '6.3 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Recommended',
      images: ['/images/products/maroon_saree.png'], tags: ['handloom', 'artisan'],
      status: 'ACTIVE', rating: 4.7, reviewCount: 156,
    },
    {
      sellerId: sellers[0].id, name: 'Pastel Sage Embroidered Lehenga', slug: 'pastel-sage-embroidered-lehenga',
      description: 'Beautiful sage green lehenga with delicate thread embroidery and sequin highlights.',
      price: 12999, originalPrice: 19999, discount: 35, stockCount: 7,
      category: 'lehengas', subcategory: 'Festive', fabric: 'Georgette & Net',
      work: 'Thread Embroidery & Sequins', occasion: 'Engagement', color: 'Sage Green', weight: '2.5kg',
      components: 'Lehenga + Crop Top + Dupatta', size: 'Semi-stitched (Customizable)',
      washCare: 'Dry Clean Only',
      images: ['/images/products/sage_lehenga.png'], tags: ['trending', 'elegant'],
      status: 'ACTIVE', rating: 4.7, reviewCount: 134,
    },
    {
      sellerId: sellers[1].id, name: 'Golden Tissue Saree', slug: 'golden-tissue-saree',
      description: 'Luxurious golden tissue saree with a shimmering finish and delicate border.',
      price: 6499, originalPrice: 10499, discount: 38, stockCount: 9,
      category: 'sarees', subcategory: 'Designer', fabric: 'Tissue', work: 'Zari Border',
      occasion: 'Party', color: 'Gold', weight: '600g', length: '5.5 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Only',
      images: ['/images/products/golden_saree.png'], tags: ['luxe', 'shimmer'],
      status: 'ACTIVE', rating: 4.5, reviewCount: 98,
    },
    {
      sellerId: sellers[2].id, name: 'Ivory Pearl Bridal Lehenga', slug: 'ivory-pearl-bridal-lehenga',
      description: 'Ethereal ivory bridal lehenga with pearl and crystal embellishments.',
      price: 25999, originalPrice: 42999, discount: 39, stockCount: 2,
      category: 'lehengas', subcategory: 'Bridal', fabric: 'Velvet & Organza',
      work: 'Pearl & Crystal Work', occasion: 'Wedding', color: 'Ivory & Gold', weight: '4kg',
      components: 'Lehenga + Choli + Dupatta', size: 'Semi-stitched (Customizable)',
      washCare: 'Dry Clean Only',
      images: ['/images/products/ivory_lehenga.png'], tags: ['bridal', 'premium', 'exclusive'],
      status: 'ACTIVE', rating: 5.0, reviewCount: 42,
    },
    {
      sellerId: sellers[3].id, name: 'morawal saree', slug: 'morawal-saree',
      description: 'Exquisite handwoven Banarasi silk saree with intricate zari work, perfect for weddings and festive occasions.',
      price: 2999, originalPrice: 3999, discount: 25, stockCount: 12,
      category: 'sarees', subcategory: 'Banarasi', fabric: 'Pure Silk', work: 'Zari Weaving',
      occasion: 'Wedding', color: 'Red & Gold', weight: '800g', length: '6.3 meters',
      blousePiece: 'Included (0.8m unstitched)', washCare: 'Dry Clean Only',
      images: ['/images/products/saree-1.png'], tags: ['bestseller', 'handwoven'],
      status: 'ACTIVE', rating: 4.8, reviewCount: 234,
    }
  ];

  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`\n✅ ${productData.length} products seeded`);

  // ---- 5. Create Customer Address ----
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      phone: '9876543210',
      addressLine: '42, MG Road, Connaught Place',
      locality: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      type: 'HOME',
      isDefault: true,
    },
  });
  console.log('✅ Customer address seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('   Admin:    admin@varah.com / admin123');
  console.log('   Customer: customer@test.com / customer123');
  console.log('   Sellers:  raj@varanasisilk.com / seller123');
  console.log('             lakshmi@kanchicreations.com / seller123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
