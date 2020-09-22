
#############################################
##  
##  Retrieve bundle name
##     

$apk_path = ".\android\app\build\outputs\apk\debug\app-debug.apk"
$aapt_path = "\build-tools\29.0.3"

$olddir = Get-Location
$loc = $Env:ANDROID_SDK_ROOT
$loc = $loc + $aapt_path
Set-Location $loc
$apk = Join-Path $olddir $apk_path
$res = ./aapt dump badging $apk AndroidManifest.xml | Out-String
$name = $res.Split("=")[1]
$name = $name.Split("'")[1]
Set-Location $olddir

Write-Output $name