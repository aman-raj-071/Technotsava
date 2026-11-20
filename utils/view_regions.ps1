$p = Join-Path (Get-Location) 'index.html'
$lines = [System.IO.File]::ReadAllLines($p)
# Show ranges around key regions
$ranges = @(
  @(1140, 1270),   # promo + event card
  @(1385, 1440),   # helper block
  @(1825, 1900),   # registration header + tech quiz buttons
  @(2015, 2040),   # ideathon buttons
  @(2240, 2260)    # payment fee
)
foreach ($r in $ranges) {
  Write-Output ("----- lines {0}..{1} -----" -f $r[0], $r[1])
  for ($i=$r[0]-1; $i -lt $r[1]; $i++) {
    if ($i -ge 0 -and $i -lt $lines.Length) {
      Write-Output ("{0}: {1}" -f ($i+1), $lines[$i])
    }
  }
}
