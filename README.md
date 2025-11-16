# E-Commerce Store

A modern e-commerce web application built with Next.js, TypeScript, Tailwind CSS, and DaisyUI. This application fetches product data from the DummyJSON API and provides a complete shopping experience with cart functionality, order management, and a comprehensive admin panel.

## Features

### Store Features

- 🏠 **Home Page**: Browse a grid of products with images, titles, prices, and ratings
- 📦 **Product Details**: View detailed information about each product including images, description, and specifications
- 🗂️ **Product Categories**: Browse products by category with a slide-in categories drawer
- 📂 **Category Pages**: Dedicated pages for each category with filtering and sorting
- 🔍 **Product Sorting**: Sort products by title, price, discount, or rating in ascending/descending order
- 🛒 **Shopping Cart**: Add/remove products, update quantities, and view totals
- 📱 **Mobile Cart Sidebar**: Responsive cart sidebar that's fully visible on mobile devices
- 💾 **Persistent Cart**: Cart state persists across page refreshes using localStorage
- 📄 **Pagination**: Navigate through products with customizable items per page
- 📖 **About Page**: Information about the store and company
- 🎨 **Modern UI**: Beautiful, responsive design using Tailwind CSS and DaisyUI
- ⚡ **Fast Performance**: Built with Next.js 16 for optimal performance with ISR (Incremental Static Regeneration)

### Admin Panel Features

- 🔐 **Admin Authentication**: Secure login system for admin users
- 📊 **Dashboard**: Overview of orders, revenue, users, and recent activity
- 📦 **Order Management**: View and manage customer orders
- 👥 **User Management**: Manage user accounts
- 🎨 **Dark Theme Toggle**: Switch between light and dark themes with persistent preference
- 🔒 **Protected Routes**: Admin routes are protected with authentication middleware

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + DaisyUI
- **State Management**: Zustand with persistence
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **API**: DummyJSON API (for products)
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- MongoDB database (local or cloud instance like MongoDB Atlas)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd e-commerce-nextjs
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Panel Access

To access the admin panel, navigate to `/admin/login` and use the following credentials:

- **Username**: `admin`
- **Password**: `admin`

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
e-commerce-nextjs/
├── app/
│   ├── (admin)/           # Admin route group
│   │   └── admin/         # Admin panel pages
│   │       ├── login/     # Admin login page
│   │       ├── layout.tsx # Admin layout with sidebar
│   │       ├── error.tsx  # Admin error boundary
│   │       └── page.tsx   # Admin dashboard
│   ├── (store)/           # Store route group
│   │   ├── about/         # About page
│   │   ├── cart/          # Cart page
│   │   ├── category/      # Category pages
│   │   │   └── [slug]/    # Dynamic category route
│   │   ├── checkout/      # Checkout pages
│   │   ├── products/      # Product pages
│   │   ├── layout.tsx     # Store layout
│   │   ├── error.tsx      # Store error boundary
│   │   └── page.tsx       # Home page
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── orders/        # Order endpoints
│   ├── layout.tsx         # Root layout
│   ├── error.tsx          # Root error boundary
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── components/
│   ├── __tests__/         # Component tests
│   ├── buttons/           # Button components
│   │   └── CategoriesButton.tsx # Categories button
│   ├── icons/             # Icon components
│   ├── forms/             # Form components
│   ├── Navigation.tsx     # Header navigation
│   ├── CategoriesDrawer.tsx # Categories drawer component
│   ├── ProductCard.tsx    # Product card component
│   ├── ProductDetails.tsx # Product details component
│   ├── ProductFilters.tsx # Product sorting/filtering
│   ├── ProductImages.tsx  # Product image gallery
│   ├── CartSidebar.tsx    # Cart sidebar component
│   ├── Pagination.tsx     # Pagination component
│   └── ...                # Other components
├── services/              # Business logic services
│   ├── __tests__/         # Service tests
│   ├── authService.ts     # Authentication service
│   ├── adminService.ts    # Admin service
│   ├── productsService.ts # Products API service
│   ├── categoryService.ts # Categories API service
│   ├── ordersService.ts   # Orders API service
│   └── ...                # Other services
├── store/
│   ├── cartStore.ts       # Cart state management
│   ├── categoriesStore.ts # Categories drawer state
│   └── adminAuthStore.ts  # Admin auth state
├── models/                # Database models
│   ├── User.ts            # User model
│   └── Order.ts           # Order model
├── lib/                   # Utility libraries
│   ├── db/                # Database connection
│   ├── jwt.ts             # JWT utilities
│   └── password.ts        # Password hashing
├── types/                 # TypeScript types
│   ├── product.ts         # Product types
│   └── sorting.ts         # Sorting types
├── constants/             # Application constants
│   └── api.ts            # API configuration
└── middleware.ts          # Next.js middleware
```

## Thought Process & Design Decisions

### State Management with Zustand

- **Why Zustand?**: Lightweight, simple API, and excellent TypeScript support
- **Persistence**: Used Zustand's `persist` middleware to save cart state to localStorage
- **Benefits**: Minimal boilerplate, easy to use, and performant

### Component Architecture

- **Server Components**: Used Next.js server components for data fetching (Home page, Product details)
- **Client Components**: Used client components only where needed (cart interactions, navigation state)
- **Separation of Concerns**: Clear separation between data fetching, state management, and UI components

### API Integration

- **DummyJSON API**: Used DummyJSON API as specified in the project requirements
- **Error Handling**: Comprehensive error handling with try-catch blocks, error boundaries, and user-friendly error messages
- **Caching**: Used `cache: "no-store"` to ensure fresh data on each request
- **ISR**: Implemented Incremental Static Regeneration (ISR) with revalidation for optimal performance

### UI/UX Decisions

- **DaisyUI**: Used for pre-built, accessible components to speed up development
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Image Gallery**: Implemented image carousel on product details page
- **Cart Badge**: Real-time cart item count in navigation for better UX
- **Cart Sidebar**: Slide-in cart sidebar with full mobile responsiveness
- **Categories Drawer**: Slide-in categories drawer accessible from navigation with keyboard support (Escape to close)
- **Category Navigation**: Browse products by category with dedicated category pages
- **Dark Theme**: Admin panel supports dark/light theme toggle with persistent preference
- **Pagination**: Customizable items per page with intuitive navigation controls
- **Error Boundaries**: React error boundaries at app, store, and admin levels for graceful error handling

## Trade-offs

1. **External Product API**: Relies on external DummyJSON API for product data (rate limits may apply)
2. **No Payment Processing**: Checkout button is present but doesn't process payments
3. **No Search Functionality**: Product list shows all products without search capability (sorting is available)
4. **Client-Side Cart**: Store cart persistence is client-side only (localStorage)
5. **Category Filtering Only**: Products can be filtered by category, but not by other attributes (e.g., price range, brand)

## Known Limitations

- Store cart data is stored only in browser localStorage (clears if user clears browser data)
- No product search functionality (sorting by title, price, discount, and rating is available)
- Limited product filtering (only by category, not by price range, brand, or other attributes)
- Checkout functionality is not implemented (UI only, orders are saved to database)
- Images are loaded from external URLs (DummyJSON CDN)
- Admin authentication is separate from customer accounts
- Error boundaries catch errors but don't send them to an error tracking service

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

The app will be live at `https://your-project.vercel.app`

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT secret for authentication (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## Testing

The project includes comprehensive testing setup with Jest and React Testing Library.

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

- **Component Tests**: Located in `components/__tests__/`
- **Service Tests**: Located in `services/__tests__/`
- Tests follow best practices with proper mocking and isolation

## Future Enhancements

- [ ] Add product search functionality
- [ ] Add advanced product filtering (price range, brand, rating, etc.)
- [ ] Integrate payment processing (Stripe, PayPal, etc.)
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Customer account system with order history
- [ ] Email notifications for orders
- [ ] Product inventory management
- [ ] Analytics and reporting dashboard
- [ ] Multi-language support
- [ ] Error tracking service integration (Sentry, LogRocket, etc.)
- [ ] Server-side cart persistence for logged-in users
- [ ] Category breadcrumbs and navigation improvements

## License

MIT
