/**
 * Various tweaks to the Read the Docs theme to better conform with Godot's
 * visual identity. Many colors are also overridden to use CSS variables.
 * This makes it possible to provide an automatically-used dark theme
 * based on browser preferences.
 */

 /* Default (light) theme colors */
 :root {
    --body-color: #404040;
    --content-wrap-background-color: #efefef;
    --content-background-color: #fcfcfc;
    --logo-opacity: 1.0;
    --navbar-background-color: #333f67;
    --navbar-background-color-hover: #29355c;
    --navbar-background-color-active: #212d51;
    --navbar-current-background-color: #212d51;
    --navbar-current-background-color-hover: #182343;
    --navbar-current-background-color-active: #131e3b;
    --navbar-level-1-color: #c3e3ff;
    --navbar-level-2-color: #b8d6f0;
    --navbar-level-3-color: #a3c4e1;
    --navbar-heading-color: #ff7381;
    --navbar-scrollbar-color: #d45a66;
    --navbar-scrollbar-hover-color: #b14550;
    --navbar-scrollbar-active-color: #72383e;
    --navbar-scrollbar-background: #131e2b;

    --link-color: #2980b9;
    --link-color-hover: #3091d1;
    --link-color-active: #105078;
    --link-color-visited: #9b59b6;

    --hr-color: #e1e4e5;
    --table-row-odd-background-color: #f3f6f6;
    --code-background-color: #fff;
    --code-border-color: #e1e4e5;
    --code-literal-color: #d04c60;
    --input-background-color: #fcfcfc;
    --input-focus-border-color: #5f8cff;

    --search-input-background-color: #e6eef3; /* derived from --input-background-color */
    --search-match-color: #2c6b96; /* derived from --link-color */
    --search-match-background-color: #e3f2fd; /* derived from --link-color */
    --search-active-color: #efefef;
    --search-credits-background-color: #333f67; /* derived from --navbar-background-color */
    --search-credits-color: #b3b3b3; /* derived from --footer-color */
    --search-credits-link-color: #4392c5; /* derived from --link-color */

    --highlight-background-color: #f5ffe1;
    --highlight-background-emph-color: #dbe6c3;
    --highlight-default-color: #404040;
    --highlight-comment-color: #408090;
    --highlight-keyword-color: #007020;
    --highlight-keyword2-color: #902000;
    --highlight-number-color: #208050;
    --highlight-decorator-color: #4070a0;
    --highlight-type-color: #007020;
    --highlight-type2-color: #0e84b5;
    --highlight-function-color: #06287e;
    --highlight-operator-color: #666666;
    --highlight-string-color: #4070a0;

    --admonition-note-background-color: #e7f2fa;
    --admonition-note-color: #404040;
    --admonition-note-title-background-color: #6ab0de;
    --admonition-note-title-color: #fff;
    --admonition-attention-background-color: #ffedcc;
    --admonition-attention-color: #404040;
    --admonition-attention-title-background-color: #f0b37e;
    --admonition-attention-title-color: #fff;
    --admonition-danger-background-color: #fcf3f2;
    --admonition-danger-color: #404040;
    --admonition-danger-title-background-color: #e9a499;
    --admonition-danger-title-color: #fff;
    --admonition-tip-background-color: #dbfaf4;
    --admonition-tip-color: #404040;
    --admonition-tip-title-background-color: #1abc9c;
    --admonition-tip-title-color: #fff;

    --kbd-background-color: #fafbfc;
    --kbd-outline-color: #d1d5da;
    --kbd-shadow-color: #b0b7bf;
    --kbd-text-color: #444d56;

    --btn-neutral-background-color: #f3f6f6;
    --btn-neutral-hover-background-color: #e5ebeb;
    --footer-color: #808080;
}

/* Dark theme colors */
@media (prefers-color-scheme: dark) {
    :root {
        --body-color: rgba(255, 255, 255, 0.85);
        --content-wrap-background-color: #202326;
        --content-background-color: #2e3236;
        /* Decrease the logo opacity when using the dark theme to be less distracting */
        --logo-opacity: 0.85;
        --navbar-background-color: #25282b;
        --navbar-background-color-hover: #333639;
        --navbar-background-color-active: #111417;
        --navbar-current-background-color: #333639;
        --navbar-current-background-color-hover: #44474a;
        --navbar-current-background-color-active: #222528;
        --navbar-level-1-color: #ddd;
        --navbar-level-2-color: #ccc;
        --navbar-level-3-color: #bbb;
        --navbar-heading-color: #ee7381;
        --navbar-scrollbar-color: #be5460;
        --navbar-scrollbar-hover-color: #963e48;
        --navbar-scrollbar-active-color: #5f3034;
        --navbar-scrollbar-background: #1c1e21;

        --link-color: #8cf;
        --link-color-hover: #9df;
        --link-color-active: #6ad;
        --link-color-visited: #cb99f6;

        --hr-color: #555;
        --table-row-odd-background-color: #3b3e41;
        --code-background-color: #434649;
        --code-border-color: #505356;
        --code-literal-color: #faa;
        --input-background-color: #333537;
        --input-focus-border-color: #5f8cff;

        --search-input-background-color: #43464a; /* derived from --input-background-color */
        --search-match-color: #52b4ff; /* derived from --link-color */
        --search-match-background-color: #414c56; /* derived from --link-color */
        --search-active-color: #202326;
        --search-credits-background-color: #202123; /* derived from --navbar-background-color */
        --search-credits-color: #6b6b6b; /* derived from --footer-color */
        --search-credits-link-color: #628fb1; /* derived from --link-color */

        /* Colors taken from the Godot script editor with the Adaptive theme */
        --highlight-background-color: #202531;
        --highlight-background-emph-color: #2d3444;
        --highlight-default-color: rgba(255, 255, 255, 0.85);
        --highlight-comment-color: rgba(204, 206, 211, 0.5);
        --highlight-keyword-color: #ff7085;
        --highlight-keyword2-color: #42ffc2;
        --highlight-number-color: #a1ffe0;
        --highlight-decorator-color: #abc8ff;
        --highlight-type-color: #8effda;
        --highlight-type2-color: #c6ffed;
        --highlight-function-color: #57b3ff;
        --highlight-operator-color: #abc8ff;
        --highlight-string-color: #ffeca1;

        --admonition-note-background-color: #303d4f;
        --admonition-note-color: #bfeeff;
        --admonition-note-title-background-color: #305070;
        --admonition-note-title-color: #bfefff;
        --admonition-attention-background-color: #444033;
        --admonition-attention-color: #ffeeaf;
        --admonition-attention-title-background-color: #665022;
        --admonition-attention-title-color: #ffeeaf;
        --admonition-danger-background-color: #433;
        --admonition-danger-color: #fcc;
        --admonition-danger-title-background-color: #633;
        --admonition-danger-title-color: #fcc;
        --admonition-tip-background-color: #28382d;
        --admonition-tip-color: #dfd;
        --admonition-tip-title-background-color: #336648;
        --admonition-tip-title-color: #dfd;

        --kbd-background-color: #595b5d;
        --kbd-outline-color: #3d4144;
        --kbd-shadow-color: #1e2023;
        --kbd-text-color: #e2f2ff;

        --btn-neutral-background-color: #404040;
        --btn-neutral-hover-background-color: #505050;
        --footer-color: #aaa;
    }
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
input[type="text"],
input[type="button"],
input[type="reset"],
input[type="submit"],
textarea,
legend,
.btn,
.rst-content .toctree-wrapper p.caption,
.rst-versions {
    /* Use a system font stack for better performance (no Web fonts required) */
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

h1,
h2,
h3,
h4,
h5,
h6,
legend,
.rst-content .toctree-wrapper p.caption {
    /* Use a lighter font for headers (Medium instead of Bold) */
    font-weight: 500;
}

.rst-content div.figure p.caption {
    /* Tweak caption styling to be closer to typical captions */
    text-align: center;
    margin-top: 8px;
    opacity: 0.75;
}

.rst-content div.figure.figure-w480 {
    max-width: 480px;
}

.rst-content div.figure img {
    border: 1px solid var(--body-color);
}

p,
article ul,
article ol,
.wy-plain-list-disc,
.wy-plain-list-decimal,
.rst-content ol.arabic,
.rst-content .section ul,
.rst-content .toctree-wrapper ul,
.rst-content .section ol {
    /* Increase the line height slightly to account for the different font */
    line-height: 25px;
}

body,
.rst-content table.docutils thead {
    color: var(--body-color);
}

a {
    color: var(--link-color);
}

.sphinx-tabs .sphinx-menu a.item {
    /* Original definition has `!important` */
    color: var(--link-color) !important;
}

a:hover {
    color: var(--link-color-hover);
    text-decoration: underline;
}

a:active {
    /* Add visual feedback when clicking on a link */
    color: var(--link-color-active);
}

a:visited {
    color: var(--link-color-visited);
}

a.btn:hover {
    text-decoration: none;
}

hr,
#search-results .search li:first-child,
#search-results .search li {
    border-color: var(--hr-color);
}

/* JavaScript documentation directives */
.rst-content dl:not(.docutils) dt {
    background-color: var(--admonition-note-background-color);
    border-color: var(--admonition-note-title-background-color);
    color: var(--admonition-note-color);
}
.rst-content dl:not(.docutils) dl dt {
    background-color: var(--admonition-attention-background-color);
    border-color: var(--admonition-attention-title-background-color);
    color: var(--admonition-attention-color);
}
.rst-content dl:not(.docutils).class dt,
.rst-content dl:not(.docutils).function dt,
.rst-content dl:not(.docutils).method dt,
.rst-content dl:not(.docutils).attribute dt {
    width: 100%;
}
.rst-content dl:not(.docutils).class > dt,
.rst-content dl:not(.docutils).function > dt,
.rst-content dl:not(.docutils).method > dt,
.rst-content dl:not(.docutils).attribute > dt {
    font-size: 100%;
    font-weight: normal;
    margin-bottom: 16px;
    padding: 6px 8px;
}
.rst-content dl:not(.docutils) tt.descclassname,
.rst-content dl:not(.docutils) code.descclassname {
    color: var(--highlight-type2-color);
    font-weight: normal;
}
.rst-content dl:not(.docutils) tt.descname,
.rst-content dl:not(.docutils) code.descname {
    color: var(--highlight-function-color);
    font-weight: normal;
}
.rst-content dl:not(.docutils) .sig-paren,
.rst-content dl:not(.docutils) .optional {
    color: var(--highlight-operator-color);
    font-weight: normal;
    padding: 0 2px;
}
.rst-content dl:not(.docutils) .optional {
    font-style: italic;
}
.rst-content dl:not(.docutils) .sig-param,
.rst-content dl:not(.docutils).class dt > em,
.rst-content dl:not(.docutils).function dt > em,
.rst-content dl:not(.docutils).method dt > em {
    color: var(--code-literal-color);
    font-style: normal;
    padding: 0 4px;
}
.rst-content dl:not(.docutils) .sig-param,
.rst-content dl:not(.docutils).class dt > .optional ~ em,
.rst-content dl:not(.docutils).function dt > .optional ~ em,
.rst-content dl:not(.docutils).method dt > .optional ~ em {
    color: var(--highlight-number-color);
    font-style: italic;
}
.rst-content dl:not(.docutils).class dt > em.property {
    color: var(--highlight-keyword-color);
}
.rst-content dl:not(.docutils) dt a.headerlink {
    color: var(--link-color);
}
.rst-content dl:not(.docutils) dt a.headerlink:visited {
    color: var(--link-color-visited);
}

footer,
#search-results .context {
    color: var(--footer-color);
}

/* Sphinx Search extension */
/* .wy-body-for-nav is used for higher rule specificity */

/* Search popup body */
.wy-body-for-nav .search__outer {
    background-color: var(--content-background-color);
    border: 2px solid var(--content-background-color);
}
.wy-body-for-nav .search__cross svg {
    fill: var(--body-color);
}

.wy-body-for-nav .search__outer::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--content-background-color);
}
.wy-body-for-nav .search__outer::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: var(--content-background-color);
}
.wy-body-for-nav .search__outer::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--hr-color);
}

/* Search input */
.wy-body-for-nav .search__outer__input {
    background-color: var(--search-input-background-color);
    background-image: none;
    border-radius: 50px;
    border: 2px solid transparent;
    color: var(--body-color);
    height: 36px;
    padding: 6px 12px;
}
.wy-body-for-nav .search__outer__input:focus {
    border-color: var(--input-focus-border-color);
}
.wy-body-for-nav .search__outer .bar:after,
.wy-body-for-nav .search__outer .bar:before {
    display: none;
}

/* Search results item */
.wy-body-for-nav .search__result__single {
    border-bottom-color: var(--hr-color);
}
/* Search item title */
.wy-body-for-nav .search__result__title {
    color: var(--link-color);
    border-bottom: none;
    font-size: 120%;
    font-weight: 400;
}

/* Search item section */
.wy-body-for-nav .outer_div_page_results:hover,
.wy-body-for-nav .search__result__box .active {
    background-color: var(--search-active-color);
}
.wy-body-for-nav .search__result__subheading{
    color: var(--body-color);
    font-size: 100%;
    font-weight: 400;
}
.wy-body-for-nav .search__result__content {
    color: var(--footer-color);
}

/* Search item matching substring */
.wy-body-for-nav .search__outer .search__result__title span,
.wy-body-for-nav .search__outer .search__result__content span {
    color: var(--search-match-color);
    border-bottom: 1px solid var(--search-match-color);
    background-color: var(--search-match-background-color);
    padding: 0 2px;
}
.wy-body-for-nav .search__result__subheading span {
    border-bottom-color: var(--body-color);
}

/* Search empty results */
/* The original styles are inlined, see https://github.com/readthedocs/readthedocs-sphinx-search/issues/48 */
.wy-body-for-nav .search__result__box {
    color: var(--body-color) !important;
}

/* Search footer & credits */
.wy-body-for-nav .rtd__search__credits {
    background-color: var(--search-credits-background-color);
    border-color: var(--search-credits-background-color);
    color: var(--search-credits-color);
    padding: 4px 8px;
}
.wy-body-for-nav .rtd__search__credits a {
    color: var(--search-credits-link-color);
}

/* Main sections */

.wy-nav-content-wrap {
    background-color: var(--content-wrap-background-color);
}

.wy-nav-content {
    background-color: var(--content-background-color);
}

.wy-body-for-nav {
    background-color: var(--content-wrap-background-color);
}

@media only screen and (min-width: 769px) {
    .wy-body-for-nav {
        /* Center the page on wide displays for better readability */
        max-width: 1100px;
        margin: 0 auto;
    }
}

/* Table display tweaks */

.rst-content table.docutils,
.wy-table-bordered-all td,
.rst-content table.docutils td,
.wy-table thead th,
.rst-content table.docutils thead th,
.rst-content table.field-list thead th {
    border-color: var(--code-border-color);
}

.wy-table-odd td,
.wy-table-striped tr:nth-child(2n-1) td,
.rst-content table.docutils:not(.field-list) tr:nth-child(2n-1) td {
    background-color: var(--table-row-odd-background-color);
}

/* Override table no-wrap */
/* The first column cells are not verbose, no need to wrap them */
.wy-table-responsive table td:not(:nth-child(1)),
.wy-table-responsive table th:not(:nth-child(1)) {
    white-space: normal;
}

/* Make sure not to wrap keyboard shortcuts */
.wy-table-responsive table td kbd {
    white-space: nowrap;
}

/* Code display tweaks */

code,
.rst-content tt,
.rst-content code {
    font-size: 14px;
    background-color: var(--code-background-color);
    border: 1px solid var(--code-border-color);
}

.rst-content tt.literal,
.rst-content code.literal {
    color: var(--code-literal-color);
}

.rst-content div[class^="highlight"] {
    border-color: var(--code-border-color);
}

.rst-content pre.literal-block,
.rst-content div[class^="highlight"] pre,
.rst-content .linenodiv pre {
    /* Increase the font size and line height in code blocks */
    font-size: 14px;
    line-height: 1.5;
}

/* Code tab display tweaks */

.ui.tabular.menu .active.item,
.ui.segment {
    background-color: var(--code-background-color);
}

/* Syntax highlighting */

.highlight {
    background-color: var(--highlight-background-color);
}

/* Emphasized lines */
.highlight .hll {
    background-color: var(--highlight-background-emph-color);
}

.highlight .gh /* Generic.Heading */,
.highlight .gu /* Generic.Subheading */,
.highlight .go /* Generic.Output */,
.highlight .gt /* Generic.Traceback */ {
    color: var(--highlight-default-color);
}

.highlight .c  /* Comment */,
.highlight .c1 /* Comment.Single */,
.highlight .cm /* Comment.Multiline */,
.highlight .cs /* Comment.Special */ {
    color: var(--highlight-comment-color);
}

.highlight .bp /* Name.Builtin.Pseudo */,
.highlight .k  /* Keyword */,
.highlight .kc /* Keyword.Constant */,
.highlight .kd /* Keyword.Declaration */,
.highlight .kn /* Keyword.Namespace */,
.highlight .kp /* Keyword.Pseudo */,
.highlight .kr /* Keyword.Reserved */,
.highlight .kt /* Keyword.Type */,
.highlight .ow /* Operator.Word */ {
    color: var(--highlight-keyword-color);
}

.highlight .ch /* Comment.Hashbang */,
.highlight .cp /* Comment.Preproc */ {
    color: var(--highlight-keyword2-color);
}

.highlight .m  /* Literal.Number */,
.highlight .mf /* Literal.Number.Float */,
.highlight .mi /* Literal.Number.Integer */,
.highlight .il /* Literal.Number.Integer.Long */,
.highlight .mb /* Literal.Number.Bin */,
.highlight .mh /* Literal.Number.Hex */,
.highlight .mo /* Literal.Number.Oct */ {
    color: var(--highlight-number-color);
}

.highlight .na /* Name.Attribute */,
.highlight .nd /* Name.Decorator */,
.highlight .ni /* Name.Entity */,
.highlight .nl /* Name.Label */ {
    color: var(--highlight-decorator-color);
}

.highlight .nb /* Name.Builtin */,
.highlight .ne /* Name.Exception */ {
    color: var(--highlight-type-color);
}

.highlight .nc /* Name.Class */,
.highlight .nn /* Name.Namespace */,
.highlight .no /* Name.Constant */,
.highlight .nv /* Name.Variable */,
.highlight .vc /* Name.Variable.Class */,
.highlight .vg /* Name.Variable.Global */,
.highlight .vi /* Name.Variable.Instance */,
.highlight .vm /* Name.Variable.Magic */ {
    color: var(--highlight-type2-color);
}

.highlight .nf /* Name.Function */,
.highlight .fm /* Name.Function.Magic */,
.highlight .nt /* Name.Tag */ {
    color: var(--highlight-function-color);
}

.highlight .o  /* Operator */,
.highlight .si /* Literal.String.Interpol */,
.highlight .sx /* Literal.String.Other */,
.highlight .sr /* Literal.String.Regex */,
.highlight .ss /* Literal.String.Symbol */ {
    color: var(--highlight-operator-color);
}

.highlight .cpf/* Comment.PreprocFile */,
.highlight .s  /* Literal.String */,
.highlight .s1 /* Literal.String.Single */,
.highlight .s2 /* Literal.String.Double */,
.highlight .sc /* Literal.String.Char */,
.highlight .se /* Literal.String.Escape */,
.highlight .sa /* Literal.String.Affix */,
.highlight .sb /* Literal.String.Backtick */,
.highlight .dl /* Literal.String.Delimiter */,
.highlight .sd /* Literal.String.Doc */,
.highlight .sh /* Literal.String.Heredoc */ {
    color: var(--highlight-string-color);
}

/* Admonition tweaks */

.rst-content .admonition.note,
.rst-content .admonition.seealso {
    background-color: var(--admonition-note-background-color);
    color: var(--admonition-note-color);
}

.rst-content .admonition.note .admonition-title,
.rst-content .admonition.seealso .admonition-title {
    background-color: var(--admonition-note-title-background-color);
    color: var(--admonition-note-title-color);
}

.rst-content .admonition.attention,
.rst-content .admonition.caution,
.rst-content .admonition.warning {
    background-color: var(--admonition-attention-background-color);
    color: var(--admonition-attention-color);
}

.rst-content .admonition.attention .admonition-title,
.rst-content .admonition.caution .admonition-title,
.rst-content .admonition.warning .admonition-title {
    background-color: var(--admonition-attention-title-background-color);
    color: var(--admonition-attention-title-color);
}

.rst-content .admonition.danger {
    background-color: var(--admonition-danger-background-color);
    color: var(--admonition-danger-color);
}

.rst-content .admonition.danger .admonition-title {
    background-color: var(--admonition-danger-title-background-color);
    color: var(--admonition-danger-title-color);
}

.rst-content .admonition.tip,
.rst-content .admonition.important {
    background-color: var(--admonition-tip-background-color);
    color: var(--admonition-tip-color);
}

.rst-content .admonition.tip .admonition-title,
.rst-content .admonition.important .admonition-title {
    background-color: var(--admonition-tip-title-background-color);
    color: var(--admonition-tip-title-color);
}

/* Keyboard shortcuts tweaks */
kbd, .kbd {
    background-color: var(--kbd-background-color);
    border: 1px solid var(--kbd-outline-color);
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 var(--kbd-shadow-color);
    color: var(--kbd-text-color);
    display: inline-block;
    font-size: 12px;
    line-height: 11px;
    padding: 4px 5px;
    vertical-align: middle;
}

/* Buttons */

.btn-neutral {
    background-color: var(--btn-neutral-background-color) !important;
    color: var(--body-color) !important;
}

.btn-neutral:hover {
    background-color: var(--btn-neutral-hover-background-color) !important;
}

.btn-neutral:visited {
    color: var(--body-color) !important;
}

/* Navigation bar logo and search */

.logo {
    opacity: var(--logo-opacity);
}

.wy-side-nav-search > a img.logo {
    /* Fixed size to prevent reflows and support hiDPI displays */
    /* A 5 pixel margin is added on each side. The logo itself displays at 200×200 at 100% scaling. */
    width: 210px;
    height: 210px;
}

.wy-side-nav-search {
    background-color: var(--navbar-background-color);
}

.wy-side-nav-search.fixed {
    position: fixed;
}

@media only screen and (min-width: 769px) {
    /* Simulate a drop shadow that only affects the bottom edge */
    /* This is used to indicate the search bar is fixed */
    .wy-side-nav-search.fixed-and-scrolled::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 300px;
        height: 8px;
        pointer-events: none;
        background: linear-gradient(hsla(0, 0%, 0%, 0.2), transparent);
    }
}

.wy-side-nav-search > a:hover,
.wy-side-nav-search .wy-dropdown > a:hover {
    background-color: var(--navbar-background-color-hover);
}

.wy-side-nav-search > a:active,
.wy-side-nav-search .wy-dropdown > a:active {
    background-color: var(--navbar-background-color-active);
}

.wy-side-nav-search input[type="text"] {
    background-color: var(--input-background-color);
    color: var(--body-color);
    /* Avoid reflowing when toggling the focus state */
    border: 2px solid transparent;
    box-shadow: none;
    /* Make visual feedback instant */
    transition: none;
    font-size: 14px;
}

.wy-side-nav-search input[type="text"]:focus {
    border: 2px solid var(--input-focus-border-color);
}

.wy-side-nav-search input[type="text"]::placeholder {
    color: var(--body-color);
    opacity: 0.55;
}

/* Navigation bar */

.wy-nav-side {
    background-color: var(--navbar-background-color);
}

@media only screen and (min-width: 769px) {
    .wy-nav-side {
        /* Required to center the page on wide displays */
        left: inherit;
    }
}

.wy-menu-vertical header,
.wy-menu-vertical p.caption {
    color: var(--navbar-heading-color);

    /* Improves the appearance of uppercase text */
    letter-spacing: 0.75px;
}

/* Mobile navigation */

.wy-nav-top,
.wy-nav-top a {
    background-color: var(--navbar-background-color);
    color: var(--navbar-level-1-color);
}

/* Version branch label below the logo */
.wy-side-nav-search > div.version {
    color: var(--navbar-level-3-color);
    opacity: 0.9;
}

/* First level of navigation items */

.wy-menu-vertical a {
    color: var(--navbar-level-1-color);
}

.wy-menu-vertical a:hover {
    background-color: var(--navbar-background-color-hover);
    color: var(--navbar-level-1-color);
}

.wy-menu-vertical a:active {
    background-color: var(--navbar-background-color-active);
}

.wy-menu-vertical li.toctree-l1.current > a {
    border: none;
}

.wy-side-nav-search, .wy-menu-vertical a, .wy-menu-vertical a span.toctree-expand,
.wy-menu-vertical li.toctree-l2 a span.toctree-expand {
    color: var(--navbar-level-3-color);
    opacity: 0.9;
    margin-right: 8px;
}

.wy-side-nav-search, .wy-menu-vertical a, .wy-menu-vertical a:hover span.toctree-expand,
.wy-menu-vertical li.toctree-l2 a:hover span.toctree-expand {
    color: var(--navbar-level-2-color);
    opacity: 1;
}

.wy-side-nav-search, .wy-menu-vertical a, .wy-menu-vertical a:active span.toctree-expand,
.wy-menu-vertical li.toctree-l2 a:active span.toctree-expand {
    color: var(--navbar-level-1-color);
    opacity: 1;
}

/* Second (and higher) levels of navigation items */

.wy-menu-vertical li.current a {
    /* Make long words always display on a single line, keep wrapping for multiple words */
    /* This fixes the class reference titles' display with very long class names */
    display: flex;
}

.wy-menu-vertical li.current a,
.wy-menu-vertical li.toctree-l2.current > a,
.wy-menu-vertical li.toctree-l2.current li.toctree-l3 > a,
.wy-menu-vertical li.toctree-l2.current li.toctree-l4 > a {
    background-color: var(--navbar-current-background-color);
    color: var(--navbar-level-2-color);
    border-color: var(--navbar-current-background-color);
}

.wy-menu-vertical li.current a:hover,
.wy-menu-vertical li.toctree-l2.current > a:hover,
.wy-menu-vertical li.toctree-l2.current li.toctree-l3 > a:hover,
.wy-menu-vertical li.toctree-l3.current li.toctree-l4 > a:hover {
    background-color: var(--navbar-current-background-color-hover);
}

.wy-menu-vertical li.current a:active,
.wy-menu-vertical li.toctree-l2.current > a:active,
.wy-menu-vertical li.toctree-l2.current li.toctree-l3 > a:active,
.wy-menu-vertical li.toctree-l3.current li.toctree-l4 > a:active {
    background-color: var(--navbar-current-background-color-active);
}

.wy-menu-vertical a {
    /* This overrides 8px margin added in other multi-selector rules */
    margin-right: 0;
}

/* Banner panel in sidebar */
.wy-nav-side .ethical-rtd.fixed {
    position: fixed;
}

/* Version selector (only visible on Read the Docs) */

.rst-versions {
    background-color: var(--navbar-current-background-color);
}

@media only screen and (min-width: 769px) {
    .rst-versions {
        /* Required to center the page on wide displays */
        left: inherit;
    }
}

.rst-versions a,
.rst-versions .rst-current-version,
.rst-versions .rst-current-version .fa,
.rst-versions .rst-other-versions dd a {
    color: var(--navbar-level-1-color);
}

.rst-versions .rst-other-versions small {
    color: var(--navbar-level-3-color);
}

.rst-versions .rst-other-versions dd a:hover {
    text-decoration: underline;
}

.rst-versions .rst-other-versions {
    color: var(--navbar-heading-color);
}

.rst-versions .rst-current-version {
    background-color: var(--navbar-current-background-color);
}

.rst-versions .rst-current-version:hover {
    background-color: var(--navbar-current-background-color-hover);
}

.rst-versions .rst-current-version:active {
    background-color: var(--navbar-current-background-color-active);
}

/* Hide the obnoxious automatic highlight in search results */
.rst-content .highlighted {
    background-color: transparent;
    font-weight: inherit;
    padding: 0;
}

/* Allows the scrollbar to be shown in the sidebar */
@media only screen and (min-width: 769px) {
    .wy-side-scroll {
        overflow: hidden;
    }

    .wy-nav-side .wy-side-scroll .ethical-rtd {
        width: calc(300px - 1.25em);
        padding: 0 0 0 1em;
    }
}
.wy-menu.wy-menu-vertical {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100% - 348px);
}
@media screen and (max-width: 768px) {
    .wy-nav-side {
        padding-bottom: 44px;
    }
    .wy-menu.wy-menu-vertical {
        overflow-y: initial;
        max-height: initial;
    }
}

/* Scrollbar styling */
.wy-menu.wy-menu-vertical {
    scrollbar-color: var(--navbar-scrollbar-color) var(--navbar-scrollbar-background);
}
.wy-menu.wy-menu-vertical::-webkit-scrollbar {
    width: .75rem;
}
.wy-menu.wy-menu-vertical::-webkit-scrollbar-track {
    background-color: var(--navbar-scrollbar-background);
}
.wy-menu.wy-menu-vertical::-webkit-scrollbar-thumb {
    background-color: var(--navbar-scrollbar-color);
}
/* Firefox does the dimming on hover automatically. We emulate it for Webkit-based browsers. */
.wy-menu.wy-menu-vertical::-webkit-scrollbar-thumb:hover {
    background-color: var(--navbar-scrollbar-hover-color);
}
.wy-menu.wy-menu-vertical::-webkit-scrollbar-thumb:active {
    background-color: var(--navbar-scrollbar-active-color);
}

