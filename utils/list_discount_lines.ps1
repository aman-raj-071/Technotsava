$p = Join-Path (Get-Location) 'index.html'
$lines = [System.IO.File]::ReadAllLines($p)
$patterns = @('FEE_DISCOUNT_DEADLINE','isFeeDiscountActive','discountedFee','renderFeeAmount','renderFeeLabel','Flat 50% OFF','line-through')
for ($i=0; $i -lt $lines.Length; $i++) {
  $ln = $lines[$i]
  foreach ($pt in $patterns) {
    if ($ln.Contains($pt)) {
      Write-Output ("{0}: {1}" -f ($i+1), $ln.Trim())
      break
    }
  }
}
