const productId = sessionStorage.getItem("selectedProduct") ?? 50921; // Chevrolet Onix as default

document.addEventListener("DOMContentLoaded", () => {
  let comments = null;
  spinnerGetJSONData(PRODUCT_INFO_URL + productId + EXT_TYPE)
    .then(showProduct);

  spinnerGetJSONData(PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE)
    .then(data => {
      comments = data;
      showComments(comments);

      handleUserCommentForm(comments);
      handleUserStarRating();
    });

});

function showProduct(product) {
  for (const element of document.querySelectorAll(".productInfo"))
    element.innerHTML = product[element.getAttribute("name")];
  // Each element's name matches the product object property.

  const imgContainer = document.querySelector("#productImages")
  imgContainer.classList.add("row-cols-" + product.images.length);
  document.querySelector("#mainImage").setAttribute("src", product.images[0]);

  for (const img of product.images) {
    const id = product.images.indexOf(img);
    imgContainer.innerHTML +=
      `<div class="btn col py-1 px-0">
      <input type="radio" class="btn-check" id="thumb-${id}" name="thumbimg" autocomplete="off" checked="">
        <label class="btn p-0" for="thumb-${id}">
          <img class="img-fluid" src="${img}" alt="${product.name}">
        </label>
      </div>`;
  }

  // FIXME: This should be inside the previous for..of, it didn't work properly
  // when I tried and I don't have time to keep trying.
  document.querySelectorAll("input").forEach(elem => elem.addEventListener("click", () => {
    const index = elem.getAttribute("id").slice("thumb-".length);
    document.querySelector("#mainImage").setAttribute("src", product.images[index]);
    }));
}

function showComments(comments) {
  const container = document.querySelector("#commentsContainer");
  container.innerHTML = "";
  
  // check if there are comments made by the current user
  let userComments = localStorage.getItem("userComment");
  if (userComments)
      userComments = 
        JSON.parse(userComments)
        .filter(comment => comment.product === productId);
  else userComments = [];

  if (comments.length + userComments.length != 0)
    for (const comment of comments.concat(userComments)) {
      const starRating = genStarRating(comment.score, false);

      container.innerHTML +=
        `<div class="row list-item shadow-sm mb-2">
          <div class="d-flex flex-row pt-1">
            <h5 class="pe-3"><strong>${comment.user}</strong></h5>
            <div id="starRating">${starRating}</div>
            <p class="text-muted ms-auto">${new Date(comment.dateTime).toLocaleString()}</p>
          </div>
        <p>${comment.description}</p>
        </div>`;
    }
  else
    container.innerHTML =
      `<div class="row">
        <h3 class="text-muted text-center">No hay comentarios para este producto.</h3>
      </div>`;
}

function genStarRating(score, bigger) {
  const full = Math.floor(score);

  let result = ""
  for(let i = 0; i < 5; i++) { // max stars = 5
    if (i < full) result += `<i name="star-${i}" class="fa ${bigger ? 'fa-lg' : ''} fa-star checked"></i>`
    else          result += `<i name="star-${i}" class="fa ${bigger ? 'fa-lg' : ''} fa-star"></i>`;
  }

  return result;
}

function handleUserCommentForm(comments) {
  document.querySelector("#userCommentForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = Object.fromEntries((new FormData(e.target)).entries());
    const comment = { 
      product: productId,
      score: sessionStorage.getItem("userStarRating") ?? 1,
      description: form.comment,
      user: localStorage.getItem("login-data-email").split("@")[0],
      dateTime: new Date().toJSON(),
    }

    let userCommentArray = localStorage.getItem("userComment") ?? "[]";
    userCommentArray = JSON.parse(userCommentArray);

    userCommentArray.push(comment);
    localStorage.setItem("userComment", JSON.stringify(userCommentArray));
    showComments(comments);

    // clean inputs
    e.target.querySelector("textarea").value = null;
    e.target.querySelectorAll(".fa-star")
      .forEach(elem => elem.classList.remove("clicked", "checked"));
    sessionStorage.removeItem("userStarRating");
  });
}

function handleUserStarRating() {
  const userStarRating = document.querySelector("#userStarRating");
  userStarRating.innerHTML = genStarRating(0, true);

  const userStars = userStarRating.querySelectorAll(".fa-star");

  const getIndex  = star => parseInt(star.getAttribute("name").slice("star-".length));
  const check     = star => star.classList.add("checked");
  const uncheck   = star => star.classList.remove("checked");
  const clicked   = star => star.classList.contains("clicked");

  userStars.forEach(elem => {
    const currentIndex = getIndex(elem);
    elem.addEventListener("mouseover", () => {
      for (const star of userStars) 
        if (getIndex(star) <= currentIndex && !clicked(star))
          check(star);
    });

    elem.addEventListener("mouseout", () => {
      for (const star of userStars)
        if(!clicked(star)) uncheck(star);
    });

    elem.addEventListener("click", () => {
      sessionStorage.setItem("userStarRating", currentIndex + 1);
      for (const star of userStars) {
        star.classList.add("clicked");
        if (getIndex(star) <= currentIndex) check(star);
        else uncheck(star);
      }
    })
  });
}
