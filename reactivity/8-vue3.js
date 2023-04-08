var { reactive, computed, effect } = require("./reactivity.cjs");

// test code, run: node reactivity/8-vue3.js

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
