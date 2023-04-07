
let price = 5
let quantity = 2
let total = 0

let effect = () => {
    total = price * quantity
}


// framework code

let dep = new Set()

function track() {
    dep.add(effect)
}

function trigger() {
    dep.forEach(effect => effect())
}


// test code

effect()
console.log(total)

track()
quantity = 3

trigger()
console.log(total)
