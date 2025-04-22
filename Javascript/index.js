function isValidURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

// Utility: Generate a human-readable short code
function generateShortCode() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortCode = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }
  return shortCode;
}

// Handler: Shorten URL and update UI
document.getElementById("shorten-btn").addEventListener("click", () => {
  const input = document.getElementById("url-input");
  const longURL = input.value.trim();
  if (!isValidURL(longURL)) {
    alert("Please enter a valid URL.");
    return;
  }
  // Mock short URL creation with a more readable code
  const code = generateShortCode(); // Generate a readable, human-friendly short code
  const shortURL = `${window.location.origin}/${code}`; // Construct the short URL

  // Create result item
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

  // Copy to clipboard event
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

  // Prepend to results container
  const container = document.getElementById("results-container");
  container.prepend(resultItem);

  // Clear input field
  input.value = "";
});
