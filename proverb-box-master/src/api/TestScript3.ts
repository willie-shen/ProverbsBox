/*
 * Playground for testing API.
 * Code for Christ 1/23/2020
 */

import Loader from "./KJV-Loader"

export default function TestScript() {
    console.log("TestScript 3 Running");

    const myLoader = new Loader();
    myLoader.Load('/assets/translations/KJV-Proverbs.json').then(data => {
        console.log("Data in TestScript: ", data);
    });
}


