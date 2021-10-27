function circularText(txt, radius) {
  txt = txt.split("");
  console.log(txt);
  const circledTextDiv = createElement("div");
  var deg = 180 / txt.length,
    origin = 275;
  txt.forEach((letter) => {
    letter = `
<p
  style="height:175px;position:absolute;transform:rotate(275deg);transform-origin:0 100%"
>
  ${letter}
</p>
`;
    circledTextDiv.innerHTML += letter;
    origin += deg;
  });
  return circledTextDiv;
}

module.exports = {
  circularText,
};
