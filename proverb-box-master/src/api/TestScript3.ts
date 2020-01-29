/*
 * Playground for testing API.
 * Code for Christ 1/23/2020
 */

import loader from "./KJV-Loader"

export default function TestScript() {
    console.log("TestScript 3 Running");

    const myLoader = new loader();
    myLoader.Load("hello");
}


