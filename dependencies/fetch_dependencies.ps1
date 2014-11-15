
(new-object net.webclient).DownloadFile('https://github.com/svaarala/duktape/archive/v1.0.1.zip', 'dependencies\duktape-1.0.1.zip')
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem')
[System.IO.Compression.ZipFile]::ExtractToDirectory('dependencies\duktape-1.0.1.zip', 'dependencies\duktape-1.0.1')
