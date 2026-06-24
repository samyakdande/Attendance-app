# Setup Script for CampusFlow

Write-Host "Initializing CampusFlow Frontend (Expo)..."
npx -y create-expo-app@latest frontend --template blank-typescript
cd frontend
npx -y expo install @supabase/supabase-js @react-native-async-storage/async-storage
npx -y expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
cd ..

Write-Host "Initializing CampusFlow Backend (NestJS)..."
npx -y @nestjs/cli@latest new backend --package-manager npm --strict --skip-git
cd backend
npm install @supabase/supabase-js ioredis class-validator class-transformer @nestjs/throttler
npm install --save-dev prisma
npx prisma init
cd ..

Write-Host "Setup complete! Please open the frontend and backend directories to begin."
