# 重新生成 README 截图 (docs/images/*.png)。需要 Windows 自带的 Edge，并能访问 unpkg.com 加载 React。
# 用法: powershell -ExecutionPolicy Bypass -File tools/preview/render.ps1
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = (Resolve-Path (Join-Path $here "..\..")).Path
$out = Join-Path $repo "docs\images"
New-Item -ItemType Directory -Force $out | Out-Null
$page = "file:///" + ((Join-Path $here "gallery.html") -replace '\\', '/')
$profileDir = Join-Path $env:TEMP "vwf-preview-profile"

# 文件名 = 截图模式, 窗口大小 (CSS 像素, 输出为 2 倍分辨率)
$shots = [ordered]@{
  "settings-light.png" = @("settings",      "820,500")
  "settings-dark.png"  = @("settings-dark", "820,500")
  "balance-mode.png"   = @("balance",       "820,410")
  "quota-pill.png"     = @("pill",          "900,700")
}
foreach ($name in $shots.Keys) {
  $mode, $size = $shots[$name]
  $file = Join-Path $out $name
  if (Test-Path $file) { Remove-Item $file }
  Start-Process msedge -Wait -ArgumentList @(
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2",
    "--user-data-dir=$profileDir-$mode", "--window-size=$size", "--virtual-time-budget=4000",
    "--screenshot=$file", "$page`?shot=$mode")
  if (-not (Test-Path $file)) { throw "截图失败: $name" }
  Write-Host "[render] $name"
}