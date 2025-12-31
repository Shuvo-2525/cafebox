# Cafebox

**Cafebox** is a comprehensive, real-time Order Management System (OMS) designed specifically for cafes and restaurants using **WooCommerce**. It creates a seamless, high-performance link between your online WooCommerce store and your physical kitchen operations.

## 🚀 Key Features

### Core Capabilities
*   **Fully Compatible with WooCommerce**: Plug-and-play integration with any WooCommerce store via REST API.
*   **Real-time Order Sync**: Orders appear instantly on the dashboard as soon as they are placed (powered by Active Polling + Webhooks).
*   **Status Management**: Filter orders by status (Pending, Processing, Completed) and update them with one click.
*   **Audio & Visual Alerts**: Staff are notified immediately of new orders with a custom sound and popup banner.

### 🍳 Kitchen Display System (KDS)
*   **Dedicated Kitchen View**: A high-contrast, easy-to-read screen designed for kitchen environments (`/dashboard/kitchen`).
*   **Timer Tracking**: Shows exactly how long an order has been waiting.
*   **One-tap Workflow**: Cooks can mark orders as "Cooking" or "Ready" directly from their station.

### 📋 Quick Menu Manager
*   **Instant '86'**: Quickly mark items as "Out of Stock" directly from the dashboard (`/dashboard/menu`) without accessing the slow WordPress backend.
*   **Live Search**: Instantly find menu items to update their availability.

### 📊 Reports & Analytics
*   **End-of-Day Reports**: Generate daily financial summaries including total sales and order counts (`/dashboard/reports`).
*   **PDF Export**: Download professional daily reports with a single click for accounting and record-keeping.

## 🛠️ Technology Stack
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Backend**: WooCommerce REST API
*   **Real-time DB**: Firebase Firestore
*   **UI Library**: [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS
*   **State Management**: TanStack Query (React Query)
*   **PDF Generation**: jspdf + jspdf-autotable

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shuvo-2525/cafebox.git
    cd cafebox
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file and add:
    ```env
    NEXT_PUBLIC_WOOCOMMERCE_URL=https://your-site.com
    WOOCOMMERCE_CONSUMER_KEY=ck_...
    WOOCOMMERCE_CONSUMER_SECRET=cs_...
    WOOCOMMERCE_WEBHOOK_SECRET=your_secret
    
    # Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    # (Add other Firebase config keys)
    ```

4.  **Add Notification Sound**
    Place your custom alert sound at:
    `public/sounds/notification.mp3`

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 👨‍💻 Creator

**Mohammad Rafiq Shuvo**  
[github.com/shuvo-2525](https://github.com/shuvo-2525)

---
*Built with ❤️ for efficient restaurant operations.*
