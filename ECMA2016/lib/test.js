'use strict';

var _shim = require('globalthis/shim');

var _shim2 = _interopRequireDefault(_shim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//引用全局对象
console.log((0, _shim2.default)()); /*
                                    * es6 一共有流中声明变量的方法 
                                    * let
                                    * 存在作用域
                                    * 无变量提升
                                    * 暂时性死区：凡是在声明之前就使用这些变量，就会报错。
                                    * es6规定块级作用域中，函数声明语句的行为类似与let，在块级作用域之外不可引用
                                    * es6在附录B中规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式
                                        - 允许在块级作用域内声明函数
                                        - 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
                                        - 同事，函数声明还会提升到所在会计作用域的头部
                                    * 注意，上面三条规则只对ES6的浏览器实现有效，其他环境不用遵守还是将块级作用域的函数声明当做let处理
                                    * 根据这三条规则，在浏览器的ES6环境中，块级作用域内声明的函数，行为类似有var声明的变量
                                    * 考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。      
                                    * ES6 的块级作用域允许声明函数的规则，只在使用大括号的情况下成立，如果没有使用大括号，就会报错
                                    * 不可重复声明
                                    */

/* const
*const 声明一个只读的常量，一旦声明，常量的值就不能改变
*其他与let一样
*对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常亮对于符合类型的数据，
变量只是保存指向实际数据的指针，const只能保证这个指针是固定的，因此将一个对象声明为常量要十分小心。
*/

/* global 对象
* 不同环境取到顶层对象的方法不一样
* let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性
* 垫片库system.global模拟了这个提案，可以在所有环境拿到global。
*   CommonJS 的写法
    require('system.global/shim')();
    ES6 模块的写法
    import shim from 'system.global/shim'; shim();
    上面代码可以保证各种环境里面，global对象都是存在的。


    CommonJS 的写法
    var global = require('system.global')();
    ES6 模块的写法
    import getGlobal from 'system.global';
    const global = getGlobal();
    上面代码将顶层对象放入变量global。
*/

/* 
 * Object.freeze() 冻结对象 函数
 */

// var a = [];
// for (var i = 0; i < 10; i++) {
//     a[i] = function () {
//         console.log(i)
//     };
// }

// a[1]();


// for (var i = 0; i < 10; i++) {
//     a[i] = (function () {
//         var x = i
//         return function () {
//             console.log(x)
//         }
//     })(i);
// }

// a[8]();