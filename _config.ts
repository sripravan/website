import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import sass from "lume/plugins/sass.ts";
import minifyHTML from "lume/plugins/minify_html.ts";

const site = lume({
  src: "./src"
});

site.use(code_highlight());
site.use(date());
site.use(sass());
site.use(minifyHTML());

site.copy("assets", ".");

export default site;
