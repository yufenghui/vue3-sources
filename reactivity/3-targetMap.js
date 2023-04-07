let product = {
    price: 5,
    quantity: 2
}
let total = 0

let effect = () => {
    total = product.price * product.quantity
}


// framework code

const targetMap = new Map()

function track(target, key) {
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }

    dep.add(effect)
}

function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if(!depsMap) {
        return
    }

    let dep = depsMap.get(key)
    if(dep) {
        dep.forEach(effect => {
            effect()
        });
    }
}



// call effect(), total = 10
// track(product, "quantity")
// product.quantity = 3
// trigger(product, "quantity")
// total = 15