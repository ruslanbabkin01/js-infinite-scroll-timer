const musicBtnListRef = document.querySelector(".key__list");
musicBtnListRef.addEventListener("click", onMusicBtnClick);
musicBtnListRef.addEventListener("transitionend", (evt) => {
  console.log();
  if (evt.propertyName !== "transform") {
    return;
  }
  evt.target.classList.remove("playing");
});

document.addEventListener('keydown', onKeyPress);

function onMusicBtnClick(evt) {
  const target = evt.target;

  if (target.nodeName === "UL") {
    return;
  }

  const liItemRef = target.closest("li");
  liItemRef.classList.add("playing");
  const key = liItemRef.dataset.key;
  console.log(key);
  playSound(key);
}

function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  if (!audio) {
    return;
  }
  audio.currentTime = 0;
  audio.play();
}

function onKeyPress({keyCode}) {
  playSound(keyCode);
  const li = document.querySelector(`li[data-key="${keyCode}"]`);
  if (!li) {
    return;
  }
  li.classList.add("playing");

}