function init() {
  getProductList();
}
// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (res) {
      const products = res.data.products;
      renderProducts(products);
    })
    .catch(function (error) {
      //console.log(error.data);
    });
}
let productWrap = document.querySelector(".productWrap");
let str = "";
function renderProducts(product) {
  product.forEach(function (item) {
    str += `<li class="productCard" data-id="${item.id}">
		<h4 class="productType">新品</h4>
		<img src="${item.images}" alt="" />
		<a href="#" class="addCardBtn">加入購物車</a>
		<h3>${item.title}</h3>
		<del class="originPrice">${item.origin_price}</del>
		<p class="nowPrice">${item.price}</p>
	  </li>`;
  });
  productWrap.innerHTML = str;
}

init();
