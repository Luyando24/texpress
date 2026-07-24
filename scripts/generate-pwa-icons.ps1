param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\public\icons")
)

Add-Type -AssemblyName System.Drawing

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

function New-ThunderIcon {
    param(
        [int]$Size,
        [string]$FileName,
        [bool]$Maskable = $false
    )

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $ink = [System.Drawing.ColorTranslator]::FromHtml("#070B12")
    $amber = [System.Drawing.ColorTranslator]::FromHtml("#F5B800")
    $graphics.Clear($(if ($Maskable) { $amber } else { $ink }))

    if (-not $Maskable) {
        $ringPen = New-Object System.Drawing.Pen($amber, ($Size * 0.035))
        $inset = [float]($Size * 0.09)
        $diameter = [float]($Size - (2 * $inset))
        $graphics.DrawEllipse($ringPen, $inset, $inset, $diameter, $diameter)
        $ringPen.Dispose()
    }

    $boltColor = if ($Maskable) { $ink } else { $amber }
    $boltBrush = New-Object System.Drawing.SolidBrush($boltColor)
    $points = @(
        (New-Object System.Drawing.PointF(($Size * 0.57), ($Size * 0.16))),
        (New-Object System.Drawing.PointF(($Size * 0.29), ($Size * 0.53))),
        (New-Object System.Drawing.PointF(($Size * 0.47), ($Size * 0.53))),
        (New-Object System.Drawing.PointF(($Size * 0.39), ($Size * 0.85))),
        (New-Object System.Drawing.PointF(($Size * 0.73), ($Size * 0.42))),
        (New-Object System.Drawing.PointF(($Size * 0.54), ($Size * 0.42))),
        (New-Object System.Drawing.PointF(($Size * 0.67), ($Size * 0.16)))
    )
    $graphics.FillPolygon($boltBrush, $points)

    $filePath = Join-Path $resolvedOutput $FileName
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $boltBrush.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ThunderIcon -Size 192 -FileName "icon-192.png"
New-ThunderIcon -Size 512 -FileName "icon-512.png"
New-ThunderIcon -Size 512 -FileName "icon-maskable-512.png" -Maskable $true
New-ThunderIcon -Size 180 -FileName "apple-touch-icon.png"
