const Srand = require('seeded-rand');
const frand = require("fast-random")
const { Worker } = require("worker_threads");


function createWorker(hex, search, page) {
    return new Promise(function (resolve, reject) {
      const worker = new Worker("./worker.js", {
        workerData: { hex, search, _PAGES },
      });
      worker.on("message", (data) => {
        if(data.log){ 
          console.log(data.data)
        } else {
        resolve(data);
        }
      });
      worker.on("error", (msg) => {
        reject(`An error ocurred: ${msg}`);
      });
    });
  }

function *gen(mod, a, c, seed) {
    while(true) {

        seed = (a * seed + c) % mod
        yield seed
    }
}

let _PAGES = new Set()

function genPage(hex, wall, shelf, book, page) {
    const seed =Number([hex, wall, shelf, book, page].join("")) 
    const r = frand(seed);
    let pageStr = "";
    let count = 0 
    let currSeed = seed;
    do {
       currSeed = Math.sin(currSeed) * 1000
        if(count > 0) {
            console.log("Finding a new page for coords: ", hex, wall, shelf, book, page)
        }
        pageStr = Array.from({
            length: 100
        }, _ => String.fromCharCode(32 * random % (125 - 33) )).join("")
        count++
    } while (_PAGES.has(pageStr))
    return pageStr
}


let search = "if(true"


let hex = 0;
let wall = 0;
let shelf = 0;
let book = 0; 
let page = 0;
let found = false;

const WALLS_PER_ROOM = 5;
const SHELFS_PER_WALL = 20;
const BOOKS_PER_SHELF = 5;
const PAGES_PER_BOOK = 100;

let promises =  []
const THREAD_COUNT = 8;

(async _ => {
while(!found) {
    //let p = genPage(hex, wall, shelf, book, page)

    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker(hex, search, _PAGES));
        hex++;
        // wall++;
        // wall = wall % WALLS_PER_ROOM

        // shelf++;
        // shelf = shelf % SHELFS_PER_WALL

        // book++;
        // book = book % BOOKS_PER_SHELF

        // page++;
        // page = page % PAGES_PER_BOOK
    }
    console.log("Calling ", workerPromises.length, " threads...")
    const thread_results = await Promise.all(workerPromises);
    console.log("Results: ")
    console.log(thread_results)
    const pfound = thread_results.find( pres => pres.found )

    if(pfound) {
        found = true
        console.log("Coords: ")
        console.log(pfound.coords)
    }
    
}
})()