Start-Process powershell -Verb RunAs -ArgumentList "New-NetFirewallRule -DisplayName 'ExpoDev' -Direction Inbound -LocalPort 8081,3000 -Protocol TCP -Action Allow"
