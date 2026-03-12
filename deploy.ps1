# 部署腳本 - 將專案部署到生產環境 VPS (PowerShell 版本)

$ErrorActionPreference = "Stop"

# VPS 設定
$VPS_USER = "lewsi"
$VPS_HOST = "lewsi.ddns.net"
$VPS_PATH = "/home/lewsi/workspace/landingPage"

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  開始部署到生產環境" -ForegroundColor Yellow
Write-Host "  目標: $VPS_USER@$VPS_HOST" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Step 0: Check for node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[0/3] 找不到 node_modules，正在安裝依賴..." -ForegroundColor Green
    npm install
}

# Step 1: Build
Write-Host "[1/3] 建置專案..." -ForegroundColor Green
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "錯誤: 建置失敗，找不到 dist 目錄" -ForegroundColor Red
    exit 1
}

Write-Host "✓ 建置完成" -ForegroundColor Green
Write-Host ""

# Step 2: 建立遠端目錄 (如果不存在) 並清空內容
Write-Host "[2/3] 準備遠端目錄..." -ForegroundColor Green
# 模擬 rsync --delete 的行為：先清空目標目錄
ssh "$VPS_USER@$VPS_HOST" "mkdir -p $VPS_PATH; rm -rf ${VPS_PATH}/*"
Write-Host "✓ 遠端目錄已準備並清空" -ForegroundColor Green
Write-Host ""

# Step 3: 使用 scp 同步檔案
Write-Host "[3/3] 上傳檔案到 VPS..." -ForegroundColor Green
# 使用 scp 作為 Windows 上的原生替代方案
scp -r ./dist/* "${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"

# Step 4: 修復遠端權限 (解決 403 Forbidden 問題)
Write-Host "[4/4] 修正遠端檔案權限..." -ForegroundColor Green
ssh "$VPS_USER@$VPS_HOST" "find ${VPS_PATH} -type d -exec chmod 755 {} \; ; find ${VPS_PATH} -type f -exec chmod 644 {} \;"
Write-Host "✓ 權限修正完成" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "檔案已部署至: ${VPS_USER}@${VPS_HOST}:${VPS_PATH}"
Write-Host ""
