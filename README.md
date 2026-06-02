# 🛒 Tle Store | E-Commerce Workshop

![Live Demo](https://img.shields.io/badge/Live-Demo-Online-success)

A full-featured e-commerce platform built with Next.js 16, featuring role-based access control, product management, shopping cart, order processing, and admin dashboard with real-time analytics.

## 🛠️ Tech Stack

| Layer      | Technology                                                          |
| ---------- | ------------------------------------------------------------------- |
| Framework  | Next.js 16.1.6                                                      |
| Frontend   | React 19.2.3, TypeScript 5                                          |
| Backend    | Next.js App Router, Server Actions                                  |
| Runtime    | Node.js                                                             |
| Database   | PostgreSQL with Prisma 6.19.2                                       |
| Auth       | JWT (jose), bcrypt                                                  |
| Storage    | ImageKit CDN with sharp                                             |
| Validation | Zod 4.3.6                                                           |
| Caching    | Next.js "use cache" with cacheTag/cacheLife                         |
| UI Extras  | shadcn/ui, Radix UI, Tailwind CSS 4, Lucide React, Sonner, Recharts |
| Tools      | ESLint, sharp, qrcode, dayjs, next-themes                           |

## ✨ Features Overview

- **Role-Based Access Control (RBAC)**: Customer and Admin roles with different permissions
- **Authentication**: Sign up, sign in, sign out with JWT tokens stored in httpOnly cookies
- **Product Management**: Admin can create, edit, delete products with multiple images
- **Category Management**: Admin can manage product categories
- **Shopping Cart**: Add to cart, update quantity, remove items with optimistic UI updates
- **Order Management**: Customers can place orders, upload payment slips, cancel orders
- **Order Processing**: Admin can view all orders, update status (Pending → Paid → Shipped → Delivered), add tracking numbers
- **Dashboard**: Admin dashboard with revenue, orders, users statistics and growth rates
- **Image Upload**: ImageKit CDN integration with sharp for image optimization (WebP, resize to 1200x1200)
- **Payment**: PromptPay QR code generation for payment
- **Low Stock Alerts**: Products with stock ≤ 5 are highlighted
- **Search & Filter**: Search products by title, filter by category, price range, stock status, sort by price/popularity
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Toast Notifications**: Sonner for user feedback
- **Suspense Boundaries**: Loading states for async components

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Public routes (homepage, products)
│   │   ├── layout.tsx            # Main layout for public pages
│   │   ├── loading.tsx           # Loading state for main routes
│   │   ├── page.tsx              # Homepage with hero and featured products
│   │   └── products/             # Product listing and detail pages
│   │       ├── page.tsx         # Product listing page
│   │       └── [id]/            # Product detail page
│   ├── (protected)/              # Authenticated customer routes
│   │   ├── layout.tsx            # Protected layout
│   │   ├── loading.tsx           # Loading state for protected routes
│   │   ├── cart/                 # Shopping cart page
│   │   ├── checkout/             # Checkout page with PromptPay QR
│   │   ├── my-orders/            # Customer order history
│   │   │   ├── page.tsx         # Order list page
│   │   │   └── [id]/            # Order detail page
│   │   ├── order-confirmation/   # Order confirmation page
│   │   └── profile/              # User profile management
│   ├── admin/                    # Admin-only routes
│   │   ├── layout.tsx            # Admin layout
│   │   ├── loading.tsx           # Loading state for admin routes
│   │   ├── page.tsx              # Admin home page
│   │   ├── categories/          # Category management
│   │   ├── dashboard/           # Admin dashboard with stats
│   │   ├── orders/              # Order management with status updates
│   │   │   ├── page.tsx         # Order list page
│   │   │   └── [id]/            # Order detail page
│   │   ├── products/            # Product management (list, create, edit)
│   │   │   ├── page.tsx         # Product list page
│   │   │   ├── new/             # Create new product
│   │   │   └── edit/            # Edit existing product
│   │   │       └── [id]/        # Product edit page
│   │   └── users/               # User management
│   │       ├── page.tsx         # User list page
│   │       └── [id]/            # User detail page
│   │           └── edit/        # Edit user page
│   ├── api/                     # API routes (currently empty)
│   ├── auth/                    # Authentication pages
│   │   ├── signin/              # Sign in page
│   │   └── signup/              # Sign up page
│   ├── layout.tsx                # Root layout with fonts and metadata
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── admin-page/              # Admin-specific components
│   ├── customer-page/           # Customer-specific components
│   ├── layout/                  # Layout components (currently empty)
│   ├── order/                   # Order-related components (currently empty)
│   ├── product/                 # Product-related components (currently empty)
│   ├── shared/                  # Shared components
│   └── ui/                      # shadcn/ui components
├── features/                    # Feature-based architecture
│   ├── analytics/               # Analytics feature (currently empty)
│   ├── auths/                   # Authentication feature
│   │   ├── actions/             # Server actions for auth
│   │   ├── db/                  # Database queries and cache
│   │   ├── permissions/         # Auth permissions
│   │   └── schemas/             # Zod validation schemas
│   ├── carts/                   # Shopping cart feature
│   │   ├── actions/             # Server actions for cart
│   │   ├── db/                  # Database queries and cache
│   │   ├── permissions/         # Cart permissions
│   │   └── schemas/             # Zod validation schemas
│   ├── categories/              # Category feature
│   │   ├── actions/             # Server actions for categories
│   │   ├── db/                  # Database queries and cache
│   │   ├── permissions/         # Category permissions
│   │   └── schemas/             # Zod validation schemas
│   ├── dashboard/               # Dashboard feature
│   │   └── db/                  # Dashboard stats queries
│   ├── orders/                  # Order feature
│   │   ├── actions/             # Server actions for orders
│   │   ├── db/                  # Database queries and cache
│   │   ├── permissions/         # Order permissions
│   │   └── schemas/             # Zod validation schemas
│   ├── products/                # Product feature
│   │   ├── actions/             # Server actions for products
│   │   ├── db/                  # Database queries and cache
│   │   ├── permissions/         # Product permissions
│   │   └── schemas/             # Zod validation schemas
│   └── users/                   # User feature
│       ├── actions/             # Server actions for users
│       ├── db/                  # Database queries and cache
│       ├── permissions/         # User permissions
│       └── schemas/             # Zod validation schemas
├── lib/                         # Utility functions
│   ├── config.ts                # App configuration (lowStockThreshold, shippingFee)
│   ├── dataCache.ts             # Cache tag helpers
│   ├── dayjs.ts                 # Day.js configuration
│   ├── db.ts                    # Prisma client singleton
│   ├── errors.ts                # Custom error classes
│   ├── formatDate.ts            # Date formatting utility
│   ├── formatPrice.ts           # Price formatting utility
│   ├── generateOrderNumber.ts   # Order number generator
│   ├── generatePromptPayQR.ts   # PromptPay QR code generator
│   ├── imageKit.ts              # ImageKit upload/delete functions
│   ├── productUtils.ts          # Product utilities (SKU generation)
│   ├── schemas/                 # Schemas directory (currently empty)
│   ├── utils.ts                 # General utilities
│   └── validators/              # Validators directory (currently empty)
├── hooks/                       # Custom React hooks
│   ├── use-form.ts              # Form hook with toast notifications
│   └── use-sign-out.ts          # Sign out hook
├── providers/                   # Context providers
│   └── SidebarProvider.tsx      # Sidebar state provider
├── types/                       # TypeScript type definitions
│   ├── action.ts                # Action state types
│   ├── cart.d.ts                # Cart types
│   ├── category.d.ts            # Category types
│   ├── order.d.ts               # Order types
│   ├── product.d.ts             # Product types
│   ├── shared/                  # Shared types (currently empty)
│   └── user.d.ts                # User types
└── proxy.ts                     # Next.js middleware for JWT verification
```

## 🗃️ Database Schema

| Model            | Description                                                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**         | User accounts with authentication, profile data, and role-based access. Fields: id, name, email, password (bcrypt), status (Active/Banned), role (Customer/Admin), pictureId, picture, address, tel, timestamps                             |
| **Category**     | Product categories for organization. Fields: id, name, status (Active/Inactive), timestamps                                                                                                                                                 |
| **Product**      | Product catalog with pricing, stock tracking, and sales data. Fields: id, title, description, cost, basePrice, price, sold, stock, status (Active/Inactive), categoryId, timestamps                                                         |
| **ProductImage** | Product images with main image flag. Fields: id, url, fileId, isMain, productId, timestamps                                                                                                                                                 |
| **Cart**         | Shopping cart per user with total calculation. Fields: id, cartTotal, orderedById, timestamps                                                                                                                                               |
| **CartItem**     | Items in cart with quantity and price. Fields: id, count, price, cartId, productId                                                                                                                                                          |
| **Order**        | Customer orders with payment and shipping info. Fields: id, orderNumber, totalAmount, status (Pending/Paid/Shipped/Delivered/Cancelled), paymentImage, paymentAt, address, phone, note, shippingFee, trackingNumber, customerId, timestamps |
| **OrderItem**    | Line items in orders with product snapshot. Fields: id, quantity, price, totalPirce, productTitle, productImage, orderId, productId, timestamps                                                                                             |

## 🔄 System Flow

### 01 · Authentication

```
Signup → Validate with Zod → Hash password (bcrypt) → Create user → Generate JWT → Set httpOnly cookie → Redirect
Signin → Validate with Zod → Verify password (bcrypt) → Check status/role → Generate JWT → Set httpOnly cookie → Redirect
Signout → Delete cookie → Redirect
```

- **Users can**: Sign up with name, email, password; sign in with email, password; sign out
- **Admins can**: Same as users, plus access admin routes
- **Security**: JWT tokens with 30-day expiration, httpOnly cookies, bcrypt password hashing

### 02 · Customer Flow

```
Browse Products → Add to Cart → View Cart → Checkout → Upload Payment Slip → Order Created (Pending) → Admin Confirms → Order Shipped → Order Delivered
```

- **Customers can**: Browse products, search/filter products, add to cart, update quantities, remove items, checkout with address/phone, upload payment slip, view order history, cancel pending orders
- **Order Status Flow**: Pending → Paid → Shipped → Delivered (or Cancelled)
- **Payment**: PromptPay QR code generation for payment

### 03 · Admin Flow

```
Dashboard → Manage Products → Manage Categories → Manage Orders → Manage Users
```

- **Admins can**: View dashboard stats (revenue, orders, users, growth rates), create/edit/delete products, manage categories, view all orders, update order status, add tracking numbers, manage users (ban/unban, change role)
- **Product Management**: Create products with multiple images, set main image, edit price/stock/description, activate/deactivate products
- **Order Management**: View orders by status, update status to Paid/Shipped/Delivered/Cancelled, add tracking numbers

### 04 · Cart Management

```
Add to Cart → Check stock → Update/Create CartItem → Recalculate cartTotal → Revalidate cache
Update Quantity → Check stock → Update CartItem → Recalculate cartTotal → Revalidate cache
Remove Item → Delete CartItem → Recalculate cartTotal → Revalidate cache
Clear Cart → Delete all CartItems → Reset cartTotal → Revalidate cache
```

- **Stock Validation**: All cart operations check product stock before allowing changes
- **Optimistic UI**: Cart updates use optimistic UI with useOptimistic hook
- **Cache Revalidation**: Cart cache is revalidated on any mutation

## Caching Strategy

| Tag pattern            | Scope                | Revalidated on                               |
| ---------------------- | -------------------- | -------------------------------------------- |
| `global:products`      | All product queries  | Product create/update/delete, status change  |
| `id:{id}-products`     | Single product       | Product update, status change                |
| `global:categories`    | All category queries | Category create/update/delete, status change |
| `id:{id}-categories`   | Single category      | Category update, status change               |
| `global:orders`        | All order queries    | Order create/update, status change           |
| `id:{id}-orders`       | Single order         | Order update, status change                  |
| `user:{userId}:orders` | User's orders        | Order create/update, status change           |
| `cart:{userId}`        | User's cart          | Cart add/update/remove/clear                 |
| `global:users`         | All user queries     | User update, status/role change              |
| `id:{id}-users`        | Single user          | User update, status/role change              |

- **Cache Duration**: `cacheLife("hours")` for most queries
- **Revalidation**: `revalidateTag(tag, "max")` on mutations
- **Cache Helper**: `getGlobalTag()` and `getIdTag()` helpers in `lib/dataCache.ts`

## 🔐 Security

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Authentication**: jose library for JWT token generation and verification
- **Token Storage**: httpOnly cookies with secure flag in production, sameSite: "strict", 30-day expiration
- **Middleware**: Custom middleware (`proxy.ts`) verifies JWT on protected routes and sets `x-user-id` header
- **Role-Based Access Control (RBAC)**: Permission checks in each feature's permissions files
- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Status Checks**: User status (Active/Banned) checked before allowing actions
- **Ownership Checks**: Order/cart operations verify user ownership before allowing changes
- **Error Handling**: Custom error classes (AppError, ValidationError, NotFoundError, InsufficientStockError, ForbiddenError)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- ImageKit account (for image storage)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
# Create .env file in root directory

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT Secret
JWT_SECRET_KEY="your-secret-key-min-32-chars"

# ImageKit
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"

# PromptPay (optional)
NEXT_PUBLIC_PROMPTPAY_ID="your-promptpay-id"
```

### Run Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 👤 Author

**Patsarun Kathinthong**  
Full Stack Developer · Next.js / PERN Stack  
📧 patsarun2545@gmail.com  
🔗 github.com/patsarun2545
