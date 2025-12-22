# 设置代理 (根据检测到的端口 7890)
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"

Write-Host "已设置代理: http://127.0.0.1:7890"
Write-Host "正在启动 EAS Build..."

# 运行构建
npx eas-cli build --platform android --profile preview
