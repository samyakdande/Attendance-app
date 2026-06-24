# Get the primary IPv4 address of the local machine
$ipAddress = (Test-Connection -ComputerName (hostname) -Count 1).IPV4Address.IPAddressToString

if (-not $ipAddress) {
    # Fallback to alternative method if Test-Connection fails
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi, Ethernet -ErrorAction SilentlyContinue | Where-Object { $_.PrefixOrigin -eq 'Dhcp' -or $_.PrefixOrigin -eq 'Manual' } | Select-Object -First 1).IPAddress
}

if (-not $ipAddress) {
    Write-Host "Could not automatically determine your IP Address. Please set EXPO_PUBLIC_BACKEND_URL manually in frontend/.env" -ForegroundColor Red
    exit 1
}

Write-Host "Detected Local Network IP: $ipAddress" -ForegroundColor Cyan

$envFilePath = "d:\app1\frontend\.env"

# Read existing .env content
$envContent = Get-Content $envFilePath -Raw -ErrorAction Ignore
if (-not $envContent) {
    $envContent = ""
}

# Add or replace the EXPO_PUBLIC_BACKEND_URL variable
$backendUrl = "http://${ipAddress}:3000"
$pattern = '(?m)^EXPO_PUBLIC_BACKEND_URL=.*$'

if ($envContent -match $pattern) {
    $envContent = $envContent -replace $pattern, "EXPO_PUBLIC_BACKEND_URL=$backendUrl"
} else {
    $envContent += "`nEXPO_PUBLIC_BACKEND_URL=$backendUrl"
}

Set-Content -Path $envFilePath -Value $envContent
Write-Host "Injected EXPO_PUBLIC_BACKEND_URL=$backendUrl into frontend/.env" -ForegroundColor Green

# Start the Expo development server
cd d:\app1\frontend
npx expo start -c
