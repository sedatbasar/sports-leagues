# Sports Leagues Browser

A modern React application for browsing sports leagues using TheSportsDB API, built with React Router v7 and shadcn/ui.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🏈 Browse sports leagues from around the world
- 🔍 Search leagues by name
- 🎯 Filter leagues by sport type
- 🏆 View season badges in an interactive modal
- ⚡️ Fast API response caching
- 📱 Fully responsive design
- 🎨 Modern UI with shadcn/ui components
- 🔒 TypeScript for type safety
- 🧪 Comprehensive test coverage
- 🚀 Automated deployment to GitHub Pages

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Testing

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Code Quality

Run linting:

```bash
npm run lint
```

Run type checking:

```bash
npm run typecheck
```

Format code with Prettier:

```bash
npm run prettier:fix
```

Run all checks:

```bash
npm run check
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### GitHub Pages (Recommended)

This application is configured for automatic deployment to GitHub Pages. Every push to the `main` branch will trigger a deployment.

**Setup Steps:**

1. Push your code to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the sidebar
4. Under "Source", select "GitHub Actions"
5. The deployment will happen automatically on the next push to main

The app will be available at: `https://yourusername.github.io/sports-leagues/`

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
