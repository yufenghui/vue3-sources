
let product = {
    price: 5,
    quantity: 2
}
let total = 0

let effect = () => {
    total = product.price * product.quantity
}


// framework code

const depsMap = new Map()

function track(key) {
    let dep = depsMap.get(key)
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    dep.add(effect)
}

function trigger(key) {
    let dep = depsMap.get(key)
    if(dep) {
        dep.forEach(effect => {
            effect()
        });
    }
}


// test code

effect()
console.log(total)

track("quantity")
product.quantity = 3

trigger("quantity")
console.log(total)
