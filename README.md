# ansi-styles（ansi风格）
> 用于终端中的样式字符串的ANSI转义码
![](screenshot.png)
## 安装
```
  $ npm install ansi-styles
```
## 用法
```js
const style = require('ansi-styles');

console.log(`${style.green.open}Hello world!${style.green.close}`);


// 16/256 /真彩之间颜色转换
//注意：如果转换变为16点的颜色或256种颜色，原始颜色
//        可能降低，以适应该调色板。这意味着终端
//        不支持16万个色将最佳匹配
//        原来的颜色。
console.log(style.bgColor.ansi.hsl(120, 80, 72) + 'Hello world!' + style.bgColor.close);
console.log(style.color.ansi256.rgb(199, 20, 250) + 'Hello world!' + style.color.close);
console.log(style.color.ansi16m.hex('#ABCDEF') + 'Hello world!' + style.color.close);
```
## API

每种样式都有一个open和close 

## 样式

### 修饰符

- `reset`
- `bold`
- `dim`
- `italic` *(没有广泛支持)*
- `underline`
- `inverse`
- `hidden`
- `strikethrough` *(没有广泛支持)*

### Colors（颜色）

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` ("亮黑")
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

### Background colors（背景颜色）

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgBlackBright`
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`

## Source
[ansi-style index.js 源码](https://github.com/shichenxiao/nodejs-result/blob/master/index.js) 
[ansi-style index.js 源码解读全文注释版](https://github.com/shichenxiao/nodejs-result/blob/master/node.js)
