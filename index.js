let pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: /https?:\/\/mxr\.mozilla\.org\/[^/]*\/source\/.*/,
  contentScriptWhen: 'ready',
  contentScriptFile: "./contentScript.js",
  contentScript: "fixSource()",
});

pageMod.PageMod({
  include: /https?:\/\/mxr\.mozilla\.org\/[^/]*\/(search|ident|find)[/?].*/,
  contentScriptWhen: 'ready',
  contentScriptFile: "./contentScript.js",
  contentScript: "fixSearch()",
});
