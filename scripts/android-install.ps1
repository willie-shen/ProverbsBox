
#############################################
##  
##  Run Ionic Project on Android Emulator
##               Code for Christ, 2020
## 
#############################################



#############################################
##  
##  Config
##     Args: apk_path (default: debug)
##            

$push_attempts = 10     # Number of installation attempts
$emu_id = 0             # Emu Selector
$apk_path = ".\android\app\build\outputs\apk\debug\app-debug.apk"
if (0 -lt $args.Count) {
    $apk_path = $args[0]
}


#############################################
##  
##  Start the emulator
##   

$emus = emulator -list-avds
$emu = $emus.Split('
')[$emu_id];
$args = "emulator -avd " + $emu;
Start-Process powershell -WindowStyle Hidden -ArgumentList $args



#############################################
##  
##  Build apk and deploy to emulator
##   

$failed = $TRUE
for ($i=0; $i -lt $push_attempts; $i++) {
    $res = adb install -t $apk_path | Out-String
    if (!$res.Contains("failed")) {
        $failed = $FALSE
        break
    }
    Start-Sleep 1
}
if ($failed)
{
    Write-Output "APK installation to emulator failed."
    exit
}



#############################################
##  
##  Retrieve bundle name
##            

$olddir = Get-Location
$loc = $Env:ANDROID_SDK_ROOT
$loc = $loc + "\build-tools\29.0.3"
Write-Output $loc
Set-Location $loc
$apk = Join-Path $olddir $apk_path
$res = ./aapt dump badging $apk AndroidManifest.xml | Out-String
$name = $res.Split("=")[1]
$name = $name.Split("'")[1]

Set-Location $olddir
Write-Output $name



#############################################
##  
##  Start the app in the emulator
## 

$payload = $name + "/.MainActivity"
adb shell am start -n $payload
