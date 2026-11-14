import bcrypt from 'bcryptjs';
import {db} from './connection';

/**
 * Seeds the Aura perfumes boutique: 8 signature fragrances (images were
 * generated with Recraft), fragrance families, demo users, coupons, reviews.
 */

const FAMILIES = [
  {slug: 'oud', name_ar: 'العود', name_en: 'Oud'},
  {slug: 'floral', name_ar: 'زهري', name_en: 'Floral'},
  {slug: 'amber', name_ar: 'عنبر', name_en: 'Amber'},
  {slug: 'musk', name_ar: 'مسك', name_en: 'Musk'},
  {slug: 'fresh', name_ar: 'منعش', name_en: 'Fresh'},
  {slug: 'woody', name_ar: 'خشبي', name_en: 'Woody'},
  {slug: 'oriental', name_ar: 'شرقي', name_en: 'Oriental'},
  {slug: 'spicy', name_ar: 'حار', name_en: 'Spicy'},
  {slug: 'leather', name_ar: 'جلدي', name_en: 'Leather'},
  {slug: 'gourmand', name_ar: 'غورماند', name_en: 'Gourmand'},
  {slug: 'aquatic', name_ar: 'مائي', name_en: 'Aquatic'},
  {slug: 'chypre', name_ar: 'شيبر', name_en: 'Chypre'},
];

interface SeedPerfume {
  slug: string;
  name_ar: string;
  name_en: string;
  family: string;
  price: number;
  compareAt: number | null;
  stock: number;
  size: number;
  concentration: string;
  notes_ar: string[];
  notes_en: string[];
  desc_ar: string;
  desc_en: string;
  featured?: boolean;
}

const PERFUMES: SeedPerfume[] = [
  {
    slug: 'oud-royal', name_ar: 'العود الملكي', name_en: 'Oud Royal', family: 'oud',
    price: 69000, compareAt: 85000, stock: 24, size: 100, concentration: 'Extrait de Parfum',
    notes_ar: ['عود كمبودي', 'ورد طائفي', 'عنبر'], notes_en: ['Cambodian oud', 'Taif rose', 'Amber'],
    desc_ar: 'عطر ملكي يفتتح بالورد الطائفي ويتعمق في العود الكمبودي والعنبر. حضور طاغٍ يدوم أكثر من 12 ساعة، لجلسات المساء والمناسبات الخاصة.',
    desc_en: 'A regal composition opening with Taif rose and deepening into Cambodian oud and amber. Over 12 hours of presence — made for evenings and special occasions.',
    featured: true,
  },
  {
    slug: 'rose-eternelle', name_ar: 'الورد الأبدي', name_en: 'Rose Éternelle', family: 'floral',
    price: 52000, compareAt: null, stock: 32, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['ورد دمشقي', 'ليتشي', 'مسك'], notes_en: ['Damask rose', 'Lychee', 'Musk'],
    desc_ar: 'قصيدة وردية: ورد دمشقي ندي يلتقي بليتشي فاكهي ومسك ناعم. أنثوي راقٍ يناسب النهار والليل.',
    desc_en: 'A rose poem: dewy Damask rose meets fruity lychee and soft musk. Refined femininity for day and night.',
    featured: true,
  },
  {
    slug: 'amber-nuit', name_ar: 'عنبر الليل', name_en: 'Amber Nuit', family: 'amber',
    price: 58000, compareAt: 65000, stock: 20, size: 100, concentration: 'Extrait de Parfum',
    notes_ar: ['عنبر ذهبي', 'فانيليا', 'صندل'], notes_en: ['Golden amber', 'Vanilla', 'Sandalwood'],
    desc_ar: 'دفء العنبر الذهبي مع فانيليا كريمية وصندل مخملي. عطر سهرات يلتف حولك كوشاح حريري.',
    desc_en: 'The warmth of golden amber with creamy vanilla and velvety sandalwood. An evening scent that wraps around you like silk.',
    featured: true,
  },
  {
    slug: 'musk-blanc', name_ar: 'المسك الأبيض', name_en: 'Musk Blanc', family: 'musk',
    price: 42000, compareAt: null, stock: 40, size: 50, concentration: 'Eau de Parfum',
    notes_ar: ['مسك أبيض', 'زهر البرتقال', 'خشب الكشمير'], notes_en: ['White musk', 'Orange blossom', 'Cashmere wood'],
    desc_ar: 'نقاء المسك الأبيض بلمسة من زهر البرتقال وخشب الكشمير. نظيف، هادئ، ويصلح للاستخدام اليومي.',
    desc_en: 'The purity of white musk lifted by orange blossom and cashmere wood. Clean, calm, and perfect for every day.',
  },
  {
    slug: 'citrus-imperial', name_ar: 'الحمضيات الإمبراطورية', name_en: 'Citrus Impérial', family: 'fresh',
    price: 39000, compareAt: 44000, stock: 45, size: 50, concentration: 'Eau de Toilette',
    notes_ar: ['برغموت', 'ليمون صقلي', 'نعناع'], notes_en: ['Bergamot', 'Sicilian lemon', 'Mint'],
    desc_ar: 'انفجار حمضي منعش: برغموت وليمون صقلي ونعناع بارد. عطر صباحي مثالي لأشهر الصيف.',
    desc_en: 'A fresh citrus burst: bergamot, Sicilian lemon and cool mint. The ideal morning scent for summer.',
    featured: true,
  },
  {
    slug: 'santal-noir', name_ar: 'الصندل الأسود', name_en: 'Santal Noir', family: 'woody',
    price: 56000, compareAt: null, stock: 22, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['صندل ميسوري', 'فيتيفر', 'جلد'], notes_en: ['Mysore sandalwood', 'Vetiver', 'Leather'],
    desc_ar: 'خشبي عميق بلمسة جلدية أنيقة: صندل ميسوري وفيتيفر مدخن. عطر رجالي صارم وحضور واثق.',
    desc_en: 'Deep woody elegance with a leather accord: Mysore sandalwood and smoky vetiver. A confident, structured masculine scent.',
  },
  {
    slug: 'jasmin-dor', name_ar: 'الياسمين الذهبي', name_en: "Jasmin d'Or", family: 'floral',
    price: 45000, compareAt: 52000, stock: 28, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['ياسمين سامباك', 'توبروز', 'عنبر'], notes_en: ['Sambac jasmine', 'Tuberose', 'Amber'],
    desc_ar: 'ياسمين سامباك أبيض بتوبروز مخملي وقاعدة عنبرية دافئة. زهري شرقي فاخر بثبات عالٍ.',
    desc_en: 'White sambac jasmine with velvety tuberose over a warm amber base. A luxurious oriental floral with lasting power.',
  },
  {
    slug: 'ambre-nomade', name_ar: 'العنبر الرحّال', name_en: 'Ambre Nomade', family: 'oriental',
    price: 48000, compareAt: null, stock: 26, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['عنبر', 'قرفة', 'لبان'], notes_en: ['Amber', 'Cinnamon', 'Frankincense'],
    desc_ar: 'رحلة صحراوية: عنبر دافئ وقرفة حارة ولبان بخوري. عطر شرقي جسور لمن يحب التميز.',
    desc_en: 'A desert journey: warm amber, spicy cinnamon and incense-like frankincense. A bold oriental for those who stand out.',
  },
  // ── World collection ────────────────────────────────────────
  {
    slug: 'paris-minuit', name_ar: 'باريس منتصف الليل', name_en: 'Paris Minuit', family: 'chypre',
    price: 52000, compareAt: null, stock: 30, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['برغموت', 'ياسمين', 'باتشولي'], notes_en: ['Bergamot', 'Jasmine', 'Patchouli'],
    desc_ar: 'أناقة باريسية ليلية: برغموت لامع، قلب ياسمين مخملي، وقاعدة باتشولي أرضية. عطر شيبر كلاسيكي بروح عصرية.',
    desc_en: 'Nocturnal Parisian elegance: radiant bergamot, a velvety jasmine heart and an earthy patchouli base. A classic chypre with a modern spirit.',
    featured: true,
  },
  {
    slug: 'tokyo-sakura', name_ar: 'طوكيو ساكورا', name_en: 'Tokyo Sakura', family: 'floral',
    price: 43000, compareAt: null, stock: 36, size: 50, concentration: 'Eau de Toilette',
    notes_ar: ['أزهار الكرز', 'مسك', 'خشب الأرز'], notes_en: ['Cherry blossom', 'Musk', 'Cedar'],
    desc_ar: 'رقّة الربيع الياباني: أزهار كرز ناعمة تنساب على مسك أبيض وخشب أرز خفيف. عطر نقي وعابر كأوراق الساكورا.',
    desc_en: 'The delicacy of Japanese spring: soft cherry blossoms drifting over white musk and light cedar. Pure and fleeting as sakura petals.',
    featured: true,
  },
  {
    slug: 'dubai-gold', name_ar: 'ذهب دبي', name_en: 'Dubai Gold', family: 'oriental',
    price: 75000, compareAt: 89000, stock: 18, size: 100, concentration: 'Extrait de Parfum',
    notes_ar: ['عود', 'زعفران', 'عنبر'], notes_en: ['Oud', 'Saffron', 'Amber'],
    desc_ar: 'فخامة الخليج: عود فاخر وزعفران ذهبي وعنبر دافئ. عطر استثنائي بتركيز Extrait وثبات يقارب 14 ساعة.',
    desc_en: 'Gulf opulence: precious oud, golden saffron and warm amber. An exceptional extrait with close to 14 hours of longevity.',
    featured: true,
  },
  {
    slug: 'istanbul-bazaar', name_ar: 'بازار إسطنبول', name_en: 'Istanbul Bazaar', family: 'spicy',
    price: 49000, compareAt: null, stock: 28, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['زعفران', 'قرفة', 'تبغ'], notes_en: ['Saffron', 'Cinnamon', 'Tobacco'],
    desc_ar: 'عبق البازار العثماني: زعفران وقرفة وتبغ دافئ. عطر حار جسور يحمل حكايات الشرق في كل رشّة.',
    desc_en: 'The scent of the Ottoman bazaar: saffron, cinnamon and warm tobacco. A bold spicy fragrance carrying eastern stories in every spray.',
  },
  {
    slug: 'marrakech-souk', name_ar: 'سوق مراكش', name_en: 'Marrakech Souk', family: 'spicy',
    price: 47000, compareAt: null, stock: 25, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['توابل', 'بخور', 'عنبر'], notes_en: ['Spices', 'Incense', 'Amber'],
    desc_ar: 'دفء المدينة الحمراء: توابل سوق مراكش، دخان بخور هادئ، وعنبر يلتف حول البشرة. عطر مغربي أصيل.',
    desc_en: 'The warmth of the red city: Marrakech souk spices, calm incense smoke and amber wrapping the skin. An authentic Moroccan scent.',
  },
  {
    slug: 'new-york-noir', name_ar: 'نيويورك نوار', name_en: 'New York Noir', family: 'leather',
    price: 61000, compareAt: null, stock: 20, size: 100, concentration: 'Extrait de Parfum',
    notes_ar: ['جلد', 'تبغ', 'عود'], notes_en: ['Leather', 'Tobacco', 'Oud'],
    desc_ar: 'نيويورك بعد الغروب: جلد مدبوغ، تبغ غني، ولمسة عود داكنة. عطر رجالي حضري بثقة لا تُخطئ.',
    desc_en: 'New York after dark: tanned leather, rich tobacco and a dark oud touch. An urban masculine scent with unmistakable confidence.',
  },
  {
    slug: 'london-fog', name_ar: 'ضباب لندن', name_en: 'London Fog', family: 'aquatic',
    price: 41000, compareAt: null, stock: 34, size: 100, concentration: 'Eau de Toilette',
    notes_ar: ['نوتات مائية', 'بتولا', 'مسك'], notes_en: ['Aquatic notes', 'Birch', 'Musk'],
    desc_ar: 'رطوبة صباح لندني: نوتات مائية باردة، خشب بتولا رطب، ومسك نظيف. منعش وأنيق للاستخدام اليومي.',
    desc_en: 'The damp of a London morning: cool aquatic notes, wet birch wood and clean musk. Fresh and elegant for everyday wear.',
  },
  {
    slug: 'bali-vanilla', name_ar: 'فانيليا بالي', name_en: 'Bali Vanilla', family: 'gourmand',
    price: 44000, compareAt: 50000, stock: 33, size: 50, concentration: 'Eau de Parfum',
    notes_ar: ['فانيليا', 'جوز الهند', 'تونكا'], notes_en: ['Vanilla', 'Coconut', 'Tonka'],
    desc_ar: 'حلاوة استوائية: فانيليا مدغشقرية، حليب جوز هند، وحبّة تونكا دافئة. عطر غورماند مريح يشبه نسمة بالي.',
    desc_en: 'Tropical sweetness: Madagascan vanilla, coconut milk and warm tonka bean. A comforting gourmand that feels like a Balinese breeze.',
    featured: true,
  },
  {
    slug: 'santorini-blue', name_ar: 'سانتوريني', name_en: 'Santorini Blue', family: 'aquatic',
    price: 42000, compareAt: null, stock: 38, size: 50, concentration: 'Eau de Toilette',
    notes_ar: ['نوتات بحرية', 'حمضيات', 'مسك'], notes_en: ['Marine notes', 'Citrus', 'Musk'],
    desc_ar: 'زرقة البحر الإيجي: ملح بحري، حمضيات مشمسة، ومسك أبيض. عطر صيفي مشرق يذكّر بشواطئ سانتوريني.',
    desc_en: 'The blue of the Aegean: sea salt, sunlit citrus and white musk. A bright summer scent that recalls the shores of Santorini.',
  },
  {
    slug: 'kyoto-cedar', name_ar: 'أرز كيوتو', name_en: 'Kyoto Cedar', family: 'woody',
    price: 53000, compareAt: null, stock: 24, size: 100, concentration: 'Eau de Parfum',
    notes_ar: ['أرز', 'موس', 'بخور'], notes_en: ['Cedar', 'Moss', 'Incense'],
    desc_ar: 'هدوء معبد ياباني: أرز كيوتو، طحالب رطبة، وبخور خفيف. عطر خشبي تأملي يوازن بين القوة والسكينة.',
    desc_en: 'The stillness of a Japanese temple: Kyoto cedar, damp moss and light incense. A meditative woody scent balancing strength and calm.',
  },
];

export function seed(): void {
  const count = db.prepare('SELECT COUNT(*) AS n FROM users').get() as {n: number};
  if (count.n > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  db.transaction(() => {
    const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)');
    insertUser.run('Islam Al-Nashar', 'admin@aura.com', bcrypt.hashSync('Admin@123', 10), 'admin', '+966500000000');
    const sara = insertUser.run('Sara Ahmed', 'sara@example.com', bcrypt.hashSync('User@123', 10), 'customer', '+966511111111');
    const omar = insertUser.run('Omar Khaled', 'omar@example.com', bcrypt.hashSync('User@123', 10), 'customer', '+966522222222');
    const saraId = Number(sara.lastInsertRowid);
    const omarId = Number(omar.lastInsertRowid);

    db.prepare('INSERT INTO addresses (user_id, label, line1, city, country, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, 1)')
      .run(saraId, 'Home', 'King Fahd Rd, Al Olaya', 'Riyadh', 'Saudi Arabia', '+966511111111');

    const insertCoupon = db.prepare('INSERT INTO coupons (code, type, value, min_subtotal, max_uses, expires_at, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)');
    insertCoupon.run('AURA10', 'percent', 10, 30000, 500, '2027-12-31');
    insertCoupon.run('VIP100', 'fixed', 10000, 50000, 200, '2027-12-31');

    const insertFamily = db.prepare('INSERT INTO categories (slug, name_ar, name_en) VALUES (?, ?, ?)');
    const familyIds = new Map<string, number>();
    for (const f of FAMILIES) {
      familyIds.set(f.slug, Number(insertFamily.run(f.slug, f.name_ar, f.name_en).lastInsertRowid));
    }

    const insertPerfume = db.prepare(`
      INSERT INTO products (sku, slug, name_ar, name_en, description_ar, description_en, price,
        compare_at_price, stock, category_id, brand, images, specs, is_active, is_featured,
        size_ml, concentration, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '{}', 1, ?, ?, ?, ?)
    `);

    PERFUMES.forEach((p, i) => {
      insertPerfume.run(
        `AURA-${String(i + 1).padStart(3, '0')}`,
        p.slug,
        p.name_ar,
        p.name_en,
        p.desc_ar,
        p.desc_en,
        p.price,
        p.compareAt,
        p.stock,
        familyIds.get(p.family)!,
        'ISLAM AL-NASHAR',
        JSON.stringify([`/images/perfumes/${p.slug}.webp`]),
        p.featured ? 1 : 0,
        p.size,
        p.concentration,
        JSON.stringify({ar: p.notes_ar, en: p.notes_en}),
      );
    });

    // Sample reviews on the first perfumes
    const ids = db.prepare('SELECT id FROM products ORDER BY id LIMIT 3').all() as {id: number}[];
    const insertReview = db.prepare('INSERT INTO reviews (product_id, user_id, rating, title, body) VALUES (?, ?, ?, ?, ?)');
    insertReview.run(ids[0].id, saraId, 5, 'فخامة حقيقية', 'ثبات مذهل ورائحة تلفت الانتباه. وصل التغليف كأنه هدية.');
    insertReview.run(ids[0].id, omarId, 5, 'يستحق كل ريال', 'من أفضل عطور العود التي جربتها.');
    insertReview.run(ids[1].id, saraId, 4, 'جميل جدًا', 'وردي ناعم وثابت، مناسب للنهار.');
    insertReview.run(ids[2].id, omarId, 5, 'دفء العنبر', 'رائحة سهرات راقية، أكرر الشراء.');

    db.exec(`
      UPDATE products SET
        rating_avg = COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = products.id), 0),
        rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = products.id)
    `);
  })();

  const total = (db.prepare('SELECT COUNT(*) AS n FROM products').get() as {n: number}).n;
  console.log(`Seeded: ${FAMILIES.length} fragrance families, ${total} perfumes, users, coupons, reviews.`);
}
