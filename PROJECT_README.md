# GiftShop Admin Panel

This is the **Admin Panel** for GiftShop - a separate React project dedicated to managing products, inventory, orders, customers, categories, reports, and website content.

## Project Structure

```
admin-panel/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/          # Admin-specific components
│   │   │   └── ui/             # Shared UI components (Radix UI)
│   │   ├── context/            # App context for state management
│   │   ├── services/           # Firebase, Auth, Firestore services
│   │   ├── types/              # TypeScript type definitions
│   │   ├── data/               # Mock data
│   │   └── App.tsx             # Admin app component
│   ├── styles/                 # Global styles
│   └── main.tsx                # Entry point
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

## Features

- 📊 **Dashboard** - Overview of key metrics
- 📦 **Products** - Create, edit, delete products
- 🏷️ **Categories** - Manage product categories
- 📉 **Inventory** - Track stock levels
- 📋 **Orders** - Manage customer orders
- 👥 **Customers** - View and manage customers
- 📈 **Reports** - Analytics and insights
- 🗂️ **Content** - Manage website content
- ⚙️ **Settings** - Admin panel settings

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firebase credentials (.env file)

### Installation Steps

1. **Clone and navigate to admin panel**

   ```bash
   cd admin-panel
   npm install
   ```

2. **Create .env file**
   Copy `.env.example` to `.env` and add your Firebase credentials:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Firebase** - Backend services
- **Recharts** - Data visualization

## Firebase Integration

This project uses Firebase for:

- Authentication (Admin login)
- Firestore (Database)
- Cloud Storage (Image uploads)

Make sure your Firebase project has the necessary security rules configured for admin operations.

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Build and Deploy Manually

```bash
npm run build
# Upload the 'dist' folder to your hosting service
```

## Important Notes

- **This is a separate project** from the frontend. Admin panel and customer website run independently.
- **Shared Services**: Both projects share Firebase configuration and services.
- **Admin Authentication**: Only users with admin role can access the panel.
- **Environment Variables**: Make sure `.env` file is properly configured.

## Troubleshooting

### Admin login not working

- Check if Firebase credentials are correct in `.env`
- Verify the user has admin role in Firestore

### Components not found

- Run `npm install` to ensure all dependencies are installed
- Check import paths in components

### Build errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: Review tsconfig.json

## Support

For issues or questions, please refer to the main project documentation or Firebase documentation.

## License

MIT
