# GoalSphere - أخبار كرة القدم باللغة العربية

## نظرة عامة

GoalSphere هو تطبيق ويب متخصص في تقديم أخبار كرة القدم والإحصائيات باللغة العربية، مصمم خصيصاً للجمهور العربي مع دعم كامل للاتجاه من اليمين إلى اليسار (RTL).

## التقنيات المستخدمة

### Frontend
- **Next.js 14** - إطار عمل React مع دعم SSR/SSG للـ SEO
- **Tailwind CSS** - نظام تصميم سريع مع دعم RTL
- **Framer Motion** - مكتبة الرسوم المتحركة
- **TypeScript** - لضمان نوعية الكود

### Backend
- **Next.js API Routes** - دوال serverless
- **PostgreSQL** - قاعدة بيانات علائقية
- **Prisma ORM** - إدارة قاعدة البيانات

### الاستضافة والأداء
- **Vercel** - استضافة محسنة لـ Next.js
- **Cloudinary** - تحسين الصور
- **Redis** - التخزين المؤقت

## هيكل قاعدة البيانات

### جدول المقالات (Articles)
```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    image_url VARCHAR(1000),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    related_team_ids UUID[] DEFAULT '{}',
    related_player_ids UUID[] DEFAULT '{}',
    is_breaking BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### جدول الفرق (Teams)
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    logo_url VARCHAR(1000),
    league VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    founded INTEGER,
    stadium VARCHAR(200),
    website VARCHAR(500),
    social_media JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## المكونات الرئيسية

### 1. HeroCarousel
- عرض المقالات المميزة في شكل carousel
- دعم الرسوم المتحركة والتنقل التلقائي
- عرض المعلومات الأساسية للمقال

### 2. LiveTicker
- عرض النتائج المباشرة والمباريات القادمة
- تحديث تلقائي كل 3 ثوان
- دعم حالات مختلفة للمباريات

### 3. CategoryFilter
- فلترة المقالات حسب الفئة
- دعم RTL في التصميم
- واجهة مستخدم تفاعلية

### 4. ArticleCard
- عرض المقالات في شكل بطاقات
- دعم أحجام مختلفة (compact, default, featured)
- عرض الإعلانات المدمجة

### 5. AdUnit
- إدارة وحدات الإعلانات
- دعم أنواع مختلفة من الإعلانات
- حقن الإعلانات في المحتوى

## دمج الإعلانات

### حقن الإعلانات في المقالات
```typescript
export function injectInArticleAds(
  articleContent: string, 
  adUnits: AdUnitType[], 
  adPosition: 'after-paragraph-2' | 'after-paragraph-5' = 'after-paragraph-2'
): string {
  const paragraphs = articleContent.split('\n\n')
  const adUnit = adUnits.find(ad => ad.type === 'in-article' && ad.isActive)
  
  if (!adUnit || paragraphs.length < 2) return articleContent

  const targetParagraph = adPosition === 'after-paragraph-2' ? 1 : 4
  const adHtml = `
    <div class="ad-unit-container my-6 p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg text-center">
      <div class="text-xs text-gray-500 mb-2">إعلان</div>
      <div class="text-gray-300">${adUnit.content}</div>
      <button class="mt-2 bg-sport-red text-white px-4 py-1 rounded-full text-xs">انقر هنا</button>
    </div>
  `

  if (targetParagraph < paragraphs.length) {
    paragraphs.splice(targetParagraph + 1, 0, adHtml)
  }

  return paragraphs.join('\n\n')
}
```

## التثبيت والتشغيل

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
```bash
cp .env.example .env.local
```

### 3. تشغيل قاعدة البيانات
```bash
# باستخدام Docker
docker-compose up -d

# أو تشغيل PostgreSQL محلياً
createdb goalsphere
psql goalsphere < lib/database.sql
```

### 4. تشغيل التطبيق
```bash
npm run dev
```

## الميزات الرئيسية

### دعم RTL كامل
- جميع عناصر الواجهة تدعم الاتجاه من اليمين إلى اليسار
- استخدام خط Cairo العربي
- تخطيط محسن للقراءة العربية

### تصميم متجاوب
- مصمم للأجهزة المحمولة أولاً
- دعم جميع أحجام الشاشات
- تحسين الأداء على الاتصالات البطيئة

### SEO محسن
- دعم كامل للـ SEO العربي
- URLs نظيفة ومحسنة
- Schema markup للمقالات

### أداء عالي
- تحميل الصفحة في أقل من 3 ثوان على 3G
- تحسين الصور التلقائي
- تخزين مؤقت ذكي

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف LICENSE للتفاصيل.
