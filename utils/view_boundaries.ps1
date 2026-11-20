$p = Join-Path (Get-Location) 'index.html'
$lines = [System.IO.File]::ReadAllLines($p)
Write-Output "----- lines 1375..1395 -----"
for ($i=1374; $i -lt 1395; $i++) { Write-Output ("{0}: {1}" -f ($i+1), $lines[$i]) }
Write-Output "----- lines 1439..1450 -----"
for ($i=1438; $i -lt 1450; $i++) { Write-Output ("{0}: {1}" -f ($i+1), $lines[$i]) }
Write-Output "----- lines 1250..1258 -----"
for ($i=1249; $i -lt 1258; $i++) { Write-Output ("{0}: {1}" -f ($i+1), $lines[$i]) }
Write-Output "----- line 2856 & 2946 -----"
Write-Output ("2856: " + $lines[2855])
Write-Output ("2946: " + $lines[2945])
