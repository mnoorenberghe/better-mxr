function fixSource() {
  let title = document.getElementsByTagName("title")[0];
  if (!title)
    return;
  let re = /^(.*\/)([^/]+)[/]?$/i;
  let result = re.exec(title.textContent);
  if (result && "1" in result) {
    title.textContent = result[2] + " in " + result[1];
  }
}

function fixSearch() {
  let title = document.getElementsByTagName("title")[0];
  if (!title)
    return;
  let re = /^(.*) (freetext|identifier|file) search (".*")$/i;
  let result = re.exec(title.textContent);
  if (result && result.length == 4) {
    title.textContent = result[3] + " " + result[2]  + " search in " + result[1];
  }
}
