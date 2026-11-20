$p = Join-Path (Get-Location) 'index.html'
$c = [System.IO.File]::ReadAllText($p)
$patterns = @(
  'FEE_DISCOUNT_DEADLINE',
  'isFeeDiscountActive',
  'discountedFee',
  'renderFeeAmount',
  'renderFeeLabel',
  'Flat 50% OFF',
  '50% OFF on registration',
  'Flat 50% OFF on registration fees',
  '05%',
  'line-through'
)
foreach ($pt in $patterns) {
  $count = ([regex]::Matches($c, [regex]::Escape($pt))).Count
  Write-Output ("{0} => {1}" -f $pt, $count)
}
Write-Output ("FILE_LENGTH => {0}" -f $c.Length)
