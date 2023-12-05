function init() {
  getProductList();
  getCartList();
}
let productdata = [];
// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (res) {
      productdata = res.data.products;
      renderProducts();
    })
    .catch(function (error) {
      //console.log(error.data);
    });
}

function togetherHTML(item) {
  return `<li class="productCard" >
		<h4 class="productType">新品</h4>
		<img src="${item.images}" alt="" />
		<a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
		<h3>${item.title}</h3>
		<del class="originPrice">${item.origin_price}</del>
		<p class="nowPrice">${item.price}</p>
	  </li>`;
}

let productWrap = document.querySelector(".productWrap");

function renderProducts(product) {
  let str = "";
  productdata.forEach(function (item) {
    str += togetherHTML(item);
  });
  productWrap.innerHTML = str;
}

//塞選清單
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", function (e) {
  const selectCatch = e.target.value;
  if (selectCatch == "全部") {
    renderProducts();
    return;
  }
  let str = "";
  productdata.forEach(function (item) {
    if (item.category == selectCatch) {
      str += togetherHTML(item);
    }
    productWrap.innerHTML = str;
  });
});

// 商品監聽取的data
productWrap.addEventListener("click", function (e) {
  e.preventDefault();
  let addCartclass = e.target.getAttribute("class");
  if (addCartclass !== "addCardBtn") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  console.log(productId);
  //計算數量
  let num = 1;
  cartsData.forEach(function (item) {
    if (item.product.id === productId) {
      num = item.quantity += 1;
    }
  });
  console.log(num);
});

const cartlist = document.querySelector(".shoppingCart-lists");
let cartsData = [];
//取得購物車列表
function getCartList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (res) {
      cartsData = res.data.carts;
      console.log(cartsData);
      let str = "";
      cartsData.forEach(function (item) {
        str += `<tr>
        <td>
          <div class="cardItem-title">
            <img src="${item.product.images}" alt="" />
            <p>${item.product.title}</p>
          </div>
        </td>
        <td>${item.product.price}</td>
        <td>${item.quantity}</td>
        <td>${item.product.price * item.quantity}</td>
        <td class="discardBtn">
          <a href="#" class="material-icons"> clear </a>
        </td>
      </tr>`;
      });
      cartlist.innerHTML = str;
    });
}

init();
