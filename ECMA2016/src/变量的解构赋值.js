/* 数组的解构赋值。
* es6 允许按照一定的模式，从数组和对象中提取值，对变量进行赋值，这被称为解构。
* 只要某种数据结构具有Iterator接口（可遍历）都可以采用数组的形式进行结构赋值。
* 等号右边也可以是一个Generator函数，解构赋值会依次从这个接口获取值。
* Generator：[ˈdʒenəreɪtə(r)]   iterator：[ɪtə'reɪtə]
*/

/* 默认值
* 解构赋值允许指定默认值
* let [foo = true] = [];
* let [x,y = b] = ['a']; // x='a',y='b';
* let [x,y = b] = ['a',undefined]; // x='a',y='b';
*/

/* 对象的解构赋值 
*解构赋值不仅可以用于数组，还可以用于对象
*let { foo,bar } = { foo:"aaa",bar:'bbb' }
*数组的元素是按次序排列的，变量的取值由他的位置决定；而变量的取值没有次序，变量必须与属性同名，才能取到正确的值。
*如果变量名与属性名不一致，必须写成下面这样
*let { foo: baz } = {foo:'aaa',bar:'bbb'}
*foo是匹配模式，baz才是变量
*这实际上说明，对象的解构赋值是下面形式的简写
*let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
*与数组一样解构也可以用于嵌套对象
*let obj = {
    p: [
        'hello',
        { y:'World' }
    ]
};

let { p: [x,{ y }] } = obj
 x //"Hello"
 y //"World" 
*注意，这时p是模式，不是变量，因此不会被赋值。如果p也要作为变量赋值，可以写成下面这样。
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj;
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
*
* 如果解构失败变量等于undefined
* 对象解构也有默认值 {x=3} = {}; {y=6} = {undefined}  {x:z=1}={x:18}
*
*/

/*如果将一个已经声明的变量进行解构赋值必须非常小心
* let x;
 {x} = {x: 1};
*上面的写法报错因为 JavaScript 引擎会将{x}理解成一个代码块，从而发生语法错误。
只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。
*正确写法 
*let x;
({x} = {x: 1});
稀奇古怪
({} = [true, false]);
({} = 'abc');
({} = []);
* 由于数组的本质就是对象 因此可以对数组进行对象属性的解构
```
let arr = [1, 2, 3];
let {0 : first, [arr.length - 1] : last} = arr;
first // 1
last // 3 
```
*
 */

/*字符串的解构赋值 
* 字符串也可以解构赋值，正是此时字符串被转换成了一个类似数组的对象
* const [a,b,c,d,e] = 'hello'
* let {length : len} = 'hello';  注意 ：匹配模式必须是length
*/ 


/*数值和布尔值的解构赋值
* 如果等号右边是数值和布尔值会转换为对象
* 解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。
 */

/* 函数参数的解构赋值 
分清函数本身的默认值和解构参数的默认值
*/

/* 
不能使用圆括号的情况：变量声明语句
函数参数
函数参数也属于变量声明，因此不能带有圆括号。
赋值语句的模式

可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。
*/

// ====================================================
// 不完全解构
let [x,y] = [,1];
// console.log(x,y);   // undefined,1

// 完全解构
let [z,a] = [0,1];


let [b,c = undefined] = []
// console.log(b,c);

// 只有当一个数组成员严格等于undefined，默认值才会生效。
// 上面代码中如果一个数组成员是null，默认值就不会生效，因为null不严格等于undefied
let [f='111',g ='222'] = []
// console.log(f,g)

let {foo} = {foo:'aaa',bar:'bbb'};
console.log(foo)
let {foo:baz} = {foo:'aaa',bar:'bbb'};
console.log(foo)

const node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

// let { loc, loc: { start }, loc: { start: { line }} } = node;
// console.log(loc)
// 除了bar是变量以外  其余都是匹配模式
let {foo1,foo1: {bar}} = {foo1:{bar:'baz'} };

console.log(foo1)

let {qq:xx}={qq:111}
console.log(xx);

const [aa,bb,cc,dd,ee] = 'hello'

 let {length : lenx} = 'hello';
 console.log(lenx,dd)

 let {toString:s} = 123;
 console.log(Number.prototype)


// let arr = [1,2,3];
// arr.splice()