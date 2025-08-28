# Stripe Payment Integration Setup Guide

This guide explains how to set up Stripe payments for the reservation system.

## 🚀 Quick Start

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook secret
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Your app URL
```

### 2. Stripe Dashboard Setup

1. **Get API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to Developers → API keys
   - Copy your Secret key and Publishable key

2. **Configure Webhooks:**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook secret

## 🔧 API Endpoints

### Create Checkout Session
- **URL:** `POST /api/stripe/create-session`
- **Purpose:** Creates a Stripe checkout session for reservations
- **Body:**
  ```json
  {
    "reservationId": "res_123",
    "amount": 150.00,
    "currency": "usd",
    "listingId": "list_456",
    "userId": "user_789",
    "startDate": "2024-01-15",
    "endDate": "2024-01-18",
    "description": "Reservation for Beach House",
    "customerEmail": "user@example.com"
  }
  ```

### Webhook Handler
- **URL:** `POST /api/stripe/webhook`
- **Purpose:** Handles Stripe webhook events (payment confirmations)
- **Events Handled:**
  - `checkout.session.completed` - Payment successful
  - `payment_intent.succeeded` - Payment intent succeeded
  - `payment_intent.payment_failed` - Payment failed

## 💳 Payment Flow

1. **User selects dates and confirms reservation**
2. **System creates temporary reservation**
3. **User clicks "Confirm Reservation"**
4. **System creates Stripe checkout session**
5. **User redirected to Stripe checkout**
6. **User completes payment**
7. **Stripe redirects to success/cancel page**
8. **Webhook updates reservation status**

## 🧪 Testing

### Test Cards
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

### Test Environment
- Use test API keys for development
- Test webhooks with Stripe CLI
- Monitor logs for webhook events

## 🔒 Security Features

- **Webhook Signature Verification:** Ensures webhooks come from Stripe
- **HTTPS Only:** All payment endpoints require HTTPS in production
- **Input Validation:** All inputs are validated before processing
- **Error Handling:** Comprehensive error handling and logging

## 📱 Frontend Integration

The reservation page (`app/reservation/page.tsx`) includes:
- Stripe payment method selection
- Payment confirmation button
- Loading states and error handling
- Redirect to Stripe checkout

## 🎯 Success/Cancel Pages

- **Success Page:** `/payment/success` - Shows payment confirmation
- **Cancel Page:** `/payment/cancel` - Shows payment cancellation

## 🚨 Troubleshooting

### Common Issues

1. **Webhook not receiving events:**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs

2. **Payment session creation fails:**
   - Verify STRIPE_SECRET_KEY
   - Check request body format
   - Ensure all required fields are present

3. **Redirect issues:**
   - Verify NEXT_PUBLIC_APP_URL
   - Check success/cancel URLs in checkout session

### Debug Mode

Enable detailed logging by checking console output:
- Payment session creation
- Webhook event processing
- Error details and stack traces

## 📞 Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For application issues:
- Check server logs
- Verify environment variables
- Test with Stripe test mode


