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

// fake comment

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
  avatar.src = `${json.user.avatarUrl}`;
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

  const commentMenu = document.createElement("div");
  commentMenu.className = "comment-list__comment__menu";
  commentMenu.id = "commentMenu";
  commentMenu.dataset.id = json.commentId;
  const ellipsisIcon = document.createElement("i");
  ellipsisIcon.className = "fa-solid fa-ellipsis-vertical";
  commentMenu.appendChild(ellipsisIcon);

  commentMenu.addEventListener("click", createMenuOptions);

  li.appendChild(commentMenu);
  commentList.prepend(li);

  // edit form

  const formList = document.createElement("li");
  formList.className = "comment-form-list hidden";
  formList.id = "commentEditForm";
  formList.dataset.id = json.commentId;

  const formContainer = document.createElement("div");
  formContainer.className = "commentSection_form-container";

  const img = document.createElement("img");
  img.src = `/${json.user.avatarUrl}`;
  img.className = "commentSection_avatar";

  const editForm = document.createElement("form");
  editForm.className = "commentSection_form";
  editForm.dataset.id = json.commentId;

  const textarea = document.createElement("textarea");

  const btnContainer = document.createElement("div");
  btnContainer.className = "commentSection_form_button-container";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "button";
  cancelBtn.id = "commentEditCancelBtn";
  cancelBtn.textContent = "Cancel";

  const submitBtn = document.createElement("button");
  submitBtn.className = "button";
  submitBtn.id = "commentEditSubmitBtn";
  submitBtn.textContent = "Edit";

  btnContainer.appendChild(cancelBtn);
  btnContainer.appendChild(submitBtn);
  editForm.appendChild(textarea);
  editForm.appendChild(btnContainer);
  formContainer.appendChild(img);
  formContainer.appendChild(editForm);
  formList.appendChild(formContainer);
  commentList.prepend(formList);

  //  comment count

  commentCount++;
  showCommentNumber();
}

function createMenuOptions(event) {
  const { id } = event.currentTarget.dataset;
  const commentMenus = document.querySelectorAll("#commentMenu");
  const commentMenuArray = Array.from(commentMenus);
  const commentMenu = commentMenuArray.find(
    (commentMenu) => commentMenu.dataset.id === id
  );
  const menuOptions = document.createElement("div");
  menuOptions.className = "menu__options";
  menuOptions.id = "commentMenuOptions";
  // removeBtn
  const removeBtn = document.createElement("div");
  removeBtn.className = "menu__option";
  removeBtn.id = "commentRemoveBtn";
  const trashIcon = document.createElement("i");
  trashIcon.className = "fa-solid fa-trash";
  removeBtn.appendChild(trashIcon);
  const span = document.createElement("span");
  span.textContent = "remove";
  removeBtn.appendChild(span);
  menuOptions.appendChild(removeBtn);
  // editBtn
  const editBtn = document.createElement("div");
  editBtn.className = "menu__option";
  editBtn.id = "commenteditBtn";
  const penIcon = document.createElement("i");
  penIcon.className = "fa-solid fa-pen";
  editBtn.appendChild(penIcon);
  const editSpan = document.createElement("span");
  editSpan.textContent = "edit";
  editBtn.appendChild(editSpan);
  menuOptions.appendChild(editBtn);

  commentMenu.appendChild(menuOptions);

  // event handlers

  commentMenu.removeEventListener("click", createMenuOptions);
  commentMenu.addEventListener("click", removeMenuOptions);
  removeBtn.addEventListener("click", handleRemoveComment);
  editBtn.addEventListener("click", showCommentEditForm);
}

function removeMenuOptions(event) {
  const menuOptions = document.querySelector("#commentMenuOptions");
  menuOptions.remove();
  event.currentTarget.removeEventListener("click", removeMenuOptions);
  event.currentTarget.addEventListener("click", createMenuOptions);
}

if (commentMenus) {
  commentMenus.forEach((commentMenu) =>
    commentMenu.addEventListener("click", createMenuOptions)
  );
}

// comment deleting
async function handleRemoveComment(event) {
  const { id } = event.currentTarget.parentNode.parentNode.dataset;
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

// comment editing

const commentEditBtns = document.querySelectorAll("#commentEditBtn");
const commentEditCancelBtn = document.getElementById("commentEditCancelBtn");
const commentEditSubmitBtn = document.getElementById("commentEditSubmitBtn");

function showCommentEditForm(event) {
  const { id } = event.currentTarget.parentNode.parentNode.dataset;
  const formLists = document.querySelectorAll(".comment-form-list");
  const formListsArray = Array.from(formLists);
  const formList = formListsArray.find((list) => list.dataset.id === id);
  const commentListArray = Array.from(
    document.querySelectorAll(".comment-list")
  );
  const commentList = commentListArray.find((list) => list.dataset.id === id);
  const textarea = formList.querySelector("textarea");
  const comment = commentList.querySelector("p");
  const text = comment.textContent;
  textarea.value = text;
  formList.classList.remove("hidden");
  commentList.classList.add("hidden");
  const cancelBtn = formList.querySelector("#commentEditCancelBtn");
  const commentEditFormsArray = Array.from(
    document.querySelectorAll("#commentEditForm")
  );
  const commentEditForm = commentEditFormsArray.find(
    (list) => list.dataset.id === id
  );

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    commentList.classList.remove("hidden");
    formList.classList.add("hidden");
  });
  commentEditForm.addEventListener("submit", handleCommentEditSubmit);
}

async function handleCommentEditSubmit(event) {
  event.preventDefault();
  const videoId = videoContainer.dataset.id;
  const commentId = event.target.dataset.id;
  const textarea = event.target.querySelector("textarea");
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const response = await fetch(
    `/api/videos/${videoId}/comments/edit/${commentId}`,
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
  const json = await response.json();
  showTemporaryComment(json, text);
  textarea.value = "";
  const formLists = document.querySelectorAll(".comment-form-list");
  formLists.forEach((formList) => {
    if (formList.classList.contains("hidden")) {
      return;
    } else {
      formList.classList.add("hidden");
    }
  });
}

function handleCommentEditCancel(event) {
  event.preventDefault();
  console.log(event.currentTarget);
}

if (commentEditBtns) {
  commentEditBtns.forEach((commentEditBtn) => {
    commentEditBtn.addEventListener("click", showCommentEditForm);
  });
}
