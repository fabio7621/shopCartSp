const orderList = document.querySelector(".js-orderMenu");

function init() {
  getOrderList();
}
init();

let orderData = [];
function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (res) {
      orderData = res.data.orders;
      //組訂單字串
      let str = "";
      orderData.forEach(function (item) {
        //組產品字串
        let prodStr = "";
        item.products.forEach(function (proditem) {
          prodStr += `<p>${proditem.title}x${proditem.quantity}</p>`;
        });
        //判斷訂單處理狀態
        let orderStatus = "";
        if (item.paid == true) {
          orderStatus = "處理完畢";
        } else {
          orderStatus = "未處理";
        }
        str += `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${prodStr}
        </td>
        <td>${item.createdAt}</td>
        <td class="orderStatus ">
          <a href="#"><p class="js-orderStaus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</p>
          </a>
        </td>
        <td>
          <input type="button" class="js-orderDel delSingleOrder-Btn" value="刪除" data-id="${item.id}" />
        </td>
      </tr>`;
      });
      orderList.innerHTML = str;
    });
}
orderList.addEventListener("click", function (e) {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  if (targetClass == "js-orderDel delSingleOrder-Btn") {
    alert("你點擊到刪除");
    return;
  }
  if (targetClass == "js-orderStaus") {
    let status = e.target.getAttribute("data-status");
    let id = e.target.getAttribute("data-id");
    orderStatusChange(status, id);
    return;
  }
});

function orderStatusChange(status, id) {
  let newStatus;
  if (status == true) {
    newStatus = false;
  } else {
    newStatus = true;
  }
  axios
    .put(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: id,
          paid: newStatus,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
      getOrderList();
    });
}
