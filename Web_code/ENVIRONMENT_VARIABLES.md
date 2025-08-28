# Environment Variables Required for Cozy Project

## 🔑 Required Variables

Add these variables to your `.env.local` file:

```bash
# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration
EMAIL_USER=ahmed.alnjjar40@gmail.com
EMAIL_PASSWORD=icys ikna mhuo nvou
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 How to Get These Values

### 1. STRIPE_SECRET_KEY
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for testing)

### 2. STRIPE_WEBHOOK_SECRET
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 3. Email Configuration
1. **EMAIL_USER**: Your Gmail address
2. **EMAIL_PASSWORD**: Gmail App Password (not your regular password)
3. **EMAIL_HOST**: SMTP server (usually smtp.gmail.com)
4. **EMAIL_PORT**: SMTP port (587 for TLS, 465 for SSL)

#### How to get Gmail App Password:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled
4. Go to **App passwords**
5. Generate a new app password for "Mail"
6. Use this password in `EMAIL_PASSWORD`

### 4. NEXT_PUBLIC_APP_URL
- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

## 🧪 Testing vs Production

### Development (Testing)
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## ⚠️ Important Notes

1. **Never commit your `.env.local` file** to version control
2. **Use test keys** during development
3. **Switch to live keys** only when deploying to production
4. **Keep your secret keys secure** and never expose them in client-side code
5. **Use App Passwords** for Gmail, not your regular password
6. **Enable 2-Step Verification** on your Gmail account

## 🔍 Verification

After adding the variables, restart your development server:

```bash
npm run dev
```

Check the console for any missing environment variable errors.

## 📧 Email Features

With these email settings, you can:
- ✅ Send payment invoices
- ✅ Send password reset codes
- ✅ Send booking confirmations
- ✅ Send notification emails

## 🚀 Testing Email

To test if email is working, you can:
1. Make a payment and check if invoice is sent
2. Request password reset and check if code is sent
3. Check server logs for email errors


