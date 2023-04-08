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

function computed(getter) {
    let result = ref();

    effect(() => (result.value = getter()));

    return result;
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

// 由于都被定义为计算属性，就存在前后顺序，就不会出现死循环的问题
let salePrice = computed(() => {
    return product.price * 0.9;
});

let total = computed(() => {
    return salePrice.value * product.quantity;
});

console.log(`total = ${total.value}, salePrice = ${salePrice.value}`);

product.quantity = 3;
console.log(`total = ${total.value}, salePrice = ${salePrice.value}`);

product.price = 10;
console.log(`total = ${total.value}, salePrice = ${salePrice.value}`);

// 验证动态新增属性，响应式是否生效

product.name = "Shoes";

effect(() => {
    console.log(`Product name is now ${product.name}`);
});

product.name = "Socks";
