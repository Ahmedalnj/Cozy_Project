# 🔧 Environment Variables Setup Guide

## 🎯 **Issue Identified**

The error "Stripe is not configured" occurs when required environment variables are missing or not properly configured.

## 📋 **Required Environment Variables**

### **1. Database Configuration**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database"
```

### **2. NextAuth Configuration**
```env
NEXTAUTH_URL="http://localhost:3000"  # For development
NEXTAUTH_SECRET="your-secret-key-here"
```

### **3. Google OAuth (Optional)**
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### **4. Stripe Configuration**
```env
STRIPE_SECRET_KEY="sk_test_..."  # Test key for development
STRIPE_PUBLISHABLE_KEY="pk_test_..."  # Test key for development
```

### **5. Email Configuration**
```env
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
```

### **6. Application URL**
```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # For development
```

## 🚀 **Vercel Deployment Setup**

### **1. Environment Variables in Vercel Dashboard**

Go to your Vercel project dashboard → Settings → Environment Variables and add:

#### **Production Environment:**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
STRIPE_SECRET_KEY="sk_live_..."  # Live key for production
STRIPE_PUBLISHABLE_KEY="pk_live_..."  # Live key for production
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

#### **Preview Environment (Optional):**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
DATABASE_DIRECT_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-preview-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"
STRIPE_SECRET_KEY="sk_test_..."  # Test key for preview
STRIPE_PUBLISHABLE_KEY="pk_test_..."  # Test key for preview
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
NEXT_PUBLIC_APP_URL="https://your-preview-domain.vercel.app"
```

### **2. Local Development Setup**

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cozy_db"
DATABASE_DIRECT_URL="postgresql://username:password@localhost:5432/cozy_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (Test Keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔍 **Troubleshooting**

### **1. "Stripe is not configured" Error**
- ✅ **Check**: `STRIPE_SECRET_KEY` is set
- ✅ **Check**: `NEXT_PUBLIC_APP_URL` is set
- ✅ **Check**: Environment variables are properly configured in Vercel

### **2. Database Connection Issues**
- ✅ **Check**: `DATABASE_URL` is correct
- ✅ **Check**: Database is accessible from Vercel
- ✅ **Check**: Database credentials are correct

### **3. Email Not Working**
- ✅ **Check**: `EMAIL_USER` and `EMAIL_PASSWORD` are set
- ✅ **Check**: Gmail app password is generated correctly
- ✅ **Check**: SMTP settings are correct

### **4. Authentication Issues**
- ✅ **Check**: `NEXTAUTH_URL` matches your domain
- ✅ **Check**: `NEXTAUTH_SECRET` is set
- ✅ **Check**: Google OAuth credentials are correct (if using)

## 🧪 **Testing Environment Variables**

### **1. Local Testing**
```bash
# Start development server
npm run dev

# Check if environment variables are loaded
# Look for console logs in the terminal
```

### **2. Vercel Testing**
```bash
# Deploy to Vercel
git push origin main

# Check build logs for any environment variable errors
# Test the application functionality
```

## 📝 **Important Notes**

### **1. Security**
- ✅ **Never commit** `.env.local` to version control
- ✅ **Use different keys** for development and production
- ✅ **Rotate secrets** regularly

### **2. Stripe Keys**
- ✅ **Test keys** start with `sk_test_` and `pk_test_`
- ✅ **Live keys** start with `sk_live_` and `pk_live_`
- ✅ **Use test keys** for development and preview deployments
- ✅ **Use live keys** only for production

### **3. Database**
- ✅ **Use a production database** for Vercel deployment
- ✅ **Ensure database is accessible** from Vercel's servers
- ✅ **Use connection pooling** for better performance

### **4. Email**
- ✅ **Generate app password** for Gmail (don't use regular password)
- ✅ **Enable 2FA** on your Gmail account
- ✅ **Test email functionality** after deployment

## 🚀 **Quick Setup Checklist**

- [ ] **Database**: Set up PostgreSQL database
- [ ] **Environment Variables**: Configure all required variables
- [ ] **Stripe**: Create Stripe account and get API keys
- [ ] **Email**: Set up Gmail app password
- [ ] **Vercel**: Add environment variables to Vercel dashboard
- [ ] **Test**: Deploy and test all functionality
- [ ] **Monitor**: Check logs for any errors

---

## ✅ **CONCLUSION**

**Proper environment variable configuration is essential for successful deployment!**

- ✅ **All required variables** must be set
- ✅ **Different values** for development and production
- ✅ **Secure handling** of sensitive information
- ✅ **Regular testing** of functionality

**🚀 Follow this guide to ensure your Cozy Project deploys successfully!**
