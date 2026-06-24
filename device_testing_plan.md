# CampusFlow ERP: Mobile Device Validation Plan

This plan focuses purely on infrastructure configuration to ensure your physical Android device can communicate with your locally running NestJS backend and Supabase instance.

## User Review Required

> [!IMPORTANT]
> Because you are testing on a physical device, your phone cannot connect to `localhost`. We need to bind the backend to your local network and configure the frontend to point to your computer's IP address. Please review the steps below.

## 1. Backend Network Binding

By default, NestJS often binds to `127.0.0.1` (localhost). We will modify `d:\app1\backend\src\main.ts` to explicitly bind to `0.0.0.0`. This exposes the API to your local Wi-Fi network so your phone can reach it.

### [MODIFY] `d:\app1\backend\src\main.ts`
- Update `app.listen(3000)` to `app.listen(3000, '0.0.0.0')`.

## 2. Frontend Environment Configuration

We need to update the React Native frontend to point to your machine's local IP address instead of localhost.

### [MODIFY] `d:\app1\frontend\.env`
- Add `EXPO_PUBLIC_BACKEND_URL=http://<YOUR_LOCAL_IP>:3000`
- I will provide a PowerShell script that automatically detects your machine's local IP address and injects it into the `.env` file before starting Expo.

## 3. Seed Data Script

To test the physical QR scanning, you will need a valid QR code to scan. I will create a `seed_test_data.ts` script in the backend that:
1. Creates a dummy Class and Teacher.
2. Creates a dummy Student and outputs their generated `qrIdentifier`.
3. Opens an Attendance Session and outputs the `sessionId`.

You can use a free online QR generator to turn the outputted `qrIdentifier` into a physical QR code on your computer screen, and then scan it with your phone!

## Verification Plan

### Manual Verification
1. Run the backend on `0.0.0.0`.
2. Run the new IP-injection script for the frontend to start Expo Go.
3. Open Expo Go on your Android device and scan the generated QR code.
4. Validate that the UI correctly slides up with "MARKED PRESENT".
