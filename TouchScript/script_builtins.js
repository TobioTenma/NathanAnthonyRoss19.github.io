"use strict";

function getBuiltIns() {
  let CLASSES = [
    {name: "Hidden", size: 0},
    {name: "Any", size: 0},
    {name: "Int8", size: 1},
    {name: "UInt8", size: 1},
    {name: "Int16", size: 2},
    {name: "UInt16", size: 2},
    {name: "Int32", size: 4},
    {name: "UInt32", size: 4},
    {name: "Int64", size: 8},
    {name: "UInt64", size: 8},
    {name: "Float", size: 4},
    {name: "Double", size: 8},
    {name: "System", size: 0},
    {name: "System.Event", size: 0},
    {name: "System.Screen", size: 0},
    {name: "Math", size: 0},
    {name: "Canvas", size: 0},
    {name: "Function", size: 0},
  ];
  
  let CLASS_MAP = new Map();
  for (let i = 0; i < CLASSES.length; ++i) {
    CLASS_MAP.set(CLASSES[i].name, i);
  }
  
  
  //static variables of classes only
  let VARIABLES = [
    {name: "ondraw", type: CLASS_MAP.get("Function"), scope: CLASS_MAP.get("System.Event"), js: "eventHandlers['ondraw']"},
    {name: "onresize", type: CLASS_MAP.get("Function"), scope: CLASS_MAP.get("System.Event"), js: "eventHandlers['onresize']"},
    {name: "width", type: CLASS_MAP.get("Int32"), scope: CLASS_MAP.get("System.Screen"), js: "canvas.width"},
    {name: "height", type: CLASS_MAP.get("Int32"), scope: CLASS_MAP.get("System.Screen"), js: "canvas.height"},
  ];
  
  
  function parseFunction(source, js) {
    if (!source.includes("->")) {
      source += "->Hidden";
    }
    
    let tokens = source.match(/[\w]+/g);
    
    let newFunc = {};
    newFunc.scope = CLASS_MAP.get(tokens[0]);
    newFunc.name = tokens[1];
    newFunc.returnType = CLASS_MAP.get(tokens[tokens.length - 1]);
    
    if (js)
      newFunc.js = js;
    
    newFunc.parameters = [];
    
    for (let i = 2; i < tokens.length - 1; i += 2) {
      newFunc.parameters.push({"name": tokens[i], "type": CLASS_MAP.get(tokens[i + 1])});
    }
    
    return newFunc;
  }
  
  /* The .js property prepresents the equivalent javascript function to use when translating. */
  let FUNCTIONS = [
    parseFunction("Int8.Int8(toConvert:Any) -> Int8", "Number"),
    parseFunction("UInt8.UInt8(toConvert:Any) -> UInt8", "Number"),
    parseFunction("Int16.Int16(toConvert:Any) -> Int16", "Number"),
    parseFunction("UInt16.UInt16(toConvert:Any) -> UInt16", "Number"),
    parseFunction("Int32.Int32(toConvert:Any) -> Int32", "Number"),
    parseFunction("UInt32.UInt32(toConvert:Any) -> UInt32", "Number"),
    parseFunction("Int64.Int64(toConvert:Any) -> Int64", "Number"),
    parseFunction("UInt64.UInt64(toConvert:Any) -> UInt64", "Number"),
      
    parseFunction("System.print(item:Any)", "console.log"),
    parseFunction("Canvas.drawCircle(x:Double, y:Double, r:Double)", "drawCircle"),
    parseFunction("Math.cos(theta:Double) -> Double", "Math.cos"),
    parseFunction("Math.sin(theta:Double) -> Double", "Math.sin"),
    parseFunction("Math.min(a:Double, b:Double) -> Double", "Math.min"),
    parseFunction("Math.max(a:Double, b:Double) -> Double", "Math.max"),
  ]
  
  let FUNCTION_MAP = new Map();
  for (let i = 0; i < FUNCTIONS.length; ++i) {
    let scope = CLASSES[FUNCTIONS[i].scope].name;
    let key = FUNCTIONS[i].name;
    if (scope)
      key = `${scope}.${key}`;
    
    FUNCTION_MAP.set(key, i);
  }
  
  
  
  
  const SYMBOLS = [
    "=",
    "==",
    "!=",
    "===",
    "!==",
    ">",
    ">=",
    "<",
    "<=",
    "+",
    "-",
    "*",
    "/",
    "%",
    "^",
    "&",
    "|",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "^=",
    "&=",
    "|=",
    "!",
    "&&",
    "||",
    "~",
    "(",
    ")",
    "[",
    "]",
    ".",
    ","
  ];
  
  const SYMBOL_MAP = new Map();
  for (let i = 0; i < SYMBOLS.length; ++i) {
    SYMBOL_MAP.set(SYMBOLS[i], i);
  }
  
  
  
  const KEYWORDS = [
    "func",
    "let",
    "var",
    "if",
    "for",
    "in",
    "while",
    "until",
    "switch",
    "case",
    "default",
    "return",
    "break",
    "continue",
    "true",
    "false",
  ]
  
  const JS_KEYWORDS = [
    null,
    "const",
    "let",
    "if (",
    "for (",
    "in",
    "while (",
    "until (",
    "switch (",
    "case",
    "default",
    "return",
    "break",
    "continue",
    "true",
    "false",
  ]
  
  const KEYWORD_MAP = new Map();
  for (let i = 0; i < KEYWORDS.length; ++i) {
    KEYWORD_MAP.set(KEYWORDS[i], i);
  }
  
  
  
  let sampleScript =
  `var minDim
  
  func resize {
    minDim = Math.min( System.Screen.width, System.Screen.height ) / 3
  }
  
  func draw time:Double {
    let seconds = time / 1000
    let radius = Math.sin(seconds) * minDim
    Canvas.drawCircle(System.Screen.width / 2, System.Screen.height / 2, radius)
  }
  
  System.Event.ondraw = draw
  System.Event.onresize = resize
  
  resize()
  
  /*This is an intentially ridicuously long line created with the intent to test line scrolling.  How well does it do?  Now well, I assume.  Not nearly long enough.*/`;
  
  return [CLASSES, CLASS_MAP, VARIABLES, FUNCTIONS, FUNCTION_MAP, SYMBOLS, SYMBOL_MAP, KEYWORDS, JS_KEYWORDS, KEYWORD_MAP, sampleScript];
}