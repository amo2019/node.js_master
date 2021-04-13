if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  fetchData(fetchSuccess);

  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("btn-purchase")[0]
    .addEventListener("click", purchaseClicked);

  document
    .getElementsByClassName("btn-save")[0]
    .addEventListener("click", saveClicked);
}
var stripeHandler = StripeCheckout.configure({
  key: stripePublicKey,
  locale: "en",
  token: function (token) {
    var items = [];
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var quantityElement = cartRow.getElementsByClassName(
        "cart-quantity-input"
      )[0];
      var quantity = quantityElement.value;
      var id = cartRow.dataset.itemId;
      items.push({
        id: id,
        quantity: quantity,
      });
    }

    var tokenString = localStorage.getItem("token");
    if (typeof tokenString == "string") {
      try {
        var token = JSON.parse(tokenString);
        if (typeof token == "object") {
          var userEmail = token.email;
        }
      } catch (e) {
        console.log("token err:", e);
      }
    }

    let url = `http://localhost:3000/api/purchases`;
    let h = new Headers();
    h.append("Content-Type", "application/json");
    h.append("Accept", "application/json");
    let req = new Request(url, {
      method: "POST",
      body: JSON.stringify({
        userEmail: userEmail,
        email: "aminvpython@gmail.com",
        stripeTokenId: token.id,
        items: items,
        itemsToBuy: itemsToBuy,
      }),
    });

    fetch(req)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        alert(data.msg);
        // console.log("data:", data);
        var cartItems = document.getElementsByClassName("cart-items")[0];
        while (cartItems.hasChildNodes()) {
          cartItems.removeChild(cartItems.firstChild);
        }
        updateCartTotal();
      })
      .catch(function (error) {
        console.error(error);
      });
  },
});

function fetchData(callback) {
  // console.log("app.config.sessionToken:", app.config.sessionToken);
  //https://api.allorigins.win/get?url=
  var tokenString = localStorage.getItem("token");
  if (typeof tokenString == "string") {
    try {
      var token = JSON.parse(tokenString);
      if (typeof token == "object") {
        var userEmail = token.email;
      }
    } catch (e) {
      console.log("token err:", e);
    }
  }
  let url = `http://localhost:3000/api/stores`;
  let h = new Headers();
  h.append("userEmail", userEmail);
  h.append("Accept", "application/json");
  let req = new Request(url, {
    method: "GET",
    headers: h,
    mode: "cors",
    queryStringObject: JSON.stringify({
      userEmail: userEmail,
    }),
  });
  fetch(req)
    .then((res) => res.json())
    .then((content) => {
      //we have a response
      if (content) {
        //it worked

        callback(content.data);
      } else {
        //bad attempt
        failure(content.error);
      }
      // if ("error" in content) {
      //   console.log("Content Fetched: ", content);
      //   //bad attempt
      //   failure(content.error);
      // }
      // if ("data" in content) {
      //   //it worked
      //   console.log("Data Fetched: ", data);
      //   callback(content.data);
      // }
    })
    .catch(failure);
}

function purchaseClicked() {
  var priceElement = document.getElementsByClassName("cart-total-price")[0];
  var price = parseFloat(priceElement.innerText.replace("$", "")) * 100;
  stripeHandler.open({
    amount: price,
  });
}

function saveClicked() {
  var dataString = localStorage.getItem("dataString");

  try {
    var data = JSON.parse(dataString);

    if (data.itemsToBuy) {
      data.itemsToBuy.forEach((element) => {
        addItemToCart(
          element.title,
          element.price,
          element.imageSrc,
          element.id,
          element.quantity
        );
      });

      // --------------------------------------------------------

      // --------------------------------------------------------

      updateCartTotal();
    }
  } catch (e) {
    console.log("No data to retrieve...", e);
  }

  console.log("saveClicked");
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

var itemsToBuy = [];
function addToCartClicked(event) {
  //var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  //var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  //var quantity = document.getElementsByClassName("cart-quantity-input")[0.innerText;
  var id = shopItem.dataset.itemId;
  itemsToBuy.push({
    title,
    price,
    imageSrc,
    id,
  });
  addItemToCart(title, price, imageSrc, id);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc, id, quantity = 1) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  cartRow.dataset.itemId = id;
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      console.log("This item is already added to the cart", cartItemNames[i]);
      return;
    }
  }
  var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value=${quantity}>
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0];
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0];
    var quantityElement = cartRow.getElementsByClassName(
      "cart-quantity-input"
    )[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText =
    "$" + total;
}

function fetchSuccess(data) {
  //we have a token so put it in localstorage

  var dataString = JSON.stringify(data);
  localStorage.setItem("dataString", dataString);
}

function purchaseSuccess(data) {
  //user has been registered
  console.log(" purchaseSuccess:", data);
}

function failure(err) {
  alert(err.message);
  console.warn(err.code, err.message);
}
