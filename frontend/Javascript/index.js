function isValidURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + 
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + 
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}

document.getElementById("shorten-btn").addEventListener("click", async () => {
  const input = document.getElementById("url-input");
  const longURL = input.value.trim();

  if (!isValidURL(longURL)) {
    alert("Please enter a valid URL.");
    return;
  }

  const response = await fetch("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ longURL })
  });

  const data = await response.json();
  const shortURL = data.shortURL;

  // Store in localStorage
  let stored = JSON.parse(localStorage.getItem("shortLinks") || "[]");
  stored.unshift(shortURL);
  localStorage.setItem("shortLinks", JSON.stringify(stored));

  showResult(shortURL);
  input.value = "";
});

function showResult(shortURL) {
  const container = document.getElementById("results-container");

  const resultItem = document.createElement("div");
  resultItem.className = "result-item";

  const linkEl = document.createElement("a");
  linkEl.href = shortURL;
  linkEl.textContent = shortURL;
  linkEl.className = "link";
  linkEl.target = "_blank";

  const actions = document.createElement("div");
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "Copy";
  copyBtn.className = "copy-btn";
  const successMsg = document.createElement("span");
  successMsg.textContent = "Copied!";
  successMsg.className = "copy-success";

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(shortURL).then(() => {
      successMsg.style.opacity = "1";
      setTimeout(() => {
        successMsg.style.opacity = "0";
      }, 2000);
    });
  });

  actions.appendChild(copyBtn);
  actions.appendChild(successMsg);
  resultItem.appendChild(linkEl);
  resultItem.appendChild(actions);
  container.prepend(resultItem);
}

// On page load: show stored URLs
window.onload = () => {
  const stored = JSON.parse(localStorage.getItem("shortLinks") || "[]");
  stored.forEach(showResult);
};


//  Clear all functionality

document.getElementById("clear-all-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all short links?")) {
    localStorage.removeItem("shortLinks");
    document.getElementById("results-container").innerHTML = "";
  }
});
