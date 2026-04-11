# QUICKBITE

A full-stack food delivery web app built with the MERN stack.  
Three roles. One system. Everything in real time.

---

## The Problem

Local food businesses manage orders over WhatsApp and phone calls.
Orders get lost, delivery guys have no structure, and customers
have zero visibility after placing an order.

QuickBite solves this with a proper end-to-end system for customers,
admins, and delivery partners — all connected in real time.

---

## How It Works

### Customer
- Can place orders only if they are in the same city as the restaurant
- Chooses between online payment (Razorpay) or cash on delivery
- Can cancel the order — but only before the admin marks it as ready for delivery
- Tracks the delivery boy's live location on a map in real time

### Admin
- Registers and manages their own shop
- Adds and manages food items
- Views and manages incoming orders from their shop
- Updates order status step by step
- When marked as **Ready for Delivery**, all nearby delivery boys (within 20 km) can see available Order to deliver

### Delivery Boy
- Sees available orders within a 20 km radius
- Accepts an order and heads to the restaurant
- Delivers to the customer — verified with OTP at the door
- Tracks how much they have earned per delivery and overall
- Customer can track the delivery boy's location live on the map

---

## Tech Stack

- **Frontend** — React (Vite), Redux Toolkit, Tailwind CSS
- **Backend** — Node.js, Express.js
- **Database** — MongoDB
- **Real-time** — Socket.IO
- **Payments** — Razorpay
- **Maps** — Leaflet.js
- **Auth** — JWT, bcrypt, OTP via Brevo API
- **Media** — Cloudinary
- **Deployment** — Render (backend), Render (frontend)


## Getting Started

**Backend**
cd backend
npm install
npm start

**Frontend**
cd frontend
npm install
npm run dev
