const seedrandom = require("seedrandom")

const PAGE_LENGTH = 1000

const coords = { hex: 0, wall: 2, shelf: 14, book: 2, page: 81 }

const {hex, wall, shelf, book, page} = coords

const seed =Number([hex, wall, shelf, book, page].join("")) 

seedrandom(seed, {global: true})

pageStr = Array.from({
    length: PAGE_LENGTH
}, _ => {
    let s = String.fromCharCode(Math.floor(Math.random() * (125-33) + 32))
    return s
}).join("")

console.log(pageStr)