import "bootstrap";

import "../scss/index.scss";

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
  if (publishDate) {
    var parts = publishDate.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  } else return true;
}

//========================== Post Config ==========================

function takeUrl() {
  let url_string = window.location.href;
  var url = new URL(url_string);
  return url.searchParams.get("id");
}

const inputPost = document.getElementById("post__content");
const post = fetch("http://localhost:9001/posts", {
  method: "GET",
})
  .then((resp) => resp.json())
  .then((data) => renderPost(data));
let postId = takeUrl();
function renderPost(data) {
  inputPost.innerHTML = data
    .filter((post) => post.id == postId)
    .map(
      (post) =>
        `
        <div class="container" id="post-${post.id}">
          <div class='row col-12 post-item'>
            <div class="col-12"><b>Title:</b> ${post.title}</div>
            <div class="col-12"><b>Author:</b> ${post.author}</div>
            <div class="col-12"><b>Date:</b> ${post.publish_date}</div>
            <div class="col-12"><b>Description:</b> ${post.description}</div>
            </div>
        </div>`
    )
    .join("");
}

const inputComment = document.getElementById("comment__content");
const comment = fetch("http://localhost:9001/comments", {
  method: "GET",
})
  .then((resp) => resp.json())
  .then((data) => renderComment(data));
function renderComment(data) {
  inputComment.innerHTML = data
    .filter((comment) => comment.postId == postId)
    .sort(function(a, b) {
      return parseDate(b.date) - parseDate(a.date);
    })
    .map(
      (comment) =>
        `
        <div class="col-6" id="comment-${comment.id}">
          <div class='comment-item'>
            <div class="col-12"><b>Content:</b> ${comment.content}</div>
            <div class="col-12"><b>User:</b> ${comment.user}</div>
            <div class="col-12 item--date"><b>Date:</b> ${comment.date}</div>
            </div>
        </div>`
    )
    .join("");
}

let form = document.getElementById("comments__form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  let name = $("#inputName").val();
  let comment = $("#inputComment").val();
  let date = new Date().toISOString().substring(0, 10);
  postId = takeUrl();
  fetch(`http://localhost:9001/posts/${postId}/comments`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      parent_id: null,
      user: name,
      date: date,
      content: comment,
    }),
  }).then((xx) => location.reload());
});
