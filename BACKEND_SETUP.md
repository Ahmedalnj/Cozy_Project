# 🚀 إعداد Next.js Backend للـ Flutter App

## 📋 المتطلبات

### **1. تثبيت Node.js و npm**
```bash
# تحقق من الإصدارات
node --version
npm --version
```

### **2. إنشاء Next.js Project**
```bash
# في مجلد web
npx create-next-app@latest . --typescript --tailwind --eslint
npm install
```

## 📦 التبعيات المطلوبة

### **3. تثبيت التبعيات**
```bash
npm install @prisma/client prisma
npm install bcryptjs jsonwebtoken
npm install @types/bcryptjs @types/jsonwebtoken
npm install cors
npm install @types/cors
```

## 🗄️ إعداد Prisma

### **4. تهيئة Prisma**
```bash
npx prisma init
```

### **5. إعداد Prisma Schema**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  hashedPassword String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  favoriteIds   String[] @default([])
  role          String   @default("USER")
  
  // Relations
  listings      Listing[]
  reservations  Reservation[]
  accounts      Account[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Listing {
  id            String   @id @default(cuid())
  title         String
  description   String
  locationValue String
  price         Int
  roomCount     Int
  bathroomCount Int
  guestCount    Int
  category      String
  imageSrc      String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  userId        String
  user          User @relation(fields: [userId], references: [id], onDelete: Cascade)
  reservations  Reservation[]
}

model Reservation {
  id         String   @id @default(cuid())
  startDate  DateTime
  endDate    DateTime
  totalPrice Float
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Relations
  userId     String
  user       User @relation(fields: [userId], references: [id], onDelete: Cascade)
  listingId  String
  listing    Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
}
```

### **6. إعداد Environment Variables**
```env
# .env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔧 إنشاء API Routes

### **7. إنشاء API Routes**

#### **Authentication APIs**
```typescript
// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.hashedPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

```typescript
// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

#### **Listings APIs**
```typescript
// pages/api/listings/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany({
        include: {
          user: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.status(200).json(listings);
    } catch (error) {
      console.error('Get listings error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, locationValue, price, roomCount, bathroomCount, guestCount, category, imageSrc } = req.body;
      
      // Get user from token (implement middleware for this)
      const userId = req.headers['user-id'] as string;

      const listing = await prisma.listing.create({
        data: {
          title,
          description,
          locationValue,
          price: parseInt(price),
          roomCount: parseInt(roomCount),
          bathroomCount: parseInt(bathroomCount),
          guestCount: parseInt(guestCount),
          category,
          imageSrc,
          userId,
        }
      });

      res.status(201).json(listing);
    } catch (error) {
      console.error('Create listing error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

#### **Favorites APIs**
```typescript
// pages/api/favorites/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = req.headers['user-id'] as string;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          listings: {
            where: {
              id: {
                in: user.favoriteIds
              }
            }
          }
        }
      });

      res.status(200).json(user?.listings || []);
    } catch (error) {
      console.error('Get favorites error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

```typescript
// pages/api/favorites/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = req.headers['user-id'] as string;

  if (req.method === 'POST') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const favoriteIds = user.favoriteIds;
      const isFavorite = favoriteIds.includes(id as string);

      let updatedFavoriteIds: string[];
      if (isFavorite) {
        updatedFavoriteIds = favoriteIds.filter(favId => favId !== id);
      } else {
        updatedFavoriteIds = [...favoriteIds, id as string];
      }

      await prisma.user.update({
        where: { id: userId },
        data: { favoriteIds: updatedFavoriteIds }
      });

      res.status(200).json({ isFavorite: !isFavorite });
    } catch (error) {
      console.error('Toggle favorite error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

#### **Reservations APIs**
```typescript
// pages/api/reservations/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userId = req.headers['user-id'] as string;
      
      const reservations = await prisma.reservation.findMany({
        where: { userId },
        include: {
          listing: true
        },
        orderBy: {
          startDate: 'desc'
        }
      });

      res.status(200).json(reservations);
    } catch (error) {
      console.error('Get reservations error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { listingId, startDate, endDate, totalPrice } = req.body;
      const userId = req.headers['user-id'] as string;

      const reservation = await prisma.reservation.create({
        data: {
          listingId,
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice: parseFloat(totalPrice),
        },
        include: {
          listing: true
        }
      });

      res.status(201).json(reservation);
    } catch (error) {
      console.error('Create reservation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

## 🔐 Middleware للمصادقة

### **8. إنشاء Auth Middleware**
```typescript
// utils/auth.ts
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export function authMiddleware(handler: Function) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;
      req.headers['user-id'] = decoded.userId;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
```

## 🚀 تشغيل المشروع

### **9. تشغيل Backend**
```bash
# تطبيق Prisma migrations
npx prisma migrate dev

# تشغيل المشروع
npm run dev
```

### **10. اختبار APIs**
```bash
# اختبار تسجيل الدخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# اختبار جلب العقارات
curl http://localhost:3000/api/listings
```

## 📱 ربط Flutter

### **11. تحديث Flutter**
- تم إنشاء `ApiService` في Flutter
- تغيير `baseUrl` في `lib/core/api_service.dart` إلى `http://localhost:3000/api`
- استبدال `SupabaseService` بـ `ApiService` في جميع الملفات

## 🔧 إعدادات إضافية

### **12. CORS Configuration**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## ✅ التحقق من العمل

### **13. اختبار التكامل**
1. تشغيل Next.js backend على `http://localhost:3000`
2. تشغيل Flutter app
3. اختبار تسجيل الدخول
4. اختبار جلب العقارات
5. اختبار إضافة عقار جديد

## 🐛 استكشاف الأخطاء

### **14. مشاكل شائعة**
- **CORS errors**: تأكد من إعدادات CORS
- **Database connection**: تحقق من `DATABASE_URL`
- **JWT errors**: تحقق من `JWT_SECRET`
- **Port conflicts**: تأكد من أن port 3000 متاح

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
1. إعدادات البيئة (Environment variables)
2. اتصال قاعدة البيانات
3. تشغيل Prisma migrations
4. صحة JWT tokens
