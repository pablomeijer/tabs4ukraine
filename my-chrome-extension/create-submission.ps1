# Create submission ZIP - exclude .vite folder
$zipPath = "tabs4ukraine-submission.zip"
$buildPath = "build"

# Remove old zip if exists
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Create a temporary directory
$tempPath = "temp_zip_temp"
if (Test-Path $tempPath) {
    Remove-Item $tempPath -Recurse -Force
}
New-Item -ItemType Directory -Path $tempPath | Out-Null

# Copy all files from build to temp, excluding .vite, preserving structure
Get-ChildItem -Path $buildPath -Recurse -File | Where-Object { $_.FullName -notlike "*\.vite\*" } | ForEach-Object {
    $relativePath = $_.FullName.Substring((Resolve-Path $buildPath).Path.Length + 1)
    $destPath = Join-Path $tempPath $relativePath
    $destDir = Split-Path $destPath -Parent
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    Copy-Item $_.FullName -Destination $destPath
}

# Compress the temp directory contents (not the directory itself)
Compress-Archive -Path "$tempPath\*" -DestinationPath $zipPath -Force

# Clean up temp directory
Remove-Item $tempPath -Recurse -Force

Write-Host "✅ Created tabs4ukraine-submission.zip"

