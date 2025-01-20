import { Logger as g } from "liveprinter-utils";
function d(e) {
  return e[0];
}
const E = {
  Lexer: void 0,
  ParserRules: [
    { name: "Main$ebnf$1", symbols: ["EOL"] },
    { name: "Main$ebnf$1", symbols: ["Main$ebnf$1", "EOL"], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "Main", symbols: ["Chain", "Main$ebnf$1", "Space", "Main"], postprocess: (e) => [e[0]].concat(e[3]).join(";") },
    { name: "Main$ebnf$2", symbols: ["EOL"], postprocess: d },
    { name: "Main$ebnf$2", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Main", symbols: ["Chain", "Space", "Main$ebnf$2"], postprocess: (e) => e[0] + ";" },
    { name: "Chain", symbols: ["FunctionStatement", "Space", "PIPE", "Space", "Chain"], postprocess: (e) => [e[0]].concat(e[4]).join(";") },
    { name: "Chain$ebnf$1", symbols: ["PIPE"], postprocess: d },
    { name: "Chain$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Chain", symbols: ["FunctionStatement", "Space", "Chain$ebnf$1"], postprocess: (e) => e[0] },
    {
      name: "FunctionStatement$subexpression$1",
      symbols: ["FunctionName"],
      postprocess: ([e]) => (/^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)$/.test(e) ? e = "await lp." + e : e = "lp." + e, e += "(")
    },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", symbols: ["AnyArgs"], postprocess: d },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1", symbols: ["FunctionName", "Space", { literal: "(" }, "Space", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "Space", { literal: ")" }], postprocess: ([e, r, a, f, p, b, c]) => e + a + (Array.isArray(p) ? p.join(",") : p) + c },
    {
      name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1",
      symbols: ["ObjArgs"],
      postprocess: function([e]) {
        let r = "{";
        if (typeof e != "string")
          for (let a = 0; a < e.length; a++) {
            let f = e[a];
            r += f, a - (e.length - 1) && (r += ",");
          }
        else r += e;
        return r += "}", r;
      }
    },
    {
      name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1",
      symbols: ["AnyArgs"],
      postprocess: function([e]) {
        let r = "";
        if (e.length)
          for (let a = 0; a < e.length; a++) {
            let f = e[a];
            r += f, a - (e.length - 1) && (r += ",");
          }
        return r;
      }
    },
    { name: "FunctionStatement$ebnf$1$subexpression$1", symbols: ["Spaces", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1"], postprocess: (e) => {
      let r = "";
      for (let a of e)
        a && (r += a);
      return r;
    } },
    { name: "FunctionStatement$ebnf$1", symbols: ["FunctionStatement$ebnf$1$subexpression$1"], postprocess: d },
    { name: "FunctionStatement$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "FunctionStatement", symbols: ["FunctionStatement$subexpression$1", "FunctionStatement$ebnf$1"], postprocess: (e) => e.join("") + ")" },
    { name: "FunctionName", symbols: ["PlainVariable"] },
    { name: "FunctionName", symbols: ["ObjectVariable"], postprocess: d },
    { name: "AnyArgs", symbols: ["AnyArg", "Spaces", "AnyArgs"], postprocess: ([e, r, a]) => [e].concat(a) },
    { name: "AnyArgs", symbols: ["AnyArg"], postprocess: d },
    { name: "ObjArgs", symbols: ["ObjArg", "Spaces", "ObjArgs"], postprocess: ([e, r, a]) => [e].concat(a) },
    { name: "ObjArgs", symbols: ["ObjArg"], postprocess: d },
    { name: "ObjArg$ebnf$1", symbols: ["Letter"] },
    { name: "ObjArg$ebnf$1", symbols: ["ObjArg$ebnf$1", "Letter"], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "ObjArg", symbols: ["ObjArg$ebnf$1", "Space", "ArgSeparator", "Space", "AnyArg"], postprocess: ([e, r, a, f, p]) => e.join("") + a + p },
    { name: "AnyArg", symbols: ["AnyVar"] },
    { name: "AnyArg", symbols: ["ParenthesisStatement"] },
    { name: "AnyArg", symbols: ["MathFuncs"] },
    { name: "ParenthesisStatement", symbols: [{ literal: "(" }, "Space", "BasicStatement", "Space", { literal: ")" }], postprocess: ([e, r, a, f, p]) => e + a + p },
    { name: "BasicStatement", symbols: ["AnyVar"] },
    { name: "BasicStatement", symbols: ["MathFuncs"] },
    { name: "MathFuncs", symbols: ["MathFunc", "Space", "MathFuncs"], postprocess: ([e, r, a]) => [e].concat(a).join("") },
    { name: "MathFuncs", symbols: ["MathFunc"], postprocess: d },
    { name: "MathFunc$ebnf$1", symbols: ["AnyVar"], postprocess: d },
    { name: "MathFunc$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "MathFunc", symbols: ["MathFunc$ebnf$1", "Space", "MathOps", "Space", "AnyVar"], postprocess: ([e, r, a, f, p]) => (e || "") + a + p },
    { name: "AnyVar", symbols: ["Number"] },
    { name: "AnyVar", symbols: ["PlainVariable"] },
    { name: "AnyVar", symbols: ["ObjectVariable"] },
    { name: "AnyVar", symbols: ["StringLiteral"] },
    { name: "AnyVar", symbols: ["ParenthesisStatement"] },
    { name: "ObjectVariable", symbols: ["PlainVariable", "DOT", "PlainVariable"], postprocess: ([e, r, a]) => e + r + a },
    { name: "PlainVariable$ebnf$1", symbols: [] },
    { name: "PlainVariable$ebnf$1", symbols: ["PlainVariable$ebnf$1", "AnyValidCharacter"], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "PlainVariable", symbols: ["CharOrLetter", "PlainVariable$ebnf$1"], postprocess: ([e, r]) => e + r.join("") },
    { name: "StringLiteral$ebnf$1", symbols: [] },
    { name: "StringLiteral$ebnf$1", symbols: ["StringLiteral$ebnf$1", /[^|]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "StringLiteral", symbols: ["QUOTE", "StringLiteral$ebnf$1", "QUOTE"], postprocess: ([e, r, a]) => e + r.join("") + a },
    { name: "Number", symbols: ["Integer"], postprocess: d },
    { name: "Number", symbols: ["Float"], postprocess: d },
    { name: "Float$ebnf$1", symbols: [/[0-9]/] },
    { name: "Float$ebnf$1", symbols: ["Float$ebnf$1", /[0-9]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "Float", symbols: ["Integer", { literal: "." }, "Float$ebnf$1"], postprocess: ([e, r, a]) => e + r + a.join("") },
    { name: "Integer$ebnf$1", symbols: [{ literal: "-" }], postprocess: d },
    { name: "Integer$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Integer", symbols: ["Integer$ebnf$1", "Zero"], postprocess: ([e, r]) => (e ? "-" : "") + r },
    { name: "Integer$ebnf$2", symbols: [{ literal: "-" }], postprocess: d },
    { name: "Integer$ebnf$2", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Integer$ebnf$3", symbols: [] },
    { name: "Integer$ebnf$3", symbols: ["Integer$ebnf$3", "Digit"], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "Integer", symbols: ["Integer$ebnf$2", "NonzeroNumber", "Integer$ebnf$3"], postprocess: ([e, r, a]) => (e ? "-" : "") + r + a.join("") },
    { name: "MathOps", symbols: [/[*+-/]/] },
    { name: "ArgSeparator", symbols: [{ literal: ":" }] },
    { name: "Zero", symbols: [{ literal: "0" }] },
    { name: "AnyValidCharacter", symbols: ["Letter"] },
    { name: "AnyValidCharacter", symbols: ["UsableCharacter"] },
    { name: "AnyValidCharacter", symbols: ["Digit"] },
    { name: "CharOrLetter", symbols: ["UsableCharacter"] },
    { name: "CharOrLetter", symbols: ["Letter"] },
    { name: "UsableCharacter", symbols: [/[\$\£\&\^\*\_\#]/] },
    { name: "Letter", symbols: [/[a-zA-Z]/] },
    { name: "Digit", symbols: [/[0-9]/] },
    { name: "NonzeroNumber", symbols: [/[1-9]/] },
    { name: "ObjectLeftBrace", symbols: [{ literal: "{" }] },
    { name: "ObjectRightBrace", symbols: [{ literal: "}" }] },
    { name: "EOLPIPE", symbols: ["EOL"] },
    { name: "EOLPIPE", symbols: ["PIPE"], postprocess: function(e) {
      return null;
    } },
    { name: "PIPE", symbols: [{ literal: "|" }] },
    { name: "DOT", symbols: [{ literal: "." }] },
    { name: "QUOTE", symbols: [{ literal: '"' }] },
    { name: "QUOTE", symbols: [{ literal: "'" }] },
    { name: "_$ebnf$1", symbols: [] },
    { name: "_$ebnf$1", symbols: ["_$ebnf$1", /[\s]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "_", symbols: ["_$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "__$ebnf$1", symbols: [/[\s]/] },
    { name: "__$ebnf$1", symbols: ["__$ebnf$1", /[\s]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "__", symbols: ["__$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "EOL", symbols: [/[\r\n]/], postprocess: function(e) {
      return null;
    } },
    { name: "Space$ebnf$1", symbols: [] },
    { name: "Space$ebnf$1", symbols: ["Space$ebnf$1", /[ ]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "Space", symbols: ["Space$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "Spaces$ebnf$1", symbols: [/[ ]/] },
    { name: "Spaces$ebnf$1", symbols: ["Spaces$ebnf$1", /[ ]/], postprocess: function(r) {
      return r[0].concat([r[1]]);
    } },
    { name: "Spaces", symbols: ["Spaces$ebnf$1"], postprocess: function(e) {
      return null;
    } }
  ],
  ParserStart: "Main"
};
typeof module < "u" && typeof module.exports < "u" ? module.exports = E : window.grammar = E;
function M(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var F = { exports: {} }, I = F.exports, P;
function L() {
  return P || (P = 1, function(e) {
    (function(r, a) {
      e.exports ? e.exports = a() : r.nearley = a();
    })(I, function() {
      function r(t, n, s) {
        return this.id = ++r.highestId, this.name = t, this.symbols = n, this.postprocess = s, this;
      }
      r.highestId = 0, r.prototype.toString = function(t) {
        var n = typeof t > "u" ? this.symbols.map($).join(" ") : this.symbols.slice(0, t).map($).join(" ") + " ● " + this.symbols.slice(t).map($).join(" ");
        return this.name + " → " + n;
      };
      function a(t, n, s, o) {
        this.rule = t, this.dot = n, this.reference = s, this.data = [], this.wantedBy = o, this.isComplete = this.dot === t.symbols.length;
      }
      a.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
      }, a.prototype.nextState = function(t) {
        var n = new a(this.rule, this.dot + 1, this.reference, this.wantedBy);
        return n.left = this, n.right = t, n.isComplete && (n.data = n.build(), n.right = void 0), n;
      }, a.prototype.build = function() {
        var t = [], n = this;
        do
          t.push(n.right.data), n = n.left;
        while (n.left);
        return t.reverse(), t;
      }, a.prototype.finish = function() {
        this.rule.postprocess && (this.data = this.rule.postprocess(this.data, this.reference, c.fail));
      };
      function f(t, n) {
        this.grammar = t, this.index = n, this.states = [], this.wants = {}, this.scannable = [], this.completed = {};
      }
      f.prototype.process = function(t) {
        for (var n = this.states, s = this.wants, o = this.completed, l = 0; l < n.length; l++) {
          var i = n[l];
          if (i.isComplete) {
            if (i.finish(), i.data !== c.fail) {
              for (var h = i.wantedBy, u = h.length; u--; ) {
                var y = h[u];
                this.complete(y, i);
              }
              if (i.reference === this.index) {
                var m = i.rule.name;
                (this.completed[m] = this.completed[m] || []).push(i);
              }
            }
          } else {
            var m = i.rule.symbols[i.dot];
            if (typeof m != "string") {
              this.scannable.push(i);
              continue;
            }
            if (s[m]) {
              if (s[m].push(i), o.hasOwnProperty(m))
                for (var v = o[m], u = 0; u < v.length; u++) {
                  var x = v[u];
                  this.complete(i, x);
                }
            } else
              s[m] = [i], this.predict(m);
          }
        }
      }, f.prototype.predict = function(t) {
        for (var n = this.grammar.byName[t] || [], s = 0; s < n.length; s++) {
          var o = n[s], l = this.wants[t], i = new a(o, 0, this.index, l);
          this.states.push(i);
        }
      }, f.prototype.complete = function(t, n) {
        var s = t.nextState(n);
        this.states.push(s);
      };
      function p(t, n) {
        this.rules = t, this.start = n || this.rules[0].name;
        var s = this.byName = {};
        this.rules.forEach(function(o) {
          s.hasOwnProperty(o.name) || (s[o.name] = []), s[o.name].push(o);
        });
      }
      p.fromCompiled = function(o, n) {
        var s = o.Lexer;
        o.ParserStart && (n = o.ParserStart, o = o.ParserRules);
        var o = o.map(function(i) {
          return new r(i.name, i.symbols, i.postprocess);
        }), l = new p(o, n);
        return l.lexer = s, l;
      };
      function b() {
        this.reset("");
      }
      b.prototype.reset = function(t, n) {
        this.buffer = t, this.index = 0, this.line = n ? n.line : 1, this.lastLineBreak = n ? -n.col : 0;
      }, b.prototype.next = function() {
        if (this.index < this.buffer.length) {
          var t = this.buffer[this.index++];
          return t === `
` && (this.line += 1, this.lastLineBreak = this.index), { value: t };
        }
      }, b.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak
        };
      }, b.prototype.formatError = function(t, n) {
        var s = this.buffer;
        if (typeof s == "string") {
          var o = s.split(`
`).slice(
            Math.max(0, this.line - 5),
            this.line
          ), l = s.indexOf(`
`, this.index);
          l === -1 && (l = s.length);
          var i = this.index - this.lastLineBreak, h = String(this.line).length;
          return n += " at line " + this.line + " col " + i + `:

`, n += o.map(function(y, m) {
            return u(this.line - o.length + m + 1, h) + " " + y;
          }, this).join(`
`), n += `
` + u("", h + i) + `^
`, n;
        } else
          return n + " at index " + (this.index - 1);
        function u(y, m) {
          var v = String(y);
          return Array(m - v.length + 1).join(" ") + v;
        }
      };
      function c(t, n, s) {
        if (t instanceof p)
          var o = t, s = n;
        else
          var o = p.fromCompiled(t, n);
        this.grammar = o, this.options = {
          keepHistory: !1,
          lexer: o.lexer || new b()
        };
        for (var l in s || {})
          this.options[l] = s[l];
        this.lexer = this.options.lexer, this.lexerState = void 0;
        var i = new f(o, 0);
        this.table = [i], i.wants[o.start] = [], i.predict(o.start), i.process(), this.current = 0;
      }
      c.fail = {}, c.prototype.feed = function(t) {
        var n = this.lexer;
        n.reset(t, this.lexerState);
        for (var s; ; ) {
          try {
            if (s = n.next(), !s)
              break;
          } catch (O) {
            var h = new f(this.grammar, this.current + 1);
            this.table.push(h);
            var o = new Error(this.reportLexerError(O));
            throw o.offset = this.current, o.token = O.token, o;
          }
          var l = this.table[this.current];
          this.options.keepHistory || delete this.table[this.current - 1];
          var i = this.current + 1, h = new f(this.grammar, i);
          this.table.push(h);
          for (var u = s.text !== void 0 ? s.text : s.value, y = n.constructor === b ? s.value : s, m = l.scannable, v = m.length; v--; ) {
            var x = m[v], w = x.rule.symbols[x.dot];
            if (w.test ? w.test(y) : w.type ? w.type === s.type : w.literal === u) {
              var j = x.nextState({ data: y, token: s, isToken: !0, reference: i - 1 });
              h.states.push(j);
            }
          }
          if (h.process(), h.states.length === 0) {
            var o = new Error(this.reportError(s));
            throw o.offset = this.current, o.token = s, o;
          }
          this.options.keepHistory && (l.lexerState = n.save()), this.current++;
        }
        return l && (this.lexerState = n.save()), this.results = this.finish(), this;
      }, c.prototype.reportLexerError = function(t) {
        var n, s, o = t.token;
        return o ? (n = "input " + JSON.stringify(o.text[0]) + " (lexer error)", s = this.lexer.formatError(o, "Syntax error")) : (n = "input (lexer error)", s = t.message), this.reportErrorCommon(s, n);
      }, c.prototype.reportError = function(t) {
        var n = (t.type ? t.type + " token: " : "") + JSON.stringify(t.value !== void 0 ? t.value : t), s = this.lexer.formatError(t, "Syntax error");
        return this.reportErrorCommon(s, n);
      }, c.prototype.reportErrorCommon = function(t, n) {
        var s = [];
        s.push(t);
        var o = this.table.length - 2, l = this.table[o], i = l.states.filter(function(u) {
          var y = u.rule.symbols[u.dot];
          return y && typeof y != "string";
        });
        if (i.length === 0)
          s.push("Unexpected " + n + `. I did not expect any more input. Here is the state of my parse table:
`), this.displayStateStack(l.states, s);
        else {
          s.push("Unexpected " + n + `. Instead, I was expecting to see one of the following:
`);
          var h = i.map(function(u) {
            return this.buildFirstStateStack(u, []) || [u];
          }, this);
          h.forEach(function(u) {
            var y = u[0], m = y.rule.symbols[y.dot], v = this.getSymbolDisplay(m);
            s.push("A " + v + " based on:"), this.displayStateStack(u, s);
          }, this);
        }
        return s.push(""), s.join(`
`);
      }, c.prototype.displayStateStack = function(t, n) {
        for (var s, o = 0, l = 0; l < t.length; l++) {
          var i = t[l], h = i.rule.toString(i.dot);
          h === s ? o++ : (o > 0 && n.push("    ^ " + o + " more lines identical to this"), o = 0, n.push("    " + h)), s = h;
        }
      }, c.prototype.getSymbolDisplay = function(t) {
        return S(t);
      }, c.prototype.buildFirstStateStack = function(t, n) {
        if (n.indexOf(t) !== -1)
          return null;
        if (t.wantedBy.length === 0)
          return [t];
        var s = t.wantedBy[0], o = [t].concat(n), l = this.buildFirstStateStack(s, o);
        return l === null ? null : [t].concat(l);
      }, c.prototype.save = function() {
        var t = this.table[this.current];
        return t.lexerState = this.lexerState, t;
      }, c.prototype.restore = function(t) {
        var n = t.index;
        this.current = n, this.table[n] = t, this.table.splice(n + 1), this.lexerState = t.lexerState, this.results = this.finish();
      }, c.prototype.rewind = function(t) {
        if (!this.options.keepHistory)
          throw new Error("set option `keepHistory` to enable rewinding");
        this.restore(this.table[t]);
      }, c.prototype.finish = function() {
        var t = [], n = this.grammar.start, s = this.table[this.table.length - 1];
        return s.states.forEach(function(o) {
          o.rule.name === n && o.dot === o.rule.symbols.length && o.reference === 0 && o.data !== c.fail && t.push(o);
        }), t.map(function(o) {
          return o.data;
        });
      };
      function S(t) {
        var n = typeof t;
        if (n === "string")
          return t;
        if (n === "object") {
          if (t.literal)
            return JSON.stringify(t.literal);
          if (t instanceof RegExp)
            return "character matching " + t;
          if (t.type)
            return t.type + " token";
          if (t.test)
            return "token matching " + String(t.test);
          throw new Error("Unknown symbol type: " + t);
        }
      }
      function $(t) {
        var n = typeof t;
        if (n === "string")
          return t;
        if (n === "object") {
          if (t.literal)
            return JSON.stringify(t.literal);
          if (t instanceof RegExp)
            return t.toString();
          if (t.type)
            return "%" + t.type;
          if (t.test)
            return "<" + String(t.test) + ">";
          throw new Error("Unknown symbol type: " + t);
        }
      }
      return {
        Parser: c,
        Grammar: p,
        Rule: r
      };
    });
  }(F)), F.exports;
}
var k = L();
const A = /* @__PURE__ */ M(k), V = /(?:\n|\t|\s)*\#{2}\s*((?:.|\n|\t|\s)*)\#{2}/g, _ = /(?:\n|\t|\s)*\#\s*((?:[^\n])*)/g, R = /([\n\s])*lp(\.)/g;
function B(e, r) {
  const a = new A.Parser(A.Grammar.fromCompiled(E)), f = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  return e = e.replace(f, (p, b) => b), e = e.replace(/^[ ]*global[ ]+/gm, "window."), g.debug("code before pre-processing-------------------------------"), g.debug(e), g.debug("========================= -------------------------------"), e = e.replace(V, (p, b) => {
    g.debug("Match: " + b);
    let c = "";
    return b.split(/[\r\n]/).map(($) => {
      $ = $.replace(/([\r\n]+)/gm, "").replace(/(^[\s]+)/, ""), $.length !== 0 && a.feed($ + `
`);
    }), c += a.results[0], " " + c + `
`;
  }), g.info("code AFTER block-grammar processing -------------------------------"), g.info(e), g.info("========================= -------------------------------"), e = e.replace(_, (p, b, c) => {
    const S = new A.Parser(A.Grammar.fromCompiled(E));
    g.debug("!!!" + p + "!!!"), g.debug("!!!" + b + "!!!");
    let $ = "", t = b.replace(/([\r\n]+)/gm, "").replace(/([\s]+)$/, "");
    return t && (S.feed(t + `
`), $ = S.results[0]), " " + $;
  }), r && (e = e.replace(R, `$1${r}$2`)), g.debug("code AFTER one-line-grammar processing -------------------------------"), g.debug(e), g.debug("========================= -------------------------------"), e;
}
const C = /^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)[^a-zA-Z0-9\_]/;
function D(e) {
  e.defineMode("lp", function(r, a) {
    const f = {
      token: function(p, b) {
        let c = "";
        if (!p.eol()) {
          let S = p.match(C, !1);
          if (S) {
            let $ = S[1].length;
            for (; $--; ) p.eat(() => !0);
            return "lp";
          }
        }
        if (p.eatSpace(), p.match(C, !1)) return null;
        for (; (c = p.eat(/[^\s]/)) && c !== "."; )
          ;
        return null;
      }
    };
    return e.overlayMode(e.getMode(r, a.backdrop || "javascript"), f);
  });
}
export {
  D as addCMMode,
  B as transpile
};
