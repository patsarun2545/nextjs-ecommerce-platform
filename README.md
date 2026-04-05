# 🛒 Next-Nest E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-000?style=flat-square&logo=vercel&logoColor=white)](https://nextjs-ecommerce-platform-gamma.vercel.app/)

A full-stack e-commerce web application built with the **Next.js App Router**, combining both frontend and backend in a single codebase. Features a complete **customer storefront** and **admin back-office system** built with modern best practices.

---

## 🛠️ Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js (App Router)                                |
| Frontend   | React 19, Tailwind CSS, shadcn/ui, Radix UI         |
| Backend    | Next.js Server Actions                              |
| Runtime    | Node.js 20+                                         |
| Database   | PostgreSQL + Prisma ORM                             |
| Auth       | JWT (`jose`), `bcrypt`, HTTP-only cookies           |
| Storage    | ImageKit (image CDN + upload), `sharp` (processing) |
| Validation | Zod                                                 |
| Caching    | Next.js `"use cache"` + `cacheTag` / `cacheLife`   |
| UI Extras  | Sonner (toasts), Day.js, PromptPay QR               |
| Tools      | TypeScript, ESLint                                  |

---

## ✨ Features Overview

- Role-based access control — `Customer` and `Admin`
- Full product catalog with category filtering, search, and sort
- Multi-image upload with main image selection (ImageKit + Sharp)
- Shopping cart with optimistic UI updates
- Checkout with delivery info and optional profile auto-fill
- Payment via PromptPay QR Code generation
- Payment slip upload (ImageKit)
- Order lifecycle tracking with status history
- Admin dashboard with revenue stats, growth indicators, and stale-order alerts
- Product & category **soft delete / restore**
- Admin user management with role and status control
- Server-side caching with tag-based revalidation
- Toast notifications with Sonner
- Responsive design (mobile + desktop)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/                  # Public customer-facing pages
│   │   └── page.tsx             # Home / featured products
│   ├── (protected)/             # Auth-required customer pages
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── my-orders/[id]/
│   │   ├── products/[id]/
│   │   └── profile/
│   │       └── layout.tsx
│   ├── admin/                   # Admin back-office
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── orders/[id]/
│   │   ├── products/
│   │   │   ├── new/
│   │   │   └── edit/[id]/
│   │   └── users/[id]/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── shared/                  # error-message, input-form, modal, submit-btn
│   └── ui/                      # shadcn/ui primitives
├── features/
│   ├── auths/
│   │   ├── actions/             # authAction, signoutAction
│   │   ├── components/          # auth-form, auth-header, auth-footer
│   │   ├── db/                  # signup, signin, signout, authCheck
│   │   └── schemas/             # signupSchema, signinSchema
│   ├── carts/
│   │   ├── actions/             # addToCart, updateCartItem, removeFromCart, clearCart
│   │   ├── components/          # add-to-cart-button, cart-items, cart-summary, empty-cart
│   │   ├── db/                  # getUserCart, getCartItemCount, cart mutations
│   │   └── permissions/
│   ├── categories/
│   │   ├── actions/             # categoryAction, deleteCategoryAction, restoreCategoryAction
│   │   ├── components/          # category-form, category-list, modals
│   │   ├── db/                  # getCategories, createCategory, updateCategory, changeCategoryStatus
│   │   ├── permissions/
│   │   └── schemas/
│   ├── dashboard/
│   │   ├── components/          # dashboard-all (DashboardClient)
│   │   └── db/                  # getDashboardStats
│   ├── orders/
│   │   ├── actions/             # checkoutAction, updatePaymentAction, cancelOrderStatusAction, updateOrderStatusAction
│   │   ├── components/          # admin-order-detail, admin-order-list, cancel-order-modal, payment-form-modal
│   │   ├── db/                  # createOrder, getAllOrders, getOrderById, uploadPaymentSlip, cancelOrderStatus, updateOrderStatus, getMyOrders
│   │   ├── permissions/
│   │   └── schemas/             # checkoutSchema
│   ├── products/
│   │   ├── actions/             # productAction, deleteProductAction, restoreProductAction
│   │   ├── components/          # product-form, product-image-upload, product-list, product-detail-modal, modals
│   │   ├── db/                  # getProducts, getProductById, getFeatureProducts, getProductsFiltered, createProduct, updateProduct, changeProductStatus
│   │   ├── permissions/
│   │   └── schemas/             # productSchema
│   └── users/
│       ├── actions/             # adminUpdateUserAction, adminResetPasswordAction, userUpdateProfileAction, userUpdateEmailAction, userChangePasswordAction
│       ├── components/          # user-edit-form, user-list, user-order-detail, profile-edit-form
│       ├── db/                  # getUserById, getAllUsers, getUserWithOrders
│       └── schemas/             # adminUpdateUserSchema, userUpdateProfileSchema, userChangePasswordSchema, etc.
├── hooks/
│   ├── use-form.ts              # useForm — wraps useActionState + toast + router.refresh
│   └── use-sign-out.ts          # useSignout — handles signout transition
├── lib/
│   ├── dataCache.ts             # getGlobalTag, getIdTag helpers
│   ├── dayjs.ts                 # Day.js with relativeTime + localizedFormat
│   ├── db.ts                    # Prisma singleton
│   ├── formatDate.ts            # DD/MM/YYYY HH:mm formatter
│   ├── formatPrice.ts           # Thai Baht (THB) formatter
│   ├── generateOrderNumber.ts   # ORD + timestamp + random suffix
│   ├── generatePromptPayQR.ts   # PromptPay QR URL generator
│   ├── imageKit.ts              # uploadToImageKit, deleteFromImageKit
│   └── utils.ts                 # cn, getStatusText, getStatusColor
├── providers/
│   └── SidebarProvider.tsx      # Sidebar open/close context
├── types/
│   ├── action.ts                # InitialFormState, ActionType
│   ├── cart.d.ts
│   ├── category.d.ts
│   ├── order.d.ts
│   ├── product.d.ts
│   └── user.d.ts
└── middleware.ts                 # JWT proxy — injects x-user-id header
```

---

## 🗃️ Database Schema

| Model            | Description                                              |
| ---------------- | -------------------------------------------------------- |
| **User**         | Customers and admins — role (`Customer`/`Admin`), status (`Active`/`Banned`) |
| **Category**     | Product categories — soft delete via status (`Active`/`Inactive`) |
| **Product**      | Product info — price, basePrice, cost, stock, sold, status |
| **ProductImage** | Images stored in ImageKit — supports `isMain` flag       |
| **Cart**         | User shopping cart — `cartTotal`, linked to User         |
| **CartItem**     | Items inside cart — count, price snapshot                |
| **Order**        | Customer order — address, phone, note, shippingFee, trackingNumber, paymentImage |
| **OrderItem**    | Snapshot of purchased items — productTitle, productImage, price, quantity |

---

## 🔄 System Flow

### 01 · Authentication

```
POST /auth/signup  →  Register (bcrypt hash + JWT cookie)
POST /auth/signin  →  Sign in  (verify password + JWT cookie)
POST /auth/signout →  Delete cookie
```

- JWT signed with `jose`, stored as HTTP-only cookie (30 days)
- Middleware decodes token and injects `x-user-id` header for server use
- `authCheck()` reads header → fetches user from DB

---

### 02 · Customer Flow

```
Browse Products → Add to Cart → Checkout → Upload PromptPay Slip → Track Order
```

Customers can:
- Browse and filter products by category, price range, sort, and stock status
- Add/remove/update items in cart (optimistic UI with `useOptimistic`)
- Checkout with shipping address and phone (or auto-fill from profile)
- Generate PromptPay QR Code and upload payment slip
- Cancel pending orders (restores stock automatically)
- Edit profile, email, and password

---

### 03 · Order Status Flow

```
PENDING → PAID → SHIPPED → DELIVERED
    ↘ CANCELLED
```

| Status      | Trigger                                    |
| ----------- | ------------------------------------------ |
| `Pending`   | Order created                              |
| `Paid`      | Customer uploads payment slip              |
| `Shipped`   | Admin updates status + adds tracking number |
| `Delivered` | Admin marks as delivered                   |
| `Cancelled` | Customer cancels (Pending only) — stock restored |

---

### 04 · Admin Back-Office

#### Product Management
```
Create → Upload Images (ImageKit + Sharp) → Select Category → Set Cost/Price/Stock → Publish
```
- Multi-image upload with drag-select main image
- Soft delete / restore (status toggle)
- View product detail modal with sales statistics

#### Category Management
- Create, edit, soft delete, restore
- Tabs: All / Active / Inactive with search

#### Order Management
- View all orders with tab/search filter
- Update status and add tracking number
- View payment slip image

#### User Management
- List all users with search
- View per-user order history with stats (total spent, cancelled count)
- Edit user info, role, status
- Admin reset password

---

### 05 · Caching Strategy

All read queries use Next.js `"use cache"` with tag-based revalidation:

| Tag pattern          | Scope                  | Revalidated on              |
| -------------------- | ---------------------- | --------------------------- |
| `global:products`    | All products           | Any product create/update   |
| `id:<id>-products`   | Single product         | That product's update       |
| `global:orders`      | All orders             | Any order mutation          |
| `id:<id>-orders`     | Single order           | That order's update         |
| `user:<id>:orders`   | User's orders          | That user's order change    |
| `global:users`       | All users              | Any user update             |
| `id:<id>-users`      | Single user            | That user's update          |
| `global:categories`  | All categories         | Any category change         |
| `cart:<userId>`      | User's cart            | Any cart mutation           |

---

## 🔐 Security

- JWT authentication with HTTP-only cookies (no localStorage)
- Password hashing with `bcrypt` (salt rounds: 10)
- Input validation with Zod on all server actions
- RBAC: Admin-only routes checked via `authCheck()` + permission helpers
- Email domain whitelist (gmail, hotmail, outlook, yahoo)
- Password policy: min 8 chars, uppercase, lowercase, number, special char
- Image upload size limit: 5MB; processed to WebP via `sharp`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- ImageKit account

### Installation

```bash
# Clone repository
git clone https://github.com/<your-username>/next-nest.git
cd next-nest

# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma generate
```

### Environment Variables

Create `.env` in project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

NEXT_PUBLIC_PROMPTPAY_ID=your_promptpay_id

JWT_SECRET_KEY=your_jwt_secret
```

### Run

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

---

## 👤 Author

**Patsarun Kathinthong**  
Full Stack Developer · Next.js / PERN Stack  
📧 patsarun2545@gmail.com  
🔗 github.com/patsarun2545

