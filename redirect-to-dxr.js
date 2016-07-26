// match pattern for the URLs to redirect
let pattern = "https://mxr.mozilla.org/*";

function redirect(requestDetails) {
  console.log("Redirecting: " + requestDetails.url);

  // Based on https://github.com/gijsk/mxr-to-dxr/blob/master/changealllinks.js
  let url = new URL(requestDetails.url);
  let pathComponents = url.pathname.substring(1).split("/");
  let repo = pathComponents[0];
  let paths = pathComponents.slice(1);
  let hash = url.hash;
  let query = url.searchParams;
  query.delete("tree");
  if (query.get("filter") === "") {
    query.delete("filter");
  }

  if (pathComponents[1] == "source") {
    // https://mxr.mozilla.org/mozilla-central/source/browser/components/migration/FirefoxProfileMigrator.js?rev=c2e9a445fede&mark=127#125
    if (url.search) {
      if (query.has("rev")) {
        paths.shift();
        paths.unshift("rev", query.get("rev"));
        query.delete("rev");
      }
      if (query.has("mark")) {
        hash = "#" + query.get("mark");
        query.delete("mark");
      }
    }
  } else if (pathComponents[1] == "ident") {
    // https://mxr.mozilla.org/mozilla-central/ident?i=findLogins&tree=mozilla-central&filter=
    paths[0] = "search";
    query.set("q", "ref:" + query.get("i"));
    query.delete("i");
  } else if (pathComponents[1] == "find") {
    // https://mxr.mozilla.org/mozilla-central/find?string=server-location&tree=mozilla-central&hint=
    paths[0] = "search";
    let q = [];
    if (query.get("text")) {
      q.push(query.get("text"));
    }
    if (query.get("string")) {
      q.push("path:" + query.get("string"));
    }

    query.set("q", q.join(" "));
    query.delete("hint");
    query.delete("string");
    query.delete("text");
  } else if (pathComponents[1] == "search") {
    // https://mxr.mozilla.org/mozilla-central/search?string=%3A[+]*function&regexp=1&find=Login&findi=&filter=^[^\0]*%24&hitlimit=&tree=mozilla-central
    query.set("q", (query.get("regexp") == "1" ? "regexp:\"" + query.get("string") + '"' : query.get("string")) + (query.has("find") ? " path:" + query.get("find") : ""));
    query.delete("string");
    query.delete("find");
    query.delete("regexp");
    query.delete("hitlimit");
  }

  let redirectQuery = query.toString();
  let redirectUrl = new URL(`https://dxr.mozilla.org/${repo}/` + paths.join("/") + (redirectQuery ? "?" + redirectQuery : "") + hash);
  return {
    redirectUrl,
  };
}

chrome.webRequest.onBeforeRequest.addListener(redirect,
                                              {
                                                urls: [pattern]
                                              },
                                              ["blocking"]);
