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
        //組時間
        const timpStamp = new Date(item.createdAt * 1000);
        const orderdaytime = `${timpStamp.getFullYear()}/${
          timpStamp.getMonth() + 1
        }/${timpStamp.getDate()}`;
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
        <td>${orderdaytime}</td>
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
      C3render();
    });
}
orderList.addEventListener("click", function (e) {
  e.preventDefault();
  const targetClass = e.target.getAttribute("class");
  let id = e.target.getAttribute("data-id");
  if (targetClass == "js-orderDel delSingleOrder-Btn") {
    delorderItem(id);
    return;
  }
  if (targetClass == "js-orderStaus") {
    let status = e.target.getAttribute("data-status");

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
function delorderItem(id) {
  //console.log(id);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (res) {
      alert("你已刪除一筆訂單");
      getOrderList();
    });
}
function C3render() {
  console.log(orderData);

  let total = {};
  orderData.forEach(function (item) {
    item.products.forEach(function (cjItem) {
      if (total[cjItem.category] == undefined) {
        total[cjItem.category] = cjItem.price * cjItem.quantity;
      } else {
        total[cjItem.category] += cjItem.price * cjItem.quantity;
      }
    });
  });
  console.log(total);
  //整理我要的格式  上面做出來會像這樣 {收納: 1560, 床架: 69000}
  let newArr = [];
  let categoryArr = Object.keys(total);
  console.log(categoryArr);
  categoryArr.forEach(function (item) {
    let arr = [];
    arr.push(item);
    arr.push(total[item]);
    newArr.push(arr);
  });
  console.log(newArr);

  // C3.js
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      type: "pie",
      columns: newArr,
      colors: {
        床架: "#FAF",
        收納: "#9D7FEA",
        "Anty 雙人床架": "#5434A7",
        其他: "#301E5F",
      },
    },
  });
}

const delAlloder = document.querySelector(".discardAllBtn");
delAlloder.addEventListener("click", function (e) {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (response) {
      alert("刪光光!!");
      getOrderList();
    });
});
