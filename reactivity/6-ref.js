// framework code

const targetMap = new WeakMap();
let activeEffect = null;

function effect(eff) {
    activeEffect = eff;
    activeEffect();
    activeEffect = null;
}

function ref(raw) {
    const r = {
        get value() {
            track(r, "value");
            return raw;
        },
        set value(newVal) {
            raw = newVal;
            trigger(r, "value");
        },
    };

    return r;
}

function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }

        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }

        dep.add(activeEffect);
    }
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }

    let dep = depsMap.get(key);
    if (dep) {
        dep.forEach((effect) => {
            effect();
        });
    }
}

function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            let result = Reflect.get(target, key, receiver);
            track(target, key);
            return result;
        },
        set(target, key, value, receiver) {
            let oldValue = target[key];
            let result = Reflect.set(target, key, value, receiver);
            if (oldValue != result) {
                trigger(target, key);
            }
            return result;
        },
    };

    return new Proxy(target, handler);
}

// test code

let product = reactive({ price: 5, quantity: 2 });
let salePrice = ref(0);
let total = 0;

// Fix
// 因activeEffect为全局变量，此处 set salePrice.value 会触发上面的内部匿名函数
// 此时因为处在下面的activeEffect中，导致上面的 get salePrice.value 被track（不应该），形成死循环
// effect的状态应该是互相隔离的
//
// effect(() => {
//     total = salePrice.value * product.quantity;
// });

// effect(() => {
//     salePrice.value = product.price * 0.9;
// });

// 调整顺序就不会有问题，老外的课程这块取巧了
effect(() => {
    salePrice.value = product.price * 0.9;
});

effect(() => {
    total = salePrice.value * product.quantity;
});

console.log(`total = ${total}, salePrice = ${salePrice.value}`);

product.quantity = 3;
console.log(`total = ${total}, salePrice = ${salePrice.value}`);

product.price = 10;
console.log(`total = ${total}, salePrice = ${salePrice.value}`);
