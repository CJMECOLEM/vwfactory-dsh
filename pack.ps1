# 打包分发: 生成 dist\vwfactory-dsh-v<版本>.zip (仅维护者使用，不进压缩包)
# 用法: powershell -ExecutionPolicy Bypass -File pack.ps1
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding $false
$bom = New-Object System.Text.UTF8Encoding $true
$ver = ([IO.File]::ReadAllText((Join-Path $here "plugin\package.json"), $utf8) | ConvertFrom-Json).version
$name = "vwfactory-dsh-v$ver"
$dist = Join-Path $here "dist"
$stage = Join-Path $dist $name
$zip = Join-Path $dist "$name.zip"

# 规范编码: PowerShell 5.1 读取无 BOM 的 UTF-8 脚本会按系统 ANSI 代码页解析，中文即乱码报错
foreach ($f in @("install.ps1", "uninstall.ps1", "README.txt", "CHANGELOG.txt")) {
  $p = Join-Path $here $f
  $t = [IO.File]::ReadAllText($p, $utf8).TrimStart([char]0xFEFF).Replace("`r`n", "`n").Replace("`n", "`r`n")
  [IO.File]::WriteAllText($p, $t, $bom)
}
# 语法自检 (用系统自带的 Windows PowerShell 5.1)
foreach ($f in @("install.ps1", "uninstall.ps1")) {
  $p = Join-Path $here $f
  $errs = $null
  [void][System.Management.Automation.Language.Parser]::ParseFile($p, [ref]$null, [ref]$errs)
  if ($errs.Count) { throw "$f 语法错误: $($errs[0].Message)" }
}

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force $stage | Out-Null
foreach ($item in @("install.bat", "install.ps1", "uninstall.bat", "uninstall.ps1", "README.txt", "CHANGELOG.txt", "LICENSE", "plugin", "templates")) {
  Copy-Item (Join-Path $here $item) $stage -Recurse -Force
}
if (Test-Path $zip) { Remove-Item $zip -Force }
# 手动写 zip: 统一正斜杠路径 (PS 5.1 的 Compress-Archive 会写反斜杠，部分解压工具不认)
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$fs = [IO.File]::Open($zip, [IO.FileMode]::CreateNew)
$archive = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem $stage -Recurse -File | ForEach-Object {
    $rel = $name + "/" + $_.FullName.Substring($stage.Length + 1).Replace("\", "/")
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
  }
} finally { $archive.Dispose(); $fs.Dispose() }
Remove-Item $stage -Recurse -Force
$size = [math]::Round((Get-Item $zip).Length / 1KB, 1)
Write-Host "[pack] $zip ($size KB)" -ForegroundColor Green
