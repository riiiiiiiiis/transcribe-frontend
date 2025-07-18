# Deployment Guide

## Pre-deployment Checklist

- [x] Build passes successfully (`npm run build`)
- [x] All tests pass (`npm run test:run`)
- [x] Environment variables are properly configured
- [x] .gitignore updated to exclude sensitive files
- [x] Deployment configurations created

## Environment Variables Required

The following environment variables need to be set in your deployment platform:

```
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Options

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Build
```bash
npm install
npm run build
# Upload dist/ folder to your hosting provider
```

## Post-deployment

1. Verify the application loads correctly
2. Test authentication functionality
3. Ensure API connections work properly
4. Check that all routes are accessible

## Notes

- The application uses Vite for building
- All routes are handled by React Router (SPA)
- Environment variables must be prefixed with `VITE_` to be accessible in the browser
- The build output is in the `dist/` directory