// 取得產品列表
function getProductList() {
	axios
		.get(
			`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
		)
		.then(function (response) {
			console.log(response.data);
		})
		.catch(function (error) {
			console.log(error.response.data);
		});
}
