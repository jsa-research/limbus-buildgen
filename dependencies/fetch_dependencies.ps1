
# Versions
$duktape_version="1.4.0"

# Global variables
$current_directory = (Get-Location).ToString()

# Duktape download
$dependencies_folder_relative = "\dependencies"
$dependencies_folder = $current_directory + $dependencies_folder_relative

$duktape_archive_url = "https://github.com/svaarala/duktape-releases/archive/v" + $duktape_version + ".zip"
$duktape_archive_destination = $dependencies_folder + "\duktape-" + $duktape_version + ".zip"
$duktape_final_directory = dependencies_folder + "\duktape-" + $duktape_version
$duktape_intermediary_directory = dependencies_folder + "\duktape-releases-" + $duktape_version

Invoke-WebRequest $duktape_archive_url -OutFile $duktape_archive_destination
[System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem')
if (Test-Path $duktape_final_directory) {
    Remove-Item $duktape_final_directory -Force -Recurse
}
[System.IO.Compression.ZipFile]::ExtractToDirectory($duktape_archive_destination, $dependencies_folder)
Move-Item $duktape_intermediary_directory $duktape_final_directory
Remove-Item $duktape_archive_destination -Force
