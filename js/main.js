function init() {
  getProductList();
  getCartList();
}

init();

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

// 新增商品監聽增加數量---商品監聽取的data
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
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: productId,
          quantity: num,
        },
      }
    )
    .then(function (res) {
      alert("加入成功");
      console.log(res);
      getCartList();
    });
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
      //總金額
      console.log(res.finalTotal);
      document.querySelector(".total-js").textContent = res.data.finalTotal;
      //取得購物車列表&渲染
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
          <a href="#" class="material-icons" data-id=${item.id}> clear </a>
        </td>
      </tr>`;
      });
      cartlist.innerHTML = str;
    });
}

cartlist.addEventListener("click", function (e) {
  e.preventDefault();
  const cartId = e.target.getAttribute("data-id");
  if (cartId == null) {
    alert("不可以點這裡");
    return;
  }
  console.log(cartId);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`
    )
    .then(function (response) {
      alert("這個酷東西下次買");
      getCartList();
    });
});

//刪除全部
const delAllBtn = document.querySelector(".discardAllBtn");
delAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (res) {
      alert("刪除全部購物車成功");
      getCartList();
    });
});

//訂單送出
const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //檢查購物車有沒有資料
  if (cartsData.length == 0) {
    alert("請加入購物車");
    return;
  } else {
    alert("有料!購物車OK!");
  }
  //檢查有無輸入
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;
  if (
    customerName == "" ||
    customerPhone == "" ||
    customerEmail == "" ||
    customerAddress == "" ||
    customerTradeWay == ""
  ) {
    alert("請確實填入訂單");
    return;
  }
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: customerName,
            tel: customerPhone,
            email: customerEmail,
            address: customerAddress,
            payment: customerTradeWay,
          },
        },
      }
    )
    .then(function (res) {
      alert("訂單建立OK");
      document.querySelector("#customerName").value = "";
      document.querySelector("#customerPhone").value = "";
      document.querySelector("#customerEmail").value = "";
      document.querySelector("#customerAddress").value = "";
      document.querySelector("#tradeWay").value = "ATM";
      getCartList();
    });
});
