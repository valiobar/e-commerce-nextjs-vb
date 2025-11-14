# E-Commerce Store

A modern e-commerce web application built with Next.js, TypeScript, Tailwind CSS, and DaisyUI. This application fetches product data from the DummyJSON API and provides a complete shopping experience with cart functionality.

## Features

- 🏠 **Home Page**: Browse a grid of products with images, titles, prices, and ratings
- 📦 **Product Details**: View detailed information about each product including images, description, and specifications
- 🛒 **Shopping Cart**: Add/remove products, update quantities, and view totals
- 💾 **Persistent Cart**: Cart state persists across page refreshes using localStorage
- 🎨 **Modern UI**: Beautiful, responsive design using Tailwind CSS and DaisyUI
- ⚡ **Fast Performance**: Built with Next.js 16 for optimal performance

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + DaisyUI
- **State Management**: Zustand with persistence
- **API**: DummyJSON API

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

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

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
e-commerce-nextjs/
├── app/
│   ├── cart/              # Cart page
│   ├── products/[id]/     # Product details page (dynamic route)
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page with product list
│   └── globals.css        # Global styles
├── components/
│   ├── Navigation.tsx     # Header navigation with cart icon
│   ├── ProductCard.tsx    # Product card component
│   └── ProductDetails.tsx # Product details component
├── store/
│   └── cartStore.ts       # Zustand store for cart state
├── types/
│   └── product.ts         # TypeScript types for products
└── tailwind.config.ts     # Tailwind CSS configuration
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
- **DummyJSON API**: Chose DummyJSON for its simplicity and comprehensive product data
- **Error Handling**: Implemented proper error handling with `notFound()` for invalid product IDs
- **Caching**: Used `cache: "no-store"` to ensure fresh data on each request

### UI/UX Decisions
- **DaisyUI**: Used for pre-built, accessible components to speed up development
- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Image Gallery**: Implemented image carousel on product details page
- **Cart Badge**: Real-time cart item count in navigation for better UX

## Trade-offs

1. **No Backend**: This is a frontend-only application. Cart persistence is client-side only (localStorage)
2. **No Authentication**: No user accounts or authentication system
3. **No Payment Processing**: Checkout button is present but doesn't process payments
4. **API Limitations**: Relies on external DummyJSON API (rate limits may apply)
5. **No Search/Filter**: Product list shows all products without filtering or search functionality

## Known Limitations

- Cart data is stored only in browser localStorage (clears if user clears browser data)
- No user authentication or user-specific carts
- No product search or filtering capabilities
- No pagination for product list (shows all products at once)
- Checkout functionality is not implemented (UI only)
- No error boundaries for API failures
- Images are loaded from external URLs (DummyJSON CDN)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

The app will be live at `https://your-project.vercel.app`

### Environment Variables

No environment variables are required for this project as it uses the public DummyJSON API.

## Future Enhancements

- [ ] Add product search and filtering
- [ ] Implement pagination for product list
- [ ] Add user authentication
- [ ] Integrate payment processing
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add product categories navigation
- [ ] Improve error handling and loading states
- [ ] Add unit and integration tests

## License

MIT
