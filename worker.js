const { workerData, parentPort } = require("worker_threads");
const frand = require("fast-random")
const seedrandom = require("seedrandom")
 
const {hex, search, _PAGES} = workerData

const WALLS_PER_ROOM = 5;
const SHELFS_PER_WALL = 20;
const BOOKS_PER_SHELF = 5;
const PAGES_PER_BOOK = 100;
const PAGE_LENGTH = 1000

let wall = 0, 
shelf = 0, 
book =0, 
page = 0;
let found = false;
let foundCoords = null
let matRx = new RegExp(escapeRegExp(search), "g")

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


/*
create the whole room worth of pages
use a trie or something "search efficient"
and look for the string once everything is built?
*/

function rand(seed) {
let a=75,
b=74,
m= 65537;
    return function* () {
        while(true){
            seed = (a * seed + b) %m
            yield seed
        }
    }

}

//console.log("Genning page for: ", hex, wall, shelf, book, page)
while( !found && (
    wall < WALLS_PER_ROOM
)) {

    const seed =Number([hex, wall, shelf, book, page].join("")) 
    // parentPort.postMessage({
    //     log: true, 
    //     data: "Seed: " + seed
    // })
    let pageStr = "";
    let count = 0 
    seedrandom(seed, {global: true})
    do {

        if(count > 0) {
            parentPort.postMessage({
                log: true, 
                data: ["Finding a new page for coords: ", hex, wall, shelf, book, page].join(" - ")
            })
        }
        pageStr = Array.from({
            length: PAGE_LENGTH
        }, _ => {
            let s = String.fromCharCode(Math.floor(Math.random() * (125-33) + 32))
            return s
        }).join("")
        count++
    } while (_PAGES.has(pageStr))

       
    // parentPort.postMessage({
    //     log: true,
    //     data: pageStr
    // })
    const pfound = pageStr.match(matRx)
    if(pfound) {
        found = true;
        parentPort.postMessage({
            log: true, 
            data: "[" + seed + "]" + pageStr.replace(matRx, "[----" + search + "----]")
        })
        foundCoords = {hex, wall, shelf, book, page}
        finish()
        //console.log(foundCoords)
    } else {
        page++;
        if(page > PAGES_PER_BOOK) {
            page = 0
            book++

            if(book > BOOKS_PER_SHELF) {
                book = 0
                shelf++

                if(shelf > SHELFS_PER_WALL) {
                    shelf = 0
                    wall++
                }
            }
        }
        //console.log("Next coords: ", hex, wall, shelf, book, page)
    }
}

finish()
function finish() {
parentPort.postMessage({
    log: true, 
    data: "Finishing work for hex: " + hex 
})
parentPort.postMessage({
    log: true,
    data: "Res: " + found
})

parentPort.postMessage({
    found,
    coords: foundCoords
})

}