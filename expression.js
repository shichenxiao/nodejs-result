//使用严格模式
'use strict';
//引入第三方模块：颜色转换器
const colorConvert = require('color-convert'); 
/*
* 颜色转换（返回16色颜色） SGR参数30-37选择前景色，而40-47选择背景
* @param  [function] fn 
* @param  [function] offset 偏移量
* \u001B 转义字符：
* ${}EL表达式取值
* 使用了ES6中箭头表达式
*/
const wrapAnsi16 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments); 
	return `\u001B[${code + offset}m`;
};
/*
* 颜色转换（返回256色背景颜色）
* @param  [function] fn 
* @param  [function] offset 偏移量
*/
const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};5;${code}m`;
};
/*
* 颜色转换（返回rgb背景颜色）
* @param  [function] fn 
* @param  [function] offset 偏移量
*/
const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};
/*
* 
* @param  [function] fn 
* @param  [function] offset 偏移量
*/
function assembleStyles() {
	const codes = new Map();  //map函数（是一种更完善的Hash结构实现）：键值对的集合
	const styles = {
		modifier: {   //修饰符  SGR参数
			reset: [0, 0], //重置
			// 21 isn't widely supported and 22 does the same thing  （21和22都没有得到广泛支持）
			bold: [1, 22],//[加粗,正常]
			dim: [2, 22],//[变暗,正常颜色]
			italic: [3, 23],//[斜体,不倾斜]
			underline: [4, 24],//[下划线,不加下划线]
			inverse: [7, 27],//[反色,不进行反色]
			hidden: [8, 28],//[隐藏,不隐藏]
			strikethrough: [9, 29] //[删除线,不加删除线]
		},
		color: {    //颜色 SGR参数   [颜色FG代码,默认的前景色]  FG：前景色
			black: [30, 39],//黑色   
			red: [31, 39],//红色
			green: [32, 39],//绿色
			yellow: [33, 39],//黄色
			blue: [34, 39],//蓝色
			magenta: [35, 39],//品红色
			cyan: [36, 39],//青色
			white: [37, 39],//白色
			gray: [90, 39],//灰色

			// Bright color
			redBright: [91, 39],//明亮的红色
			greenBright: [92, 39],//明亮的绿色
			yellowBright: [93, 39],//明亮的黄色
			blueBright: [94, 39],//明亮的蓝色
			magentaBright: [95, 39],//明亮的洋红色
			cyanBright: [96, 39],//明亮的青色
			whiteBright: [97, 39]//明亮的白色
		},
		bgColor: {    //背景颜色  SGR参数  [颜色BG代码,默认的背景色]
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Fix humans
	styles.color.grey = styles.color.gray;
	/*
	* 外层for-of 循环  定义一个groupName变量
	* 作用是循环遍历styles中的对象并返回codes以及group对象 
	*/
	for (const groupName of Object.keys(styles)) {  
		const group = styles[groupName]; 
		/*
		* 内层for-of 循环  定义一个styleName变量
		* Object.keys() 方法返回modifier,color,bgcolor中的对象
		*/
		for (const styleName of Object.keys(group)) {
			const style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);//
		}
		//内层for循环结束
		/*
		* Object.defineProperty用来设置属性特征
		* 分别返回group以及codes对象
		*/
		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});

		Object.defineProperty(styles, 'codes', {
			value: codes,
			enumerable: false
		});
	}
	//外层for循环结束
	
	const rgb2rgb = (r, g, b) => [r, g, b]; //直接返回rgb数组

	styles.color.close = '\u001B[39m'; //恢复默认前景色
	styles.bgColor.close = '\u001B[49m'; //恢复默认背景色

	styles.color.ansi = {}; //在color对象增加新的空对象ansi
	styles.color.ansi256 = {}; //在color对象增加新的空对象ansi256
	styles.color.ansi16m = {//在color对象增加新的对象ansi16m
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {};//在bgcolor对象增加新的空对象ansi
	styles.bgColor.ansi256 = {};//在bgcolor对象增加新的空对象ansi256
	styles.bgColor.ansi16m = {//在bgcolor对象增加新的对象ansi16m
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};
	/*
	* for-of循环遍历colorCovert对象
	* colorCovert对象包括rgb, hsl, hsv, hwb, cmyk, ansi, ansi16,ansi256, hex , keyword 
	* suit.ansi16、suite.ansi256、suite.rgb为code
	* 使得ansi16、ansi256、ansi16m分别与colorcovert对象间的转换
	*/
	for (const key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

// Make the export immutable 暴露模块接口
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles  //读取assembleStyles函数
});
