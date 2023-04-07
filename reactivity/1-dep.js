
let price = 6
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

// 0. call effect() , total = 12
// 1. some place try get data, then call track()
// 2. change price value to 5
// 3. call trigger()
// 4. total = 10
