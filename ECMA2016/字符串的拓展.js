/* 
*字符串的拓展
* codePointAt()
* js内部，字符以UTF-16的格式储存，每个字符固定为2个字节。
  对于那些需要4个字节储存的字符（Unicode码点大于0xFFFF的字符），js会认为他们是两个字符
* ES6 提供了codePointAt方法，能够正确处理 4 个字节储存的字符，返回一个字符的码点。
  
```
    let s = '𠮷a';
    s.codePointAt(0) // 134071
    s.codePointAt(1) // 57271
    s.codePointAt(2) // 97
```  
  总之，codePointAt方法会正确返回 32 位的 UTF-16 字符的码点。
  对于那些两个字节储存的常规字符，它的返回结果与charCodeAt方法相同。
  codePointAt方法返回的是码点的十进制值，如果想要十六进制的值，可以使用toString方法转换一下。
  
```
    let s = '𠮷a';
    s.codePointAt(0).toString(16) // "20bb7"
    s.codePointAt(2).toString(16) // "61"
```
  你可能注意到了，codePointAt方法的参数，仍然是不正确的。
  比如，上面代码中，字符a在字符串s的正确位置序号应该是 1，但是必须向codePointAt方法传入 2。
  解决这个问题的一个办法是使用for...of循环，因为它会正确识别 32 位的 UTF-16 字符。

```
    let s = '𠮷a';
    for (let ch of s) {
    console.log(ch.codePointAt(0).toString(16));
    }
    // 20bb7
    // 61
    codePointAt方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。

    function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
    }

    is32Bit("𠮷") // true
    is32Bit("a") // false
```  

* String.fromCodePoint()
ES5 提供String.fromCharCode方法，用于从码点返回对应字符，
但是这个方法不能识别 32 位的 UTF-16 字符（Unicode 编号大于0xFFFF）。

```
String.fromCharCode(0x20BB7)
// "ஷ"
```
上面代码中，String.fromCharCode不能识别大于0xFFFF的码点，所以0x20BB7就发生了溢出，
最高位2被舍弃了，最后返回码点U+0BB7对应的字符，而不是码点U+20BB7对应的字符。

*ES6 提供了String.fromCodePoint方法，可以识别大于0xFFFF的字符，弥补了String.fromCharCode方法的不足。
在作用上，正好与codePointAt方法相反。

```
String.fromCodePoint(0x20BB7)
// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
```

*上面代码中，如果String.fromCodePoint方法有多个参数，则它们会被合并成一个字符串返回。
注意，fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

*/


/*字符串的遍历接口 
* ES6为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。
```
  for (let codePoint of 'foo') {
      console.log(codePoint)
  }
```
* 除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，
  传统的for循环无法识别这样的码点。
*/

/*normalize() 
...
*/

/*includes(), startsWith(), endsWith()  
*传统上，js只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。es6又提供了三种方法
*includes()：返回布尔值，表示是否找到了参数字符串。
*startsWidth()：返回布尔值，表示参数字符串是否在元字符串的头部。 
*endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
*这三个方法都支持第二个参数，表示开始搜索的位置
```
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```
*endsWith的行为与其他两个方法有所不同。它针对前n个字符，
而其他两个方法针对从第n个位置直到字符串结束。
 */

 /* repeat() 
 * repeat 方法返回一个新字符串，表示将原字符串重复n次。
 */

 /* padStart(),padEnd(),es2017引入了字符串补全功能，用于头部和尾部
 * x.padStart(5,'ab') // 'ababx'
 * 多用于数值补全指定位数，或提示字符串格式
 */

 /* matchAll()
 * matchAll方法返回一个正则表达式在当前字符串的所有匹配 
 */


 /*模板字符串 
 *模板字符串是增强版的字符串，用反引号（`）标识。可用来定义多行字符串，或者在字符串中嵌入变量
 *上面代码中的模板字符串，都是用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。
 *如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。
 *模板字符串中嵌入变量，需要将变量名写在${}之中。
 *大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性。
 *模板字符串之中还能调用函数。
 *如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的toString方法。
 *如果模板字符串中的变量没有声明，将报错。
 *由于模板字符串的大括号内部，就是执行 JavaScript 代码，因此如果大括号内部是一个字符串，将会原样输出。
 * 模板字符串甚至还能嵌套。
 ```
 ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
 ```
 * 字符串函数  
 * 多语言转换（国际化处理）
 * “标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。
 * String.raw() 方法，往往用来充当模板字符串的处理函数，返回一个斜杠都会被转义
 * String.raw()方法作为处理模板字符串的基本方法，他会将所有变量替换，而且对斜杠进行转义，方便下一步作为字符串来使用。
 * String.raw方法可以最为正常函数使用。这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性对的值应该是一个数组。
 * String.raw({raw:'test'},0,1,2);
 * String.raw({raw:['t','e','s','t']},0,1,2);
 * 
 * 模板字符串的限制
 * 标签模板里面，可以内嵌其他语言。但是模板字符串默认会将字符串转义，导致无法嵌入其他语言。
 * 
 * 
 */

console.log('\n')
console.log(String.raw`\n`)