import { Logger as n } from "liveprinter-utils";
const u = require("nearley"), p = require("./lpgrammar"), g = /(?:\n|\t|\s)*\#{2}\s*((?:.|\n|\t|\s)*)\#{2}/g, m = /(?:\n|\t|\s)*\#\s*((?:[^\n])*)/g, f = /[\n\s]*(lp)\./g;
function h(e, l) {
  const s = new u.Parser(u.Grammar.fromCompiled(p));
  return e = e.replace(g, (o, r) => {
    n.debug("Match: " + r);
    let i = "";
    return r.split(/[\r\n]/).map((t) => {
      t = t.replace(/([\r\n]+)/gm, "").replace(/(^[\s]+)/, ""), t.length !== 0 && s.feed(t + `
`);
    }), i += s.results[0], " " + i + `
`;
  }), n.info("code AFTER block-grammar processing -------------------------------"), n.info(e), n.info("========================= -------------------------------"), e = e.replace(m, (o, r, i) => {
    const a = new u.Parser(u.Grammar.fromCompiled(p));
    n.debug("!!!" + o + "!!!"), n.debug("!!!" + r + "!!!");
    let t = "", c = r.replace(/([\r\n]+)/gm, "").replace(/([\s]+)$/, "");
    return c && (a.feed(c + `
`), t = a.results[0]), " " + t;
  }), l && (e = e.replace(f, l)), n.debug("code AFTER one-line-grammar processing -------------------------------"), n.debug(e), n.debug("========================= -------------------------------"), e;
}
const d = /^(stop|prime|mov2|ext|gcodeEvent|gcode|errorEvent|retractspeed|sendFirmwareRetractSettings|retract|unretract|start|temp|bed|fan|drawtime|draw|up|drawup|dup|upto|downto|down|drawdown|dd|travel|traveltime|fwretract|polygon|rect|extrudeto|sendExtrusionGCode|sendArcExtrusionGCode|extrude|move|moveto|drawfill|sync|fill|wait|pause|resume|printPaths|printPathsThick|_extrude)[^a-zA-Z0-9\_]/;
function v(e) {
  e.defineMode("lp", function(l, s) {
    const o = {
      token: function(r, i) {
        let a = "";
        if (!r.eol()) {
          let t = r.match(d, !1);
          if (t) {
            let c = t[1].length;
            for (; c--; ) r.eat(() => !0);
            return "lp";
          }
        }
        if (r.eatSpace(), r.match(d, !1)) return null;
        for (; (a = r.eat(/[^\s]/)) && a !== "."; )
          ;
        return null;
      }
    };
    return e.overlayMode(e.getMode(l, s.backdrop || "javascript"), o);
  });
}
export {
  v as addCMMode,
  h as transpile
};
