
/*
 *  Live Android Development
 *         Code for Christ, 2020
 */


// Imports
const process = require('process');
const readline = require('readline');
const { spawn, spawnSync, exec, execSync} = require('child_process');

// Config
const emu_id = 0;



/*
 * A. Load emulator
 * 
    // code sample
    $emus = emulator -list-avds
    $emu = $emus.Split('
    ')[$emu_id];
    $args = "emulator -avd " + $emu;
    Start-Process powershell -WindowStyle Hidden -ArgumentList $args
 *
 */

// open emulator
async function getEmulatorName(emu_id) {
    return new Promise((resolve) => {
        const script = exec('emulator -list-avds', (err, stdout, stderr) => {
            let emus = stdout.split("\n");
            let emu = emus[ Math.min(emus.length - 1, emu_id)];
            resolve(emu.trim());
        })
    });
}

async function openEmulator(emu_name) {
    console.log("Emulator Name: ", emu_name);
    return new Promise((resolve) => {
        const child = spawn('emulator', ["-avd", emu_name]);
        child.stdout.on('data', (chunk) => {
            // emulator loading complete
            if (chunk.includes("HAX")) {
                // resolve
                resolve(emu_name);
            }
        });
        child.on('close', (code) => {
            console.log(`Emulator exited with code: ${code}`)
        });
    });
}

let emulator_name = undefined;
const emu_promise = getEmulatorName(emu_id)
.then(name => openEmulator(name));


/*
 * B. Build android app?
 *  (Omitted)
 */

 /*
 * C. Start live reload server
 *    ionic capacitor run android -l --external
 */

async function startLiveReload() {
    return new Promise((resolve) => {
        // Fails:  const child = spawn('ionic', ["capacitor", "run", "android", "-l", "--external", "--host=192.168.56.1"]);
        // A hack: run "ionic capacitor run android -l --external" from powershell
        const child = spawn('powershell.exe', ["./scripts/ionic-live-reload"]);
        child.stdout.on('data', (chunk) => {
            // server loaded
            if (chunk.includes("[INFO] Development server will continue running until manually stopped.")) {
                // resolve
                resolve();
            }
        });
        child.on('close', (code) => {
            console.log(`Live server exited with code: ${code}`)
        });
    });
}
const live_reload_promise = startLiveReload();

/*
 * D. Boot app
 * 
 * bundle-name.ps1
 *
   // sh example
   $payload = $name + "/.MainActivity"
   adb shell am start -n $payload
*/

// Wait for live-reload server and emulator to load
live_reload_promise
.then(() => emu_promise)
.then(name => {
    // Settings
    const loadDuration = 7000;
    const latency = 500;

    // Get app bundle name
    let bundleName = execSync('powershell.exe ./scripts/bundle-name').toString().trim();
    
    // Attempt to open app in emulator every (latency) millisecond(s)

    console.log("Attempting to open app.");

    let emuState = "unknown"; // unknown, booting, loading, loaded
    let loadTimer = 0;

    const pushAttempt = setInterval(() => {        
        // state: loading
        if (emuState === "loading") {
            loadTimer += latency;
            if (loadTimer >= loadDuration) {
                emuState = "loaded";
            }
            else {
                return;
            }
        }

        // state: unknown/loaded
        try {
            const buf = execSync('adb shell am start -n ' + bundleName + "/.MainActivity");
            // console.log(buf.toString());

            if (emuState === "booting") {
                emuState = "loading";
            }
            else if (emuState === "unknown") {
                emuState = "loaded";
            }
        }
        catch {
            // loaded? -> loading
            emuState = (emuState === "loaded") ? "loading" : "booting";
        }

        // cancel boot app attempts
        if (emuState === "loaded") {
            console.log("Opened app on emulator");
            clearInterval(pushAttempt);
        }
    }, latency);

    // Time out attempts
    setTimeout(() => {
        clearInterval(pushAttempt);
        if (emuState === "unknown") {
            console.log("Timed out: App failed to open on emulator.");
        }
    }, 15000);
});

/*
 *
 *  Graceful exits (vs code?)
 * 
 */
/*
process.on('disconnect', (code) => {
    console.log("goodbye");
    //adb -e emu kill
    for (let i = 0; i < 10000000000; ++i) {
        console.log("Please don't go!!!");
    }
});
*/