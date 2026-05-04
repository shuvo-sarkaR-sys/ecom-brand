const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI ;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
// Inline schemas for seeding
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'user' },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, description: String, image: String, isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, description: String, shortDescription: String,
  price: Number, comparePrice: Number, images: [String], category: mongoose.Types.ObjectId,
  brand: String, sku: { type: String, unique: true }, stock: Number, tags: [String],
  averageRating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  isFeatured: Boolean, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and tech', sortOrder: 1 },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, and accessories', sortOrder: 2 },
  { name: 'Home & Living', slug: 'home', description: 'Furniture and home decor', sortOrder: 3 },
  { name: 'Beauty', slug: 'beauty', description: 'Skincare, makeup, and wellness', sortOrder: 4 },
  { name: 'Sports', slug: 'sports', description: 'Fitness and outdoor gear', sortOrder: 5 },
  { name: 'Books', slug: 'books', description: 'Books, courses, and media', sortOrder: 6 },
];

const getProducts = (categoryMap) => [
  {
    name: 'Premium Wireless Headphones Pro',
    slug: 'premium-wireless-headphones-pro',
    description: 'Experience audio like never before with our flagship wireless headphones. Featuring 40mm dynamic drivers, active noise cancellation, and 30-hour battery life. The premium leather ear cushions provide all-day comfort while the foldable design makes them perfect for travel.',
    shortDescription: 'Professional-grade wireless headphones with ANC and 30hr battery.',
    price: 199.99, comparePrice: 279.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'],
    category: categoryMap.electronics, brand: 'SoundLabs', sku: 'ELE-HP001', stock: 45,
    tags: ['wireless', 'headphones', 'audio', 'noise-canceling'], isFeatured: true, averageRating: 4.8, numReviews: 124,
  },
  {
    name: 'Minimalist Leather Watch',
    slug: 'minimalist-leather-watch',
    description: 'A timeless timepiece that blends classic design with modern precision. Features a genuine leather strap, sapphire crystal glass, and Swiss movement mechanism. Water resistant to 50 meters. Available in silver and gold finishes.',
    shortDescription: 'Swiss movement watch with genuine leather strap.',
    price: 299.00, comparePrice: 399.00,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'],
    category: categoryMap.fashion, brand: 'Horologie', sku: 'FSH-WC001', stock: 12,
    tags: ['watch', 'leather', 'minimalist', 'luxury'], isFeatured: true, averageRating: 4.9, numReviews: 67,
  },
  {
    name: 'Smart Home Hub Pro',
    slug: 'smart-home-hub-pro',
    description: 'Control your entire smart home from one central device. Compatible with 10,000+ smart devices, featuring built-in voice assistant, 7-inch touchscreen, and local processing for privacy. Setup takes just 5 minutes.',
    shortDescription: 'Central smart home controller compatible with 10,000+ devices.',
    price: 199.00, comparePrice: 249.00,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'],
    category: categoryMap.electronics, brand: 'NestCore', sku: 'ELE-SH001', stock: 28,
    tags: ['smart-home', 'iot', 'automation'], isFeatured: true, averageRating: 4.5, numReviews: 89,
  },
  {
    name: 'Organic Skincare Luxury Bundle',
    slug: 'organic-skincare-luxury-bundle',
    description: 'Our best-selling skincare collection featuring vitamin C serum, hyaluronic acid moisturizer, and retinol night cream. All products are cruelty-free, dermatologist tested, and packed with organic ingredients sourced sustainably.',
    shortDescription: 'Complete organic skincare routine — serum, moisturizer, and night cream.',
    price: 89.99, comparePrice: 129.99,
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'],
    category: categoryMap.beauty, brand: 'PureGlow', sku: 'BTY-SK001', stock: 83,
    tags: ['skincare', 'organic', 'beauty', 'bundle'], isFeatured: true, averageRating: 4.7, numReviews: 215,
  },
  {
    name: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Handcrafted from full-grain Italian leather, this crossbody bag is designed to last a lifetime. Features multiple internal pockets, a secure zip closure, and an adjustable strap. Develops a beautiful patina over time.',
    shortDescription: 'Full-grain Italian leather crossbody with multiple compartments.',
    price: 149.50,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop'],
    category: categoryMap.fashion, brand: 'Artesano', sku: 'FSH-BG001', stock: 0,
    tags: ['bag', 'leather', 'handbag', 'italian'], isFeatured: false, averageRating: 4.6, numReviews: 43,
  },
  {
    name: 'Ergonomic Home Office Chair',
    slug: 'ergonomic-home-office-chair',
    description: 'Work in comfort with our award-winning ergonomic chair. Features lumbar support, adjustable armrests, breathable mesh back, and seat height adjustment. Certified by ergonomics experts for all-day comfort.',
    shortDescription: 'Award-winning ergonomic chair with full lumbar support.',
    price: 399.00, comparePrice: 549.00,
    images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=600&h=600&fit=crop'],
    category: categoryMap.home, brand: 'ErgoMax', sku: 'HME-CH001', stock: 15,
    tags: ['chair', 'office', 'ergonomic', 'furniture'], isFeatured: true, averageRating: 4.8, numReviews: 312,
  },
  {
    name: 'Pro Running Shoes',
    slug: 'pro-running-shoes',
    description: 'Engineered for performance with our carbon fiber plate technology and responsive foam cushioning. Lightweight at just 225g, these shoes provide the energy return you need to hit new PRs.',
    shortDescription: 'Carbon plate running shoes for peak performance.',
    price: 179.00, comparePrice: 220.00,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'],
    category: categoryMap.sports, brand: 'PaceRunner', sku: 'SPT-SH001', stock: 64,
    tags: ['running', 'shoes', 'sports', 'marathon'], isFeatured: false, averageRating: 4.6, numReviews: 178,
  },
  {
    name: '4K Ultra-Wide Monitor',
    slug: '4k-ultra-wide-monitor',
    description: '34-inch ultra-wide curved display with 4K resolution, 144Hz refresh rate, and 1ms response time. Perfect for creative professionals and gamers. Includes USB-C hub with 90W power delivery.',
    shortDescription: '34" curved 4K display, 144Hz, with built-in USB-C hub.',
    price: 649.00, comparePrice: 849.00,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop'],
    category: categoryMap.electronics, brand: 'ViewTech', sku: 'ELE-MN001', stock: 9,
    tags: ['monitor', '4k', 'ultrawide', 'gaming'], isFeatured: true, averageRating: 4.9, numReviews: 87,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
    console.log('🗑️  Cleared existing data');

    // Seed users
    const hashedAdmin = await bcrypt.hash('admin123', 12);
    const hashedUser = await bcrypt.hash('user123', 12);

    await User.insertMany([
      { name: 'Admin User', email: 'admin@luxe.com', password: hashedAdmin, role: 'admin' },
      { name: 'Sarah Johnson', email: 'user@luxe.com', password: hashedUser, role: 'user' },
      { name: 'Mike Chen', email: 'mike@example.com', password: hashedUser, role: 'user' },
    ]);
    console.log('👤 Users seeded');

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {});
    console.log('📁 Categories seeded');

    // Seed products
    const products = getProducts(categoryMap);
    await Product.insertMany(products);
    console.log('📦 Products seeded');

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin:  admin@luxe.com / admin123');
    console.log('👤 User:   user@luxe.com  / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
