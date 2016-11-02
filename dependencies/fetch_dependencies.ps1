
# limbus-buildgen - A "build anywhere" C/C++ makefile/project generator.
# Written in 2014-2016 by Jesper Oskarsson jesosk@gmail.com
#
# To the extent possible under law, the author(s) have dedicated all copyright
# and related and neighboring rights to this software to the public domain worldwide.
# This software is distributed without any warranty.
#
# You should have received a copy of the CC0 Public Domain Dedication along with this software.
# If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.

# Versions
$duktape_version="1.5.1"

# Global variables
$current_directory = (Get-Location).ToString()
$dependencies_folder_relative = "\dependencies"
$dependencies_folder = $current_directory + $dependencies_folder_relative

# Duktape download
$duktape_archive_url = "https://github.com/svaarala/duktape-releases/archive/v" + $duktape_version + ".zip"
$duktape_archive_destination = $dependencies_folder + "\duktape-" + $duktape_version + ".zip"
$duktape_final_directory = $dependencies_folder + "\duktape-" + $duktape_version
$duktape_intermediary_directory = $dependencies_folder + "\duktape-releases-" + $duktape_version

if (!(Test-Path $duktape_final_directory)) {
  $progressPreference = 'silentlyContinue'
  Invoke-WebRequest $duktape_archive_url -OutFile $duktape_archive_destination
  [System.Reflection.Assembly]::LoadWithPartialName('System.IO.Compression.FileSystem') | Out-Null
  [System.IO.Compression.ZipFile]::ExtractToDirectory($duktape_archive_destination, $dependencies_folder) | Out-Null
  Move-Item $duktape_intermediary_directory $duktape_final_directory
  Remove-Item $duktape_archive_destination -Force
}
