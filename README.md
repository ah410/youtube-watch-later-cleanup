
// Select the element using a query
const element = document.querySelector('span[dir="auto"].style-scope.yt-formatted-string');

// Check if the element is found to avoid errors
if (element) {
  console.log(element.textContent); // or element.innerText
} else {
  console.log("Element not found");
}
