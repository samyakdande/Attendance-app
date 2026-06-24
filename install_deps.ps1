# Install missing backend and frontend dependencies

Write-Host "Installing Frontend Dependencies..."
cd d:\app1\frontend
npm install --legacy-peer-deps
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage -- --legacy-peer-deps
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar -- --legacy-peer-deps

Write-Host "Installing Backend Auth Dependencies..."
cd d:\app1\backend
npm install @nestjs/passport passport passport-jwt @nestjs/config @prisma/client
npm install --save-dev @types/passport-jwt

Write-Host "Generating Prisma Client..."
npx prisma generate

Write-Host "All done!"
