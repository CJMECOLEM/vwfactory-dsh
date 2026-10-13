# vwFactory for DeepSeek Harness - uninstaller
param(
  [string]$ProfileDir = (Join-Path $env:USERPROFILE ".dsh\profiles\desktop"),
  [switch]$SkipEnv,
  [switch]$RemoveData
)
$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
function Info($m) { Write-Host "[vwFactory] $m" }

if (Get-Process -Name "DeepSeek Harness" -ErrorAction SilentlyContinue) {
  Write-Warning "DeepSeek Harness 正在运行，请先退出再卸载，否则配置可能被覆盖。"
}

$patch = Join-Path $ProfileDir "cordis.patch.yml"
if (Test-Path $patch) {
  Copy-Item $patch ("$patch.bak-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
  $lines = [IO.File]::ReadAllLines($patch, $utf8)
  $out = New-Object System.Collections.Generic.List[string]
  $i = 0
  while ($i -lt $lines.Length) {
    $ln = $lines[$i]
    if ($ln -like "# >>> vwfactory:mount*") {
      while ($i -lt $lines.Length -and $lines[$i] -notlike "# <<< vwfactory:mount*") { $i++ }
      $i++; continue
    }
    if ($ln -like "# >>> vwfactory:providers*") {
      $i++                                   # 跳过标记行
      if ($i -lt $lines.Length) { $i++ }     # 跳过 "- id: llm-pi-ai"
      while ($i -lt $lines.Length -and $lines[$i] -notmatch "^- ") { $i++ }  # 到下一个顶层条目
      continue
    }
    $out.Add($ln); $i++
  }
  [IO.File]::WriteAllText($patch, (($out -join "`n").TrimEnd() + "`n"), $utf8)
  Info "已从 cordis.patch.yml 移除 vwFactory 配置"
}

$credFile = Join-Path (Split-Path -Parent (Split-Path -Parent $ProfileDir)) ".credentials.yaml"
if (Test-Path $credFile) {
  $cl = [IO.File]::ReadAllLines($credFile, $utf8) | Where-Object { $_ -notmatch '^\s+VWFACTORY_TOKEN:' }
  $cl = @($cl)
  for ($k = 0; $k -lt $cl.Count; $k++) {
    if ($cl[$k] -match '^refs:\s*$' -and ($k + 1 -ge $cl.Count -or $cl[$k + 1] -notmatch '^\s')) { $cl[$k] = "refs: {}" }
  }
  [IO.File]::WriteAllText($credFile, (($cl -join "`n").TrimEnd() + "`n"), $utf8)
  Info "已从 DSH 凭据移除 VWFACTORY_TOKEN"
}
$dest = Join-Path $ProfileDir "plugins\vwFactory"
if (Test-Path $dest) { Remove-Item $dest -Recurse -Force; Info "已删除 $dest" }
if (-not $SkipEnv) { [Environment]::SetEnvironmentVariable("VWFACTORY_TOKEN", $null, "User") }

if ($RemoveData) {
  foreach ($d in @((Join-Path $env:USERPROFILE ".dsh\vwFactory"), (Join-Path $env:USERPROFILE ".vwFactory"))) {
    if (Test-Path $d) { Remove-Item $d -Recurse -Force; Info "已删除数据 $d" }
  }
} else {
  Info "账号数据保留在 ~/.vwFactory (加 -RemoveData 可一并删除)"
}
Info "卸载完成，请重启 DeepSeek Harness。"