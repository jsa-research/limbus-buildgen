
Invoke-WebRequest "https://github.com/redien/duktape/releases/download/v1.0.1/duktape-1.0.1.zip" -OutFile ".\dependencies\duktape-1.0.1.zip"
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem')
if (Test-Path .\dependencies\duktape-1.0.1) {
    Remove-Item .\dependencies\duktape-1.0.1 -Force -Recurse
}
[System.IO.Compression.ZipFile]::ExtractToDirectory((Get-Location).ToString() + '\dependencies\duktape-1.0.1.zip', (Get-Location).ToString() + '\dependencies')
Remove-Item .\dependencies\duktape-1.0.1.zip -Force