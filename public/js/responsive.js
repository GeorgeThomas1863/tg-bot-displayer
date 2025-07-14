const displayElement = document.getElementById("display-element");

export const mainClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  console.log("!!!CLICK ELEMENT");
  console.log(clickElement);
};

if (displayElement) {
  displayElement.addEventListener("click", mainClickHandler);
}
