import "bootstrap";

import "../scss/index.scss";

//========================== Posts Config ==========================
const input = document.getElementById("posts__content");
const posts = fetch("http://localhost:9001/posts", {
  method: "GET",
})
  .then((resp) => resp.json())
  .then((data) => renderPosts(data));

function renderPosts(data) {
  input.innerHTML = data
    .filter((post) => post.title)
    .sort(function(a, b) {
      return parseDate(b.publish_date) - parseDate(a.publish_date);
    })
    .map(
      (post) =>
        `
        <div class="container" id="post-${post.id}">
          <div class='row col-12 post-item'>
            <div class="col-12"><b>Title:</b> ${post.title}</div>
            <div class="col-12"><b>Author:</b> ${post.author}</div>
            <div class="col-12"><b>Date:</b> ${post.publish_date}</div>
            <div class="col-12"><b>Description:</b> ${post.description}</div>
            <div class="col-12">
              <a href="#" class="btn btn-success post-btn" data-extra-post-id="${post.id}">more info...</a>
            </div>
            </div>
        </div>`
    )
    .join("");
}

addEventListener("click", (event) => {
  const element = event.target;
  if (element.tagName == "A") {
    const postId = element.getAttribute("data-extra-post-id");
    window.location = "/post.html?id=" + postId;
  } else {
    return false;
  }
});

function parseDate(publishDate) {
  var parts = publishDate.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1] - 1, parts[2]); // months are 0-based
}
