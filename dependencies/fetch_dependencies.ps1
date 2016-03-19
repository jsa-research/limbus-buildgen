
Invoke-WebRequest "https://github.com/svaarala/duktape-releases/archive/v1.4.0.zip" -OutFile ".\dependencies\duktape-1.4.0.zip"
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem')
if (Test-Path .\dependencies\duktape-1.4.0) {
    Remove-Item .\dependencies\duktape-1.4.0 -Force -Recurse
}
[System.IO.Compression.ZipFile]::ExtractToDirectory((Get-Location).ToString() + '\dependencies\duktape-1.4.0.zip', (Get-Location).ToString() + '\dependencies')
Move-Item .\dependencies\duktape-releases-1.4.0 .\dependencies\duktape-1.4.0
Remove-Item .\dependencies\duktape-1.4.0.zip -Force
