# Aloha Pay Demo

A demonstration project showing how to integrate **Aloha Pay Embedded Checkout** into a React application. This demo simulates a hotel booking flow (Coral Cove Resort) where users can complete payments using Aloha Pay.

## What is Aloha Pay?

Aloha Pay is a payment platform designed for Latin America, supporting local payment methods across Argentina, Brazil, Chile, Colombia, and Mexico. The Embedded Checkout allows you to integrate a payment widget directly into your application.

## Prerequisites

- Node.js 18+
- npm or pnpm

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Aloha Pay API Configuration (server-side)
ALOHA_PAY_API_URL=https://api-dev.alohapay.co
ALOHA_PAY_API_KEY=your_api_key_here

# Client-side API Key (VITE_ prefix exposes it to the browser)
VITE_ALOHA_PAY_API_KEY=your_api_key_here
```

> **Note:** Contact the Aloha Pay team to obtain your API keys. Use sandbox/development keys for testing.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aloha-pay-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Aloha Pay API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Aloha Pay Integration

### Embedded Checkout Component

The main integration component is located at `src/components/aloha-pay/AlohaPayCheckout.tsx`. This component:

1. Loads the Aloha Pay SDK from CDN
2. Initializes the payment widget in a container
3. Handles payment lifecycle events

#### Basic Usage

```tsx
import { AlohaPayCheckout } from "@/components/aloha-pay/AlohaPayCheckout";

function PaymentPage() {
  return (
    <AlohaPayCheckout
      apiKey={import.meta.env.VITE_ALOHA_PAY_API_KEY}
      amount={150.00}
      description="Order #12345"
      locale="es"
      defaultCountry="MX"
      useSandbox={true}
      customer={{
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+52 555 123 4567",
      }}
      onPaymentComplete={() => {
        console.log("Payment completed!");
      }}
      onError={(error) => {
        console.error("Payment error:", error);
      }}
    />
  );
}
```

#### Props Reference

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `apiKey` | `string` | Yes | Your Aloha Pay API key |
| `amount` | `number` | Yes | Payment amount in the local currency |
| `description` | `string` | No | Payment description shown to the user |
| `locale` | `"en" \| "es" \| "pt"` | No | Widget language (default: `"es"`) |
| `defaultCountry` | `AlohaPayCountry` | No | Pre-select a country (AR, BR, CL, CO, MX) |
| `useSandbox` | `boolean` | No | Use sandbox environment (default: `false`) |
| `customer` | `CustomerData` | No | Pre-fill customer information |
| `styles` | `CheckoutStyles` | No | Custom styling for the widget |
| `onReady` | `() => void` | No | Called when widget is ready |
| `onError` | `(error: Error) => void` | No | Called on errors |
| `onPaymentLinkCreated` | `(data: { id: string; url: string }) => void` | No | Called when payment link is created |
| `onPaymentComplete` | `() => void` | No | Called when payment is completed |

### Supported Countries

Aloha Pay supports the following countries:

| Code | Country |
|------|---------|
| `AR` | Argentina |
| `BR` | Brazil |
| `CL` | Chile |
| `CO` | Colombia |
| `MX` | Mexico |

Use the helper function to check if a country is supported:

```tsx
import { isAlohaPaCountrySupported } from "@/components/aloha-pay/AlohaPayCheckout";

if (isAlohaPaCountrySupported(userCountry)) {
  // Show Aloha Pay option
}
```

### Custom Styling

Customize the widget appearance using the `styles` prop. Here's the example used in this demo with the Coral Cove Resort teal theme:

```tsx
<AlohaPayCheckout
  // ... other props
  styles={{
    // Ocean teal gradient header (resort-ocean theme)
    headerBackground: "linear-gradient(135deg, #3B9AAD 0%, #2D7A8A 100%)",
    // White text for amount display
    amountColor: "#ffffff",
    // Ocean teal button matching the site theme
    buttonColor: "#3B9AAD",
    // White text on button
    buttonTextColor: "#ffffff",
    // Coral accent for links (resort-coral)
    linkColor: "#D97056",
  }}
/>
```

#### Theme Color Reference

| Color | CSS Variable | Hex | Usage |
|-------|--------------|-----|-------|
| Ocean Teal | `--resort-ocean` | `#3B9AAD` | Primary actions, buttons, headers |
| Ocean Dark | `--resort-ocean-dark` | `#2D7A8A` | Gradient endpoints, hover states |
| Coral | `--resort-coral` | `#D97056` | Accents, links, badges |
| Palm | `--resort-palm` | `#5B9A65` | Success states |
| Sand | `--resort-sand` | `#F7F5F0` | Backgrounds |

### Amount Types (receive vs charge)

When creating payment links, you can specify how the amount should be interpreted:

| Type | Description | Use Case |
|------|-------------|----------|
| `receive` | You receive exactly the requested amount in your wallet currency. The payer pays the equivalent in their local currency. | When you need a specific amount (e.g., "I need to receive exactly $100 USD") |
| `charge` | The payer pays exactly the specified amount in their currency. You receive whatever the exchange rate gives you. | When the payer's amount matters (e.g., "Charge the customer exactly 50,000 CLP") |

```tsx
// Example: Receive exactly 100 USD, customer pays equivalent in CLP
{
  amount: 100,
  currency: "CLP",
  amount_type: "receive"
}

// Example: Charge customer exactly 88,000 CLP
{
  amount: 88000,
  currency: "CLP",
  amount_type: "charge"
}
```

### Supported Currencies

| Code | Currency | Country |
|------|----------|---------|
| `ARS` | Peso Argentino | Argentina |
| `BRL` | Real Brasileño | Brazil |
| `CLP` | Peso Chileno | Chile |
| `COP` | Peso Colombiano | Colombia |
| `MXN` | Peso Mexicano | Mexico |

### Payment Links API (Server-Side)

For server-side integrations, you can create payment links directly via the API:

```typescript
// src/lib/aloha-pay.ts
const response = await fetch("https://api.alohapay.co/api/external/v1/payment-links", {
  method: "POST",
  headers: {
    "X-API-KEY": process.env.ALOHA_PAY_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: 165000,
    currency: "CLP",
    description: "Hotel Reservation - Ocean View Room",
    amount_type: "charge",
    webhook_url: "https://yoursite.com/api/webhooks/aloha-pay"
  }),
});

const { data } = await response.json();
// data.id - Payment link ID
// data.url - URL to redirect customer
// data.expires_at - Expiration timestamp
```

### Webhooks

Configure a webhook URL to receive payment notifications:

```typescript
// Example webhook handler
export async function handleWebhook(request: Request) {
  const payload = await request.json();

  switch (payload.event) {
    case "payment.completed":
      // Payment was successful
      await updateOrderStatus(payload.data.payment_link_id, "paid");
      break;
    case "payment.failed":
      // Payment failed
      await updateOrderStatus(payload.data.payment_link_id, "failed");
      break;
  }

  return new Response("OK", { status: 200 });
}
```

### Error Handling

Common errors and how to handle them:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `ORIGIN_NOT_ALLOWED` | API key not configured for your domain | Contact support to whitelist your domain |
| `INVALID_AMOUNT` | Amount is invalid or zero | Ensure amount > 0 |
| `INVALID_CURRENCY` | Currency not supported | Use one of: ARS, BRL, CLP, COP, MXN |
| `EXPIRED_LINK` | Payment link has expired | Create a new payment link |

### Security Best Practices

1. **Never expose server-side API keys** - Use `VITE_` prefix only for client-safe keys
2. **Validate webhooks** - Verify webhook signatures to prevent spoofing
3. **Use HTTPS** - Always use HTTPS in production
4. **Validate amounts server-side** - Don't trust client-provided amounts
5. **Use sandbox for testing** - Set `useSandbox={true}` during development

```typescript
// Good: Server-side API key (not exposed to browser)
const apiKey = process.env.ALOHA_PAY_API_KEY;

// Good: Client-side key (safe to expose)
const clientKey = import.meta.env.VITE_ALOHA_PAY_API_KEY;
```

## Project Structure

```
src/
├── components/
│   ├── aloha-pay/
│   │   └── AlohaPayCheckout.tsx    # Aloha Pay integration component
│   ├── hotel/                       # Demo hotel booking components
│   └── ui/                          # Shadcn UI components
├── routes/
│   ├── index.tsx                    # Home page
│   ├── checkout.tsx                 # Checkout flow with payment
│   └── api.payment-links.ts         # Payment Links API endpoint
├── hooks/
│   └── useBookingWizard.ts          # Booking state management
├── lib/
│   ├── aloha-pay.ts                 # Aloha Pay API client
│   └── hotel/                       # Utility functions
├── locales/
│   ├── en.json                      # English translations
│   └── es.json                      # Spanish translations
└── types/
    └── hotel.ts                     # TypeScript definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests with Vitest |
| `npm run lint` | Lint code with Biome |
| `npm run format` | Format code with Biome |
| `npm run check` | Run Biome check (lint + format) |

## Tech Stack

- **Framework:** TanStack Start (React + SSR)
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Testing:** Vitest
- **Linting/Formatting:** Biome
- **Internationalization:** i18next

## Demo Flow

1. **Home Page:** Browse available hotel rooms
2. **Checkout Step 1:** Select dates and number of guests
3. **Checkout Step 2:** Choose a room
4. **Checkout Step 3:** Enter guest information
5. **Checkout Step 4:** Select Aloha Pay and complete payment

## Documentation

> **Important:** Before integrating Aloha Pay into your application, we strongly recommend reading the complete documentation at **[developers.alohapay.co](https://developers.alohapay.co)**.

The documentation covers:
- API reference and authentication
- Webhooks and event handling
- Payment methods by country
- Testing in sandbox mode
- Error handling and troubleshooting
- Security best practices

## Additional Resources

- [Aloha Pay Developer Portal](https://developers.alohapay.co)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

## Support

For questions about Aloha Pay integration, contact us at **developers@aloha.co** or visit the [developer portal](https://developers.alohapay.co).
