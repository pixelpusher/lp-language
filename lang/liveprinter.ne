# transpiles mini language into JavaScript
# compile with  "nearleyc liveprinter.ne -o lpgrammar.js"
# nearley 2.16.0 https://nearley.js.org

# A complete line (terminated by EOL)
Main -> Chain EOL:+ Space Main {% d => [d[0]].concat(d[3]).join(";") %} 
    | Chain Space EOL:? {% d => d[0] + ';' %}

Chain -> FunctionStatement Space PIPE Space Chain {% d => [d[0]].concat(d[4]).join(";") %} 
    | FunctionStatement Space PIPE:? {% d => d[0] %}

FunctionStatement -> (FunctionName {% 
        ([name]) => {
            const asyncFunctionsInAPIRegex = /^(ext|ext2|mov|mov2|ret|unret|gcodeEvent|gcode|printEvent|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|tempwait|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|resume|printPaths|printPathsThick|prime|bail|mainloop|loop|delay)$/;
            
            const asyncFuncCall = asyncFunctionsInAPIRegex.test(name);

            if (asyncFuncCall) name = "await lp." + name;
            else name = "lp." + name;
            return name += "("; 
        } 
    %})  ( Spaces 
    
        ( FunctionName Space "(" Space AnyArgs:? Space ")" {% ([fn,s1,p1,s2,args,s3,p2]) => fn + p1 + (Array.isArray(args) ? args.join(',') : args) + p2  %}
        | ObjArgs 
        {% 
        function ([args]) {
            return "{" + (Array.isArray(args) ? args.join(',') : args) + "}";
        }
        %}
        | AnyArgs {% 
        function ([args]) {
            return Array.isArray(args) ? args.join(',') : (args || "");
        }
        %}

     )
    {% d => { let str=""; for (let dd of d) { if (dd) str+=dd}; return str; } %}):? {% d => d.join('') + ")" %}

FunctionName -> PlainVariable {% id %}

AnyArgs -> AnyArg Spaces AnyArgs {% ([arg, ws, args]) => [arg].concat(args) %} 
| AnyArg {% id %}

ObjArgs -> ObjArg Spaces ObjArgs {% ([arg, ws, args]) => [arg].concat(args) %} 
| ObjArg {% id %}

# object arguments inside the curly braces, like { x:32 }
ObjArg    -> Letter:+ Space ArgSeparator Space AnyArg {% ([argname, ws1, separator, ws2, argVal]) => argname.join('') + separator + argVal %}

# they are the same... just to be clear
BasicStatement -> AnyArg

# valid arguments for functions
AnyArg -> MathFuncs | AnyVar 

ArrayStatement -> "[" Space BasicStatement Space "]" {% ([lparen, sp, statement, sp2, rparen]) => lparen+statement+rparen %}

ParenthesisStatement -> "(" Space BasicStatement Space ")" {% ([lparen, sp, statement, sp2, rparen]) => lparen+statement+rparen %}

MathFuncs -> MathFunc Space MathFuncs {% ([arg, ws, args]) => [arg].concat(args).join('') %} 
    | MathFunc {% id %}

# math functions
MathFunc -> AnyVar:? Space MathOps Space AnyVar {% ([var1,sp1,op,sp2,var2]) => (var1 ? var1 : "")+op+var2 %}

# array access

ArrayAccess -> (ArrayAccess | ObjectVariable | PlainVariable | ComplexVar) Spaces ArrayStatement 
{%
	([base, sp, arr]) => {
	
     return base + arr;
	}
%}

# --- Unified Chaining for Functions and Arrays ---

ComplexVar -> ComplexVar Space "(" Space AnyArgs:? Space ")" 
    {% 
        ([base, s1, lp, s2, args, s3, rp]) => {
            let parsedArgs = Array.isArray(args) ? args.join(',') : (args || "");
            return base + lp + parsedArgs + rp;
        }
    %}
    | ComplexVar Space ArrayStatement {% ([base, sp, arr]) => base + arr %}
    | ObjectVariable {% id %}
    | PlainVariable {% id %}

# ------------------------------------------------------------

AnyVar -> MusicNote | Number # int or float
    | ComplexVar         # <--- Replaces ArrayAccess, InlineFunction, Plain/ObjectVar
    | StringLiteral
    | ParenthesisStatement
    | ArrayStatement

# ------------------------------------------------------------

ObjectVariable -> PlainVariable DOT PlainVariable {% ([pv1, dot, pv2])=> pv1 + dot + pv2 %} 

PlainVariable -> CharOrLetter AnyValidCharacter:* {% 
    ([first, second], location, reject) => {
        const str = first + second.join('');
        // If it perfectly matches a MusicNote, reject this branch to remove ambiguity
        if (/^[\$\£\&\^\*\_\#a-zA-Z][#b]?-?(?:0|[1-9][0-9]*)$/.test(str)) {
            return reject;
        }
        return str;
    } 
%}

MusicNote -> CharOrLetter SharpOrFlat:? Integer {% ([c,sf,oct]) => `"${c + (sf || "") + oct}"`%}

StringLiteral -> "\"" [^"]:* "\"" {% ([lq, str, rq]) => lq + str.join('') + rq %}
               | "'" [^']:* "'" {% ([lq, str, rq]) => lq + str.join('') + rq %}

Number -> Integer     {% id %}
    | Float         {% id %}
    
Float -> Integer "." [0-9]:+        {% ([num1, dot, num2]) => num1 + dot + num2.join('') %}

Integer -> "-":? Zero {% ([sign, num1]) => (sign ? "-" : "") + num1 %} | 
        "-":? NonzeroNumber Digit:* {% ([sign, num1, num2]) => (sign ? "-" : "") + num1 + num2.join('') %}

MathOps -> [-*+/]

ArgSeparator -> ":"

Zero -> "0"

AnyValidCharacter -> Letter | UsableCharacter | Digit

CharOrLetter -> UsableCharacter | Letter

SharpOrFlat -> "#" | "b"

UsableCharacter -> [\$\£\&\^\*\_\#]

Letter -> [a-zA-Z]

Digit -> [0-9]

NonzeroNumber -> [1-9]

ObjectLeftBrace -> "{"

ObjectRightBrace -> "}"

EOLPIPE -> EOL | PIPE  {% function(d) {return null } %}

PIPE -> "|"

DOT -> "."

# Whitespace logic
_ -> [\s]:* {% function(d) {return null } %}
__ -> [\s]:+     {% function(d) {return null } %}
EOL -> [\r\n]    {% function(d) {return null } %}
Space -> [ ]:* {% function(d) {return null } %}
Spaces -> [ ]:+  {% function(d) {return null } %}