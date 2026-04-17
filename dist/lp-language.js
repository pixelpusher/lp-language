import { Logger as d } from "liveprinter-utils";
function g(e) {
  return e[0];
}
const E = {
  Lexer: void 0,
  ParserRules: [
    { name: "Main$ebnf$1", symbols: ["EOL"] },
    { name: "Main$ebnf$1", symbols: ["Main$ebnf$1", "EOL"], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "Main", symbols: ["Chain", "Main$ebnf$1", "Space", "Main"], postprocess: (e) => [e[0]].concat(e[3]).join(";") },
    { name: "Main$ebnf$2", symbols: ["EOL"], postprocess: g },
    { name: "Main$ebnf$2", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Main", symbols: ["Chain", "Space", "Main$ebnf$2"], postprocess: (e) => e[0] + ";" },
    { name: "Chain", symbols: ["FunctionStatement", "Space", "PIPE", "Space", "Chain"], postprocess: (e) => [e[0]].concat(e[4]).join(";") },
    { name: "Chain$ebnf$1", symbols: ["PIPE"], postprocess: g },
    { name: "Chain$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Chain", symbols: ["FunctionStatement", "Space", "Chain$ebnf$1"], postprocess: (e) => e[0] },
    {
      name: "FunctionStatement$subexpression$1",
      symbols: ["FunctionName"],
      postprocess: ([e]) => (/^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)$/.test(e) ? e = "await lp." + e : e = "lp." + e, e += "(")
    },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", symbols: ["AnyArgs"], postprocess: g },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1", symbols: ["FunctionName", "Space", { literal: "(" }, "Space", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "Space", { literal: ")" }], postprocess: ([e, s, a, h, c, u, p]) => e + a + (Array.isArray(c) ? c.join(",") : c) + p },
    {
      name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1",
      symbols: ["ObjArgs"],
      postprocess: function([e]) {
        let s = "{";
        if (typeof e != "string")
          for (let a = 0; a < e.length; a++) {
            let h = e[a];
            s += h, a - (e.length - 1) && (s += ",");
          }
        else s += e;
        return s += "}", s;
      }
    },
    {
      name: "FunctionStatement$ebnf$1$subexpression$1$subexpression$1",
      symbols: ["AnyArgs"],
      postprocess: function([e]) {
        let s = "";
        if (e.length)
          for (let a = 0; a < e.length; a++) {
            let h = e[a];
            s += h, a - (e.length - 1) && (s += ",");
          }
        return s;
      }
    },
    { name: "FunctionStatement$ebnf$1$subexpression$1", symbols: ["Spaces", "FunctionStatement$ebnf$1$subexpression$1$subexpression$1"], postprocess: (e) => {
      let s = "";
      for (let a of e)
        a && (s += a);
      return s;
    } },
    { name: "FunctionStatement$ebnf$1", symbols: ["FunctionStatement$ebnf$1$subexpression$1"], postprocess: g },
    { name: "FunctionStatement$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "FunctionStatement", symbols: ["FunctionStatement$subexpression$1", "FunctionStatement$ebnf$1"], postprocess: (e) => e.join("") + ")" },
    { name: "FunctionName", symbols: ["PlainVariable"] },
    { name: "FunctionName", symbols: ["ObjectVariable"], postprocess: g },
    { name: "AnyArgs", symbols: ["AnyArg", "Spaces", "AnyArgs"], postprocess: ([e, s, a]) => [e].concat(a) },
    { name: "AnyArgs", symbols: ["AnyArg"], postprocess: g },
    { name: "ObjArgs", symbols: ["ObjArg", "Spaces", "ObjArgs"], postprocess: ([e, s, a]) => [e].concat(a) },
    { name: "ObjArgs", symbols: ["ObjArg"], postprocess: g },
    { name: "ObjArg$ebnf$1", symbols: ["Letter"] },
    { name: "ObjArg$ebnf$1", symbols: ["ObjArg$ebnf$1", "Letter"], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "ObjArg", symbols: ["ObjArg$ebnf$1", "Space", "ArgSeparator", "Space", "AnyArg"], postprocess: ([e, s, a, h, c]) => e.join("") + a + c },
    { name: "AnyArg", symbols: ["AnyVar"] },
    { name: "AnyArg", symbols: ["ParenthesisStatement"] },
    { name: "AnyArg", symbols: ["MathFuncs"] },
    { name: "ParenthesisStatement", symbols: [{ literal: "(" }, "Space", "BasicStatement", "Space", { literal: ")" }], postprocess: ([e, s, a, h, c]) => e + a + c },
    { name: "BasicStatement", symbols: ["AnyVar"] },
    { name: "BasicStatement", symbols: ["MathFuncs"] },
    { name: "MathFuncs", symbols: ["MathFunc", "Space", "MathFuncs"], postprocess: ([e, s, a]) => [e].concat(a).join("") },
    { name: "MathFuncs", symbols: ["MathFunc"], postprocess: g },
    { name: "MathFunc$ebnf$1", symbols: ["AnyVar"], postprocess: g },
    { name: "MathFunc$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "MathFunc", symbols: ["MathFunc$ebnf$1", "Space", "MathOps", "Space", "AnyVar"], postprocess: ([e, s, a, h, c]) => (e || "") + a + c },
    { name: "AnyVar", symbols: ["Number"] },
    { name: "AnyVar", symbols: ["PlainVariable"] },
    { name: "AnyVar", symbols: ["ObjectVariable"] },
    { name: "AnyVar", symbols: ["StringLiteral"] },
    { name: "AnyVar", symbols: ["ParenthesisStatement"] },
    { name: "ObjectVariable", symbols: ["PlainVariable", "DOT", "PlainVariable"], postprocess: ([e, s, a]) => e + s + a },
    { name: "PlainVariable$ebnf$1", symbols: [] },
    { name: "PlainVariable$ebnf$1", symbols: ["PlainVariable$ebnf$1", "AnyValidCharacter"], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "PlainVariable", symbols: ["CharOrLetter", "PlainVariable$ebnf$1"], postprocess: ([e, s]) => e + s.join("") },
    { name: "StringLiteral$ebnf$1", symbols: [] },
    { name: "StringLiteral$ebnf$1", symbols: ["StringLiteral$ebnf$1", /[^|]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "StringLiteral", symbols: ["QUOTE", "StringLiteral$ebnf$1", "QUOTE"], postprocess: ([e, s, a]) => e + s.join("") + a },
    { name: "Number", symbols: ["Integer"], postprocess: g },
    { name: "Number", symbols: ["Float"], postprocess: g },
    { name: "Float$ebnf$1", symbols: [/[0-9]/] },
    { name: "Float$ebnf$1", symbols: ["Float$ebnf$1", /[0-9]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "Float", symbols: ["Integer", { literal: "." }, "Float$ebnf$1"], postprocess: ([e, s, a]) => e + s + a.join("") },
    { name: "Integer$ebnf$1", symbols: [{ literal: "-" }], postprocess: g },
    { name: "Integer$ebnf$1", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Integer", symbols: ["Integer$ebnf$1", "Zero"], postprocess: ([e, s]) => (e ? "-" : "") + s },
    { name: "Integer$ebnf$2", symbols: [{ literal: "-" }], postprocess: g },
    { name: "Integer$ebnf$2", symbols: [], postprocess: function(e) {
      return null;
    } },
    { name: "Integer$ebnf$3", symbols: [] },
    { name: "Integer$ebnf$3", symbols: ["Integer$ebnf$3", "Digit"], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "Integer", symbols: ["Integer$ebnf$2", "NonzeroNumber", "Integer$ebnf$3"], postprocess: ([e, s, a]) => (e ? "-" : "") + s + a.join("") },
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
    { name: "_$ebnf$1", symbols: ["_$ebnf$1", /[\s]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "_", symbols: ["_$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "__$ebnf$1", symbols: [/[\s]/] },
    { name: "__$ebnf$1", symbols: ["__$ebnf$1", /[\s]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "__", symbols: ["__$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "EOL", symbols: [/[\r\n]/], postprocess: function(e) {
      return null;
    } },
    { name: "Space$ebnf$1", symbols: [] },
    { name: "Space$ebnf$1", symbols: ["Space$ebnf$1", /[ ]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "Space", symbols: ["Space$ebnf$1"], postprocess: function(e) {
      return null;
    } },
    { name: "Spaces$ebnf$1", symbols: [/[ ]/] },
    { name: "Spaces$ebnf$1", symbols: ["Spaces$ebnf$1", /[ ]/], postprocess: function(s) {
      return s[0].concat([s[1]]);
    } },
    { name: "Spaces", symbols: ["Spaces$ebnf$1"], postprocess: function(e) {
      return null;
    } }
  ],
  ParserStart: "Main"
};
typeof module < "u" && typeof module.exports < "u" ? module.exports = E : window.grammar = E;
function I(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var F = { exports: {} }, L = F.exports, P;
function M() {
  return P || (P = 1, function(e) {
    (function(s, a) {
      e.exports ? e.exports = a() : s.nearley = a();
    })(L, function() {
      function s(t, n, r) {
        return this.id = ++s.highestId, this.name = t, this.symbols = n, this.postprocess = r, this;
      }
      s.highestId = 0, s.prototype.toString = function(t) {
        var n = typeof t > "u" ? this.symbols.map($).join(" ") : this.symbols.slice(0, t).map($).join(" ") + " ● " + this.symbols.slice(t).map($).join(" ");
        return this.name + " → " + n;
      };
      function a(t, n, r, o) {
        this.rule = t, this.dot = n, this.reference = r, this.data = [], this.wantedBy = o, this.isComplete = this.dot === t.symbols.length;
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
        this.rule.postprocess && (this.data = this.rule.postprocess(this.data, this.reference, p.fail));
      };
      function h(t, n) {
        this.grammar = t, this.index = n, this.states = [], this.wants = {}, this.scannable = [], this.completed = {};
      }
      h.prototype.process = function(t) {
        for (var n = this.states, r = this.wants, o = this.completed, l = 0; l < n.length; l++) {
          var i = n[l];
          if (i.isComplete) {
            if (i.finish(), i.data !== p.fail) {
              for (var f = i.wantedBy, m = f.length; m--; ) {
                var y = f[m];
                this.complete(y, i);
              }
              if (i.reference === this.index) {
                var b = i.rule.name;
                (this.completed[b] = this.completed[b] || []).push(i);
              }
            }
          } else {
            var b = i.rule.symbols[i.dot];
            if (typeof b != "string") {
              this.scannable.push(i);
              continue;
            }
            if (r[b]) {
              if (r[b].push(i), o.hasOwnProperty(b))
                for (var v = o[b], m = 0; m < v.length; m++) {
                  var x = v[m];
                  this.complete(i, x);
                }
            } else
              r[b] = [i], this.predict(b);
          }
        }
      }, h.prototype.predict = function(t) {
        for (var n = this.grammar.byName[t] || [], r = 0; r < n.length; r++) {
          var o = n[r], l = this.wants[t], i = new a(o, 0, this.index, l);
          this.states.push(i);
        }
      }, h.prototype.complete = function(t, n) {
        var r = t.nextState(n);
        this.states.push(r);
      };
      function c(t, n) {
        this.rules = t, this.start = n || this.rules[0].name;
        var r = this.byName = {};
        this.rules.forEach(function(o) {
          r.hasOwnProperty(o.name) || (r[o.name] = []), r[o.name].push(o);
        });
      }
      c.fromCompiled = function(o, n) {
        var r = o.Lexer;
        o.ParserStart && (n = o.ParserStart, o = o.ParserRules);
        var o = o.map(function(i) {
          return new s(i.name, i.symbols, i.postprocess);
        }), l = new c(o, n);
        return l.lexer = r, l;
      };
      function u() {
        this.reset("");
      }
      u.prototype.reset = function(t, n) {
        this.buffer = t, this.index = 0, this.line = n ? n.line : 1, this.lastLineBreak = n ? -n.col : 0;
      }, u.prototype.next = function() {
        if (this.index < this.buffer.length) {
          var t = this.buffer[this.index++];
          return t === `
` && (this.line += 1, this.lastLineBreak = this.index), { value: t };
        }
      }, u.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak
        };
      }, u.prototype.formatError = function(t, n) {
        var r = this.buffer;
        if (typeof r == "string") {
          var o = r.split(`
`).slice(
            Math.max(0, this.line - 5),
            this.line
          ), l = r.indexOf(`
`, this.index);
          l === -1 && (l = r.length);
          var i = this.index - this.lastLineBreak, f = String(this.line).length;
          return n += " at line " + this.line + " col " + i + `:

`, n += o.map(function(y, b) {
            return m(this.line - o.length + b + 1, f) + " " + y;
          }, this).join(`
`), n += `
` + m("", f + i) + `^
`, n;
        } else
          return n + " at index " + (this.index - 1);
        function m(y, b) {
          var v = String(y);
          return Array(b - v.length + 1).join(" ") + v;
        }
      };
      function p(t, n, r) {
        if (t instanceof c)
          var o = t, r = n;
        else
          var o = c.fromCompiled(t, n);
        this.grammar = o, this.options = {
          keepHistory: !1,
          lexer: o.lexer || new u()
        };
        for (var l in r || {})
          this.options[l] = r[l];
        this.lexer = this.options.lexer, this.lexerState = void 0;
        var i = new h(o, 0);
        this.table = [i], i.wants[o.start] = [], i.predict(o.start), i.process(), this.current = 0;
      }
      p.fail = {}, p.prototype.feed = function(t) {
        var n = this.lexer;
        n.reset(t, this.lexerState);
        for (var r; ; ) {
          try {
            if (r = n.next(), !r)
              break;
          } catch (O) {
            var f = new h(this.grammar, this.current + 1);
            this.table.push(f);
            var o = new Error(this.reportLexerError(O));
            throw o.offset = this.current, o.token = O.token, o;
          }
          var l = this.table[this.current];
          this.options.keepHistory || delete this.table[this.current - 1];
          var i = this.current + 1, f = new h(this.grammar, i);
          this.table.push(f);
          for (var m = r.text !== void 0 ? r.text : r.value, y = n.constructor === u ? r.value : r, b = l.scannable, v = b.length; v--; ) {
            var x = b[v], w = x.rule.symbols[x.dot];
            if (w.test ? w.test(y) : w.type ? w.type === r.type : w.literal === m) {
              var j = x.nextState({ data: y, token: r, isToken: !0, reference: i - 1 });
              f.states.push(j);
            }
          }
          if (f.process(), f.states.length === 0) {
            var o = new Error(this.reportError(r));
            throw o.offset = this.current, o.token = r, o;
          }
          this.options.keepHistory && (l.lexerState = n.save()), this.current++;
        }
        return l && (this.lexerState = n.save()), this.results = this.finish(), this;
      }, p.prototype.reportLexerError = function(t) {
        var n, r, o = t.token;
        return o ? (n = "input " + JSON.stringify(o.text[0]) + " (lexer error)", r = this.lexer.formatError(o, "Syntax error")) : (n = "input (lexer error)", r = t.message), this.reportErrorCommon(r, n);
      }, p.prototype.reportError = function(t) {
        var n = (t.type ? t.type + " token: " : "") + JSON.stringify(t.value !== void 0 ? t.value : t), r = this.lexer.formatError(t, "Syntax error");
        return this.reportErrorCommon(r, n);
      }, p.prototype.reportErrorCommon = function(t, n) {
        var r = [];
        r.push(t);
        var o = this.table.length - 2, l = this.table[o], i = l.states.filter(function(m) {
          var y = m.rule.symbols[m.dot];
          return y && typeof y != "string";
        });
        if (i.length === 0)
          r.push("Unexpected " + n + `. I did not expect any more input. Here is the state of my parse table:
`), this.displayStateStack(l.states, r);
        else {
          r.push("Unexpected " + n + `. Instead, I was expecting to see one of the following:
`);
          var f = i.map(function(m) {
            return this.buildFirstStateStack(m, []) || [m];
          }, this);
          f.forEach(function(m) {
            var y = m[0], b = y.rule.symbols[y.dot], v = this.getSymbolDisplay(b);
            r.push("A " + v + " based on:"), this.displayStateStack(m, r);
          }, this);
        }
        return r.push(""), r.join(`
`);
      }, p.prototype.displayStateStack = function(t, n) {
        for (var r, o = 0, l = 0; l < t.length; l++) {
          var i = t[l], f = i.rule.toString(i.dot);
          f === r ? o++ : (o > 0 && n.push("    ^ " + o + " more lines identical to this"), o = 0, n.push("    " + f)), r = f;
        }
      }, p.prototype.getSymbolDisplay = function(t) {
        return S(t);
      }, p.prototype.buildFirstStateStack = function(t, n) {
        if (n.indexOf(t) !== -1)
          return null;
        if (t.wantedBy.length === 0)
          return [t];
        var r = t.wantedBy[0], o = [t].concat(n), l = this.buildFirstStateStack(r, o);
        return l === null ? null : [t].concat(l);
      }, p.prototype.save = function() {
        var t = this.table[this.current];
        return t.lexerState = this.lexerState, t;
      }, p.prototype.restore = function(t) {
        var n = t.index;
        this.current = n, this.table[n] = t, this.table.splice(n + 1), this.lexerState = t.lexerState, this.results = this.finish();
      }, p.prototype.rewind = function(t) {
        if (!this.options.keepHistory)
          throw new Error("set option `keepHistory` to enable rewinding");
        this.restore(this.table[t]);
      }, p.prototype.finish = function() {
        var t = [], n = this.grammar.start, r = this.table[this.table.length - 1];
        return r.states.forEach(function(o) {
          o.rule.name === n && o.dot === o.rule.symbols.length && o.reference === 0 && o.data !== p.fail && t.push(o);
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
        Parser: p,
        Grammar: c,
        Rule: s
      };
    });
  }(F)), F.exports;
}
var k = M();
const A = /* @__PURE__ */ I(k), N = /(?:^|\s+|;)##\s*([\s\S]+?)(?:[\s\n]*)##/g, V = /(?:^|\s+|;)#\s*(.+)(?:[^\n]*)/g, R = /([\n\s])*lp(\.)/g, _ = /(?:^|\s|;)(global)(?:\s+)/g;
function D(e, s) {
  const a = new A.Parser(A.Grammar.fromCompiled(E)), h = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  return e = e.replace(h, ""), e = e.replaceAll(_, "globalThis."), d.debug("code before pre-processing-------------------------------"), d.debug(e), d.debug("========================= -------------------------------"), e = e.replaceAll(N, (c, u) => {
    d.debug("Match: " + u);
    let p = "";
    return u.split(/[\r\n]/).map(($) => {
      $ = $.replace(/([\r\n]+)/gm, "").replace(/(^\s+)/, ""), $.length !== 0 && (a.feed($ + `|
`), d.debug(`block parser state ${a.results[0]}`), d.debug(`BLOCK Line: !!!${$}!!!`));
    }), p += a.results[0], `
` + p + `
`;
  }), d.info("code AFTER block-grammar processing -------------------------------"), d.info(e), d.info("========================= -------------------------------"), e = e.replaceAll(V, (c, u) => {
    const p = new A.Parser(A.Grammar.fromCompiled(E));
    d.debug("!!!" + c + "!!!"), d.debug("!!!" + u + "!!!");
    let S = "", $ = u;
    return $ && (p.feed($ + `
`), S = p.results[0]), `
` + S;
  }), s && (e = e.replace(R, `$1${s}$2`)), d.debug("code AFTER one-line-grammar processing -------------------------------"), d.debug(e), d.debug("========================= -------------------------------"), e;
}
const C = /^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)[^a-zA-Z0-9\_]/;
function T(e) {
  e.defineMode("lp", function(s, a) {
    const h = {
      token: function(c, u) {
        let p = "";
        if (!c.eol()) {
          let S = c.match(C, !1);
          if (S) {
            let $ = S[1].length;
            for (; $--; ) c.eat(() => !0);
            return "lp";
          }
        }
        if (c.eatSpace(), c.match(C, !1)) return null;
        for (; (p = c.eat(/[^\s]/)) && p !== "."; )
          ;
        return null;
      }
    };
    return e.overlayMode(e.getMode(s, a.backdrop || "javascript"), h);
  });
}
function U(e, s = 4) {
  const h = e.replace(/([^\s\[\]]+)!(\d+)/g, (t, n, r) => Array(parseInt(r, 10)).fill(n).join(" ")).match(/\[|\]|[^\s\[\]]+/g);
  if (!h) return [];
  const c = [], u = [c];
  for (const t of h)
    if (t === "[") {
      const n = [];
      u[u.length - 1].push(n), u.push(n);
    } else t === "]" ? u.length > 1 && u.pop() : u[u.length - 1].push(t);
  function p(t) {
    if (Number.isInteger(t)) return t + "b";
    for (let n = 2; n <= 64; n *= 2) {
      let r = Math.round(t * n);
      if (Math.abs(t - r / n) < 1e-3) return r === 1 ? `1/${n}b` : `${r}/${n}b`;
    }
    return t.toFixed(3).replace(/\.?0+$/, "") + "b";
  }
  const S = [];
  function $(t, n) {
    if (Array.isArray(t)) {
      let r = 0;
      const o = t.map((l) => {
        let i = 1;
        return typeof l == "string" && (l.includes("@") ? i = parseFloat(l.split("@")[1]) || 1 : l.includes("/") && (i = parseFloat(l.split("/")[1]) || 1)), r += i, { child: l, weight: i };
      });
      for (const { child: l, weight: i } of o) {
        const f = n * (i / r);
        $(l, f);
      }
    } else {
      let r = t, o = n;
      if (r.includes("@") && (r = r.split("@")[0]), r.includes("/") && (r = r.split("/")[0]), r.includes("*")) {
        const [i, f] = r.split("*"), m = i === "~" ? "-" : i, y = parseInt(f, 10);
        if (!isNaN(y) && y > 0) {
          const b = o / y, v = p(b);
          for (let x = 0; x < y; x++)
            S.push([m, v]);
          return;
        }
      }
      const l = r === "~" ? "-" : r;
      S.push([l, p(o)]);
    }
  }
  return $(c, s), S;
}
export {
  T as addCMMode,
  U as parseStrudel,
  D as transpile
};
