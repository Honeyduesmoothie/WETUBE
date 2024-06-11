const modalBtn = document.querySelector("#modalBtn");
const btnYes = document.querySelector("#btnYes");
const btnNo = document.querySelector("#btnNo");
const modal = document.querySelector(".modal");

function showModal() {
  modal.classList.remove("hidden");
}
function handleNo() {
  modal.classList.add("hidden");
}

modalBtn.addEventListener("click", showModal);
btnNo.addEventListener("click", handleNo);
