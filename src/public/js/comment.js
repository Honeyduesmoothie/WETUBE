const commentSection = document.querySelector("#commentSection");
const form = commentSection.querySelector("form");
const commentMenus = document.querySelectorAll("#commentMenu");
const commentRemoveBtns = document.querySelectorAll("#commentRemoveBtn");
const commentList = document.querySelector("#commentList");
const commentNumber = document.querySelector("#commentNumber");

let commentCount = 0;

// comment upload
async function handleSubmit(e) {
  e.preventDefault();
  const textarea = commentSection.querySelector("textarea");
  const text = textarea.value;
  const { id } = videoContainer.dataset;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${id}/comments`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const json = await response.json();
  showTemporaryComment(json, text);
  textarea.value = "";
}
form.addEventListener("submit", handleSubmit);

function showTemporaryComment(json, text) {
  const li = document.createElement("li");
  li.className = "comment-list";
  li.dataset.id = json.commentId;
  const div1 = document.createElement("div");
  div1.className = "comment-wrapper";
  const a = document.createElement("a");
  a.href = `/users/${json.user._id}`;
  const avatar = document.createElement("img");
  avatar.className = "comment-list__avatar";
  avatar.src = `/${json.user.avatarUrl}`;
  a.appendChild(avatar);
  div1.appendChild(a);
  const div2 = document.createElement("div");
  div2.className = "comment-list__comment";
  const a2 = document.createElement("a");
  a2.href = `/users/${json.user._id}`;
  const h3 = document.createElement("h3");
  h3.className = "comment-list__comment__user";
  h3.textContent = `@${json.user.nickname}`;
  a2.appendChild(h3);
  const p = document.createElement("p");
  p.className = "comment-list__comment__text";
  p.textContent = text;
  div2.appendChild(a2);
  div2.appendChild(p);
  div1.appendChild(div2);
  li.appendChild(div1);
  const div3 = document.createElement("div");
  div3.className = "comment-list__comment__menu";
  div3.id = "commentMenu";
  div3.dataset.id = json.commentId;
  const ellipsisIcon = document.createElement("i");
  ellipsisIcon.className = "fa-solid fa-ellipsis-vertical";
  div3.appendChild(ellipsisIcon);
  const div4 = document.createElement("div");
  div4.className = "menu__options hidden";
  div4.id = "commentMenuOptions";
  div4.dataset.id = json.commentId;
  const div5 = document.createElement("div");
  div5.className = "menu__option";
  div5.id = "commentRemoveBtn";
  div5.dataset.id = json.commentId;
  const trashIcon = document.createElement("i");
  trashIcon.className = "fa-solid fa-trash";
  div5.appendChild(trashIcon);
  const span = document.createElement("span");
  span.textContent = "remove";
  div5.appendChild(span);
  div4.appendChild(div5);
  div3.appendChild(div4);
  li.appendChild(div3);
  commentList.prepend(li);
  div3.addEventListener("click", showCommentMenu);
  div5.addEventListener("click", handleRemoveComment);
  commentCount++;
  showCommentNumber();
}

// comment utilities
function showCommentMenu(event) {
  const id = event.currentTarget.dataset.id;
  const commentMenuOptionsArray = Array.from(
    document.querySelectorAll("#commentMenuOptions")
  );
  console.log(commentMenuOptionsArray);
  const commentMenuOptions = commentMenuOptionsArray.find(
    (element) => element.dataset.id === id
  );
  commentMenuOptions.classList.toggle("hidden");
}

if (commentMenus) {
  commentMenus.forEach((commentMenu) =>
    commentMenu.addEventListener("click", showCommentMenu)
  );
}

// comment deleting
async function handleRemoveComment(event) {
  const id = event.currentTarget.dataset.id;
  const lis = Array.from(document.querySelectorAll(".comment-list"));
  const li = lis.find((element) => element.dataset.id === id);
  const videoId = videoContainer.dataset.id;
  li.remove();
  await fetch(`/api/videos/${videoId}/comments/delete/${id}`, {
    method: "delete",
  });
  commentCount--;
  showCommentNumber();
}

if (commentRemoveBtns) {
  commentRemoveBtns.forEach((commentRemoveBtn) =>
    commentRemoveBtn.addEventListener("click", handleRemoveComment)
  );
}

// show the number of comments
function showCommentNumber() {
  const lis = Array.from(document.querySelectorAll(".comment-list"));
  commentCount = lis.length;
  commentNumber.textContent = `${commentCount} Comments`;
}

window.addEventListener("DOMContentLoaded", showCommentNumber);
