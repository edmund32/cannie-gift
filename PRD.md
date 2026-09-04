# Cannie Gift — Product Requirements Document (PRD)

## 1. Project Overview

**Cannie Gift** is a web application for an UMKM that sells artificial and live flower bouquets.

The application is intended to provide:
- A product catalog
- Product detail pages
- Shopping cart
- Checkout/order flow
- Custom bouquet ordering
- Customer-friendly browsing and ordering
- A foundation for future admin/CMS functionality

The current implementation is focused on the customer-facing application. Features that have only been discussed but not implemented must not be treated as completed.

---

## 2. Goals

### Primary Goals
1. Make it easy for customers to browse available bouquets.
2. Allow customers to add products to a cart.
3. Allow customers to configure a custom bouquet.
4. Provide a clear checkout/order process.
5. Use Supabase as the application database.
6. Keep the codebase maintainable and easy for multiple AI coding agents to continue.

### Non-Goals for the Current Phase
- Full inventory/stock tracking.
- A complex enterprise-grade CMS.
- Advanced customer account functionality unless later required.
- Overengineering payment infrastructure before the basic ordering flow is stable.

---

## 3. Target Users

### Customers
Customers who want to:
- Browse flower products
- View product information
- Purchase ready-made bouquets
- Create a custom bouquet
- Select delivery/pickup arrangements
- Complete an order

### Admin / Owner
Future functionality may allow the owner to:
- Manage products
- Manage categories
- Manage bouquet customization options
- View/manage orders

Admin/CMS requirements remain subject to future implementation decisions.

---

## 4. Core Features

### 4.1 Product Catalog
Customers should be able to:
- View available products
- Browse products by category
- See product image
- See product name
- See product price
- Open product details

Products can be marked active/inactive.

### 4.2 Product Detail
A product detail page should provide enough information for a customer to understand the product before adding it to the cart.

Expected information includes:
- Product name
- Description
- Price
- Image
- Category
- Add-to-cart action

### 4.3 Shopping Cart
Customers should be able to:
- Add products
- Increase/decrease quantity
- Remove products
- View subtotal/total
- Continue to checkout

The project has used Redux Toolkit for cart state in the broader frontend architecture.

### 4.4 Custom Bouquet
Customers should be able to configure a bouquet using available options.

Planned customization includes:
- Bouquet size
- Flower selection/options
- Wrapper color
- Greeting card/message
- Add-ons
- Additional notes

The exact flower/add-on selection structure can evolve with the database design.

### 4.5 Checkout / Ordering
The planned checkout flow should collect the information needed to fulfill an order.

Shipping/delivery options discussed:
- Self-delivery
- COD / meetup

Payment flow discussed:
- Customer may pay immediately, or
- Customer may pay after receiving the product

The final payment implementation should be decided before production implementation.

### 4.6 Invoice
A future feature discussed is:
- Automatically generate an invoice PDF
- Send the invoice/order information through WhatsApp after payment

This is a planned feature, not automatically considered implemented.

---

## 5. Authentication

Customer accounts have been discussed but the final requirement is not fixed.

Do not implement a large authentication system unless explicitly requested.

If authentication is introduced, it should integrate cleanly with Supabase Auth.

---

## 6. Database

Supabase is the selected backend/database platform.

The project has discussed a relational schema containing entities such as:
- products
- categories
- custom_bouquets
- bouquet_sizes
- wrappers
- cart_items
- and related order/customization entities

Known product fields discussed include:
- id
- category_id
- name
- description
- price
- image_url
- is_active
- created_at
- updated_at

Known custom_bouquet fields discussed include:
- id
- bouquet_size_id
- wrapper_id
- greeting_message
- notes
- created_at
- updated_at

The exact final schema must always be verified against the current Supabase database/code before changing it.

---

## 7. Technical Stack

Current project direction:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Next.js App Router
- `src/` directory
- Supabase

Frontend/state technologies discussed or used:
- Redux Toolkit
- Zustand
- React Context
- react-hook-form
- Axios where API abstraction is needed

The agent must inspect the current `package.json` before assuming a dependency is installed.

---

## 8. Architecture Principles

1. Prefer the existing project architecture.
2. Reuse existing components when appropriate.
3. Avoid creating duplicate components with similar responsibilities.
4. Keep UI components separated from data-access logic where practical.
5. Keep TypeScript types explicit and maintainable.
6. Do not introduce a new library when existing project dependencies can solve the problem.
7. Do not change the database schema merely to make a local code problem disappear.
8. Verify assumptions against the actual source code and Supabase schema.

---

## 9. UX Direction

The website should feel:
- Simple
- Clean
- Friendly
- Suitable for a flower/bouquet business
- Easy to use on mobile and desktop

Visual decisions should support product presentation rather than overwhelm the customer.

---

## 10. Future Features

Potential future work:
- Admin/CMS
- Customer accounts
- Order management
- Payment integration
- Automatic invoice generation
- WhatsApp order/invoice notification
- More advanced custom bouquet configuration
- Improved product/category management

These are not automatically part of the current implementation unless explicitly moved into the active task list.

---

## 11. Definition of Done

A feature is considered complete only when:
1. The requested behavior is implemented.
2. Existing functionality is not unintentionally broken.
3. TypeScript/build/lint issues are resolved where applicable.
4. The implementation is consistent with the existing architecture.
5. `PROJECT_STATUS.md` is updated.
6. The agent reports what changed and what remains.

