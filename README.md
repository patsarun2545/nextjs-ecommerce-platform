# 🛒 Next.js E-Commerce Platform

A full-stack e-commerce web application built with the **Next.js App Router**, combining both frontend and backend in a single application. This project features a complete **customer storefront** and **admin back-office system** with modern best practices.

---

## 🛠️ Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Next.js 16 (App Router)                        |
| Frontend   | React 19, Tailwind CSS v4, shadcn/ui, Radix UI |
| Backend    | Next.js (Server Actions, Route Handlers)       |
| Runtime    | Node.js                                        |
| Database   | PostgreSQL, Prisma ORM                         |
| Auth       | JWT (jose), bcrypt                             |
| Storage    | ImageKit                                       |
| Email      | Resend                                         |
| Validation | Zod                                            |
| Tools      | TypeScript, ESLint                             |

---

## ✨ Features Overview

* Role-based access control — `CUSTOMER` and `ADMIN`
* Full product catalog with category filtering and image upload
* Shopping cart with real-time total calculation
* Order lifecycle management with payment slip upload
* QR Code PromptPay payment generation
* Admin back-office with dashboard, reports, and user management
* Product & category **soft delete / restore**
* Image CDN management via ImageKit
* Server-side rendering (SSR) with caching & revalidation
* Data visualization with Recharts
* Date handling with Day.js
* Toast notifications with Sonner

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── (main)/          # Customer-facing pages
│   │   └── page.tsx
│   ├── (protected)/     # Auth-required pages
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── my-orders/[id]/
│   │   ├── products/[id]/
│   │   └── profile/
│   ├── admin/           # Admin back-office
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── orders/[id]/
│   │   ├── products/
│   │   │   ├── new/
│   │   │   └── edit/[id]/
│   │   └── users/[id]/
│   └── auth/
│       ├── signin/
│       └── signup/
├── components/
│   ├── admin-page/
│   ├── customer-page/
│   └── ui/
├── features/
│   ├── auths/
│   ├── carts/
│   ├── categories/
│   ├── dashboard/
│   ├── orders/
│   ├── products/
│   └── users/
├── hooks/
├── lib/
├── providers/
└── types/
```

---

## 🔄 System Flow

### 01 · Authentication

Users can register and sign in. Default role is `CUSTOMER`.
Admin access is protected via RBAC.

```bash
POST /auth/signup   → Register account
POST /auth/signin   → Sign in (JWT via HTTP-only cookies)
```

---

### 02 · Customer Flow

```bash
Browse Products → Add to Cart → Checkout → Upload Payment → Track Order
```

Customers can:

* Browse products by category
* Search & filter items
* Add/remove items from cart
* Checkout and upload payment slip (PromptPay)
* Track order status
* Manage profile

---

### 03 · Order Status Flow

```bash
PENDING → PAID → SHIPPED → DELIVERED
                         ↘ CANCELLED
```

| Status      | Description                       |
| ----------- | --------------------------------- |
| `PENDING`   | Order placed, waiting for payment |
| `PAID`      | Payment verified                  |
| `SHIPPED`   | Order dispatched                  |
| `DELIVERED` | Customer received order           |
| `CANCELLED` | Order cancelled                   |

---

### 04 · Admin Back-Office

#### Product Management

```bash
Create → Upload Images → Set Category → Set Price/Stock → Publish
```

* Add / edit / delete products
* Upload multiple images (ImageKit)
* Soft delete / restore
* Manage categories

#### Order Management

* View all orders
* Filter by status
* Update order status
* Add tracking number
* View payment slips

---

### 05 · Admin Tools

| Module         | Description                     |
| -------------- | ------------------------------- |
| **Dashboard**  | Sales overview, revenue stats   |
| **Products**   | Full CRUD with image upload     |
| **Categories** | Manage categories (soft delete) |
| **Orders**     | Manage all orders & status      |
| **Users**      | Manage customers & view history |

---

## 🗃️ Database Schema Overview

| Model            | Description                 |
| ---------------- | --------------------------- |
| **User**         | Customers and admins        |
| **Category**     | Product categories          |
| **Product**      | Product info (price, stock) |
| **ProductImage** | Images via ImageKit         |
| **Cart**         | User shopping cart          |
| **CartItem**     | Items inside cart           |
| **Order**        | Customer order              |
| **OrderItem**    | Snapshot of purchased items |

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL
* ImageKit account
* npm or yarn

---

### Installation

```bash
# Clone repository
git clone https://github.com/<your-username>/next-nest-2.git
cd next-nest-2

# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma generate
```

---

### Environment Variables

Create `.env` in root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
```

---

### Run

```bash
# Development
npm run dev

# Lint
npm run lint

# Build
npm run build

# Production
npm start
```

---

## 🔐 Security

* JWT authentication with HTTP-only cookies
* Password hashing with bcrypt
* Input validation using Zod
* Role-based access control (RBAC)

---

## 👤 Author

**Patsarun Kathinthong**  
Full Stack Developer · Next.js / PERN Stack  
📧 patsarun2545@gmail.com  
🔗 github.com/patsarun2545

