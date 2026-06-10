// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main$ebnf$1", "symbols": ["EOL"]},
    {"name": "Main$ebnf$1", "symbols": ["Main$ebnf$1", "EOL"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Main", "symbols": ["Chain", "Main$ebnf$1", "Space", "Main"], "postprocess": d => [d[0]].concat(d[3]).join(";")},
    {"name": "Main$ebnf$2", "symbols": ["EOL"], "postprocess": id},
    {"name": "Main$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Main", "symbols": ["Chain", "Space", "Main$ebnf$2"], "postprocess": d => d[0] + ';'},
    {"name": "Chain", "symbols": ["FunctionStatement", "Space", "PIPE", "Space", "Chain"], "postprocess": d => [d[0]].concat(d[4]).join(";")},
    {"name": "Chain$ebnf$1", "symbols": ["PIPE"], "postprocess": id},
    {"name": "Chain$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Chain", "symbols": ["FunctionStatement", "Space", "Chain$ebnf$1"], "postprocess": d => d[0]},
    {"name": "FunctionStatement$subexpression$1", "symbols": ["FunctionName"], "postprocess":  
        ([name]) => {
            const asyncFunctionsInAPIRegex = /^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)$/;
            
            const asyncFuncCall = asyncFunctionsInAPIRegex.test(name);
        
            if (asyncFuncCall) name = "await lp." + name;
            else name = "lp." + name;
            return name += "("; 
        } 
            },
    {"name": "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": ["AnyArgs"], "postprocess": id},
    {"name": "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FunctionStatement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["FunctionName", "Space", {"literal":"("}, "Space", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "Space", {"literal":")"}], "postprocess": ([fn,s1,p1,s2,args,s3,p2]) => fn + p1 + (Array.isArray(args) ? args.join(',') : args) + p2},
    {"name": "FunctionStatement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["ObjArgs"], "postprocess":  
        function ([args]) {
            return "{" + (Array.isArray(args) ? args.join(',') : args) + "}";
        }
        },
    {"name": "FunctionStatement$ebnf$1$subexpression$1$subexpression$1", "symbols": ["AnyArgs"], "postprocess":  
        function ([args]) {
            return Array.isArray(args) ? args.join(',') : (args || "");
        }
        },
    {"name": "FunctionStatement$ebnf$1$subexpression$1", "symbols": ["Spaces", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1"], "postprocess": d => { let str=""; for (let dd of d) { if (dd) str+=dd}; return str; }},
    {"name": "FunctionStatement$ebnf$1", "symbols": ["FunctionStatement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "FunctionStatement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "FunctionStatement", "symbols": ["FunctionStatement$subexpression$1", "FunctionStatement$ebnf$1"], "postprocess": d => d.join('') + ")"},
    {"name": "FunctionName", "symbols": ["PlainVariable"], "postprocess": id},
    {"name": "AnyArgs", "symbols": ["AnyArg", "Spaces", "AnyArgs"], "postprocess": ([arg, ws, args]) => [arg].concat(args)},
    {"name": "AnyArgs", "symbols": ["AnyArg"], "postprocess": id},
    {"name": "ObjArgs", "symbols": ["ObjArg", "Spaces", "ObjArgs"], "postprocess": ([arg, ws, args]) => [arg].concat(args)},
    {"name": "ObjArgs", "symbols": ["ObjArg"], "postprocess": id},
    {"name": "ObjArg$ebnf$1", "symbols": ["Letter"]},
    {"name": "ObjArg$ebnf$1", "symbols": ["ObjArg$ebnf$1", "Letter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ObjArg", "symbols": ["ObjArg$ebnf$1", "Space", "ArgSeparator", "Space", "AnyArg"], "postprocess": ([argname, ws1, separator, ws2, argVal]) => argname.join('') + separator + argVal},
    {"name": "BasicStatement", "symbols": ["AnyArg"]},
    {"name": "AnyArg", "symbols": ["MathFuncs"]},
    {"name": "AnyArg", "symbols": ["AnyVar"]},
    {"name": "ArrayStatement", "symbols": [{"literal":"["}, "Space", "BasicStatement", "Space", {"literal":"]"}], "postprocess": ([lparen, sp, statement, sp2, rparen]) => lparen+statement+rparen},
    {"name": "ParenthesisStatement", "symbols": [{"literal":"("}, "Space", "BasicStatement", "Space", {"literal":")"}], "postprocess": ([lparen, sp, statement, sp2, rparen]) => lparen+statement+rparen},
    {"name": "MathFuncs", "symbols": ["MathFunc", "Space", "MathFuncs"], "postprocess": ([arg, ws, args]) => [arg].concat(args).join('')},
    {"name": "MathFuncs", "symbols": ["MathFunc"], "postprocess": id},
    {"name": "MathFunc$ebnf$1", "symbols": ["AnyVar"], "postprocess": id},
    {"name": "MathFunc$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "MathFunc", "symbols": ["MathFunc$ebnf$1", "Space", "MathOps", "Space", "AnyVar"], "postprocess": ([var1,sp1,op,sp2,var2]) => (var1 ? var1 : "")+op+var2},
    {"name": "ArrayAccess$subexpression$1", "symbols": ["ArrayAccess"]},
    {"name": "ArrayAccess$subexpression$1", "symbols": ["ObjectVariable"]},
    {"name": "ArrayAccess$subexpression$1", "symbols": ["PlainVariable"]},
    {"name": "ArrayAccess$subexpression$1", "symbols": ["ComplexVar"]},
    {"name": "ArrayAccess", "symbols": ["ArrayAccess$subexpression$1", "Spaces", "ArrayStatement"], "postprocess": 
        ([base, sp, arr]) => {
        
             return base + arr;
        }
        },
    {"name": "ComplexVar$ebnf$1", "symbols": ["AnyArgs"], "postprocess": id},
    {"name": "ComplexVar$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ComplexVar", "symbols": ["ComplexVar", "Space", {"literal":"("}, "Space", "ComplexVar$ebnf$1", "Space", {"literal":")"}], "postprocess":  
        ([base, s1, lp, s2, args, s3, rp]) => {
            let parsedArgs = Array.isArray(args) ? args.join(',') : (args || "");
            return base + lp + parsedArgs + rp;
        }
            },
    {"name": "ComplexVar", "symbols": ["ComplexVar", "Space", "ArrayStatement"], "postprocess": ([base, sp, arr]) => base + arr},
    {"name": "ComplexVar", "symbols": ["ObjectVariable"], "postprocess": id},
    {"name": "ComplexVar", "symbols": ["PlainVariable"], "postprocess": id},
    {"name": "AnyVar", "symbols": ["MusicNote"]},
    {"name": "AnyVar", "symbols": ["Number"]},
    {"name": "AnyVar", "symbols": ["ComplexVar"]},
    {"name": "AnyVar", "symbols": ["StringLiteral"]},
    {"name": "AnyVar", "symbols": ["ParenthesisStatement"]},
    {"name": "AnyVar", "symbols": ["ArrayStatement"]},
    {"name": "ObjectVariable", "symbols": ["PlainVariable", "DOT", "PlainVariable"], "postprocess": ([pv1, dot, pv2])=> pv1 + dot + pv2},
    {"name": "PlainVariable$ebnf$1", "symbols": []},
    {"name": "PlainVariable$ebnf$1", "symbols": ["PlainVariable$ebnf$1", "AnyValidCharacter"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "PlainVariable", "symbols": ["CharOrLetter", "PlainVariable$ebnf$1"], "postprocess": ([first, second])=> first + second.join('')},
    {"name": "MusicNote$ebnf$1", "symbols": ["SharpOrFlat"], "postprocess": id},
    {"name": "MusicNote$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "MusicNote", "symbols": ["CharOrLetter", "MusicNote$ebnf$1", "Integer"], "postprocess": ([c,sf,oct]) => `"${c + (sf || "") + oct}"`},
    {"name": "StringLiteral$ebnf$1", "symbols": []},
    {"name": "StringLiteral$ebnf$1", "symbols": ["StringLiteral$ebnf$1", /[^"]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"\""}, "StringLiteral$ebnf$1", {"literal":"\""}], "postprocess": ([lq, str, rq]) => lq + str.join('') + rq},
    {"name": "StringLiteral$ebnf$2", "symbols": []},
    {"name": "StringLiteral$ebnf$2", "symbols": ["StringLiteral$ebnf$2", /[^']/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringLiteral", "symbols": [{"literal":"'"}, "StringLiteral$ebnf$2", {"literal":"'"}], "postprocess": ([lq, str, rq]) => lq + str.join('') + rq},
    {"name": "Number", "symbols": ["Integer"], "postprocess": id},
    {"name": "Number", "symbols": ["Float"], "postprocess": id},
    {"name": "Float$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "Float$ebnf$1", "symbols": ["Float$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Float", "symbols": ["Integer", {"literal":"."}, "Float$ebnf$1"], "postprocess": ([num1, dot, num2]) => num1 + dot + num2.join('')},
    {"name": "Integer$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "Integer$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Integer", "symbols": ["Integer$ebnf$1", "Zero"], "postprocess": ([sign, num1]) => (sign ? "-" : "") + num1},
    {"name": "Integer$ebnf$2", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "Integer$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Integer$ebnf$3", "symbols": []},
    {"name": "Integer$ebnf$3", "symbols": ["Integer$ebnf$3", "Digit"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Integer", "symbols": ["Integer$ebnf$2", "NonzeroNumber", "Integer$ebnf$3"], "postprocess": ([sign, num1, num2]) => (sign ? "-" : "") + num1 + num2.join('')},
    {"name": "MathOps", "symbols": [/[*+-/]/]},
    {"name": "ArgSeparator", "symbols": [{"literal":":"}]},
    {"name": "Zero", "symbols": [{"literal":"0"}]},
    {"name": "AnyValidCharacter", "symbols": ["Letter"]},
    {"name": "AnyValidCharacter", "symbols": ["UsableCharacter"]},
    {"name": "AnyValidCharacter", "symbols": ["Digit"]},
    {"name": "CharOrLetter", "symbols": ["UsableCharacter"]},
    {"name": "CharOrLetter", "symbols": ["Letter"]},
    {"name": "SharpOrFlat", "symbols": [{"literal":"#"}]},
    {"name": "SharpOrFlat", "symbols": [{"literal":"b"}]},
    {"name": "UsableCharacter", "symbols": [/[\$\£\&\^\*\_\#]/]},
    {"name": "Letter", "symbols": [/[a-zA-Z]/]},
    {"name": "Digit", "symbols": [/[0-9]/]},
    {"name": "NonzeroNumber", "symbols": [/[1-9]/]},
    {"name": "ObjectLeftBrace", "symbols": [{"literal":"{"}]},
    {"name": "ObjectRightBrace", "symbols": [{"literal":"}"}]},
    {"name": "EOLPIPE", "symbols": ["EOL"]},
    {"name": "EOLPIPE", "symbols": ["PIPE"], "postprocess": function(d) {return null }},
    {"name": "PIPE", "symbols": [{"literal":"|"}]},
    {"name": "DOT", "symbols": [{"literal":"."}]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null }},
    {"name": "EOL", "symbols": [/[\r\n]/], "postprocess": function(d) {return null }},
    {"name": "Space$ebnf$1", "symbols": []},
    {"name": "Space$ebnf$1", "symbols": ["Space$ebnf$1", /[ ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Space", "symbols": ["Space$ebnf$1"], "postprocess": function(d) {return null }},
    {"name": "Spaces$ebnf$1", "symbols": [/[ ]/]},
    {"name": "Spaces$ebnf$1", "symbols": ["Spaces$ebnf$1", /[ ]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Spaces", "symbols": ["Spaces$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
