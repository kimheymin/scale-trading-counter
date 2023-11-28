const startDate = document.querySelector(".startDate"); //조회 시작일
const endDate = document.querySelector(".endDate"); //조회 종료일
const stockName = document.querySelector(".stock__name"); //종목명
const searchBtn = document.querySelector(".searchBtn"); //조회 버튼

const stockSearchName = document.querySelector(".stock__text"); //조회한 주식 종목명
const stockSearchVal = document.querySelector(".stock_current"); //조회한 종목 최근 종가

const calBtn = document.querySelector(".calBtn"); //계산하기 버튼
const refreshBtn = document.querySelector(".refreshBtn"); //초기화 버튼
const waterBtn = document.querySelector(".waterBtn"); //물타기 추가 버튼
const waterBox = document.querySelector(".water_box"); //물타기 입력 영역

const stockMemo = document.querySelector(".stockMemo");
const resultMemo = document.querySelector(".resultMemo");

let ctx = document.querySelector("#myChart");

let obj = {};
let clicked = false;
let chart = "";

dataInit(); //날짜 초기화
addNumComma();

//클릭 시 메모 보여주기
window.addEventListener("click", (e) => {
  clicked = !clicked;

  if (e.target.className.includes("stockMemo__icon") && clicked) {
    stockMemo.style.display = "block";
  } else if (e.target.className.includes("resultMemo__icon") && clicked) {
    resultMemo.style.display = "block";
  } else {
    resultMemo.style.display = "none";
    stockMemo.style.display = "none";
  }
});

// 검색 버튼 클릭 시
searchBtn.addEventListener("click", async () => {
  const stockValue = stockName.value; //입력한 주식종목 값
  if (stockValue.length === 0) {
    alert("종목명을 입력해주세요.");
    return;
  }

  const startDateVal = startDate.value.replace(/-/g, "");
  const endDateVal = endDate.value.replace(/-/g, "");

  if (startDateVal - endDateVal < -10) {
    alert("차트 표시를 위해 조회 기간은 10일 이내로 설정해야합니다.");
    return;
  }

  data(startDateVal, endDateVal, stockValue);
});

//차트 생성
function drawChart(data) {
  chart && chart.destroy();

  let chartDate = [];
  let priceData = [];
  let labelName = "";

  data.item.map((item) => {
    chartDate.push(item.basDt);
    priceData.push(item.clpr);
    labelName = item.itmsNm;
  });

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartDate.reverse(),
      datasets: [
        {
          label: `${labelName} 종가`,
          data: priceData.reverse(),
          borderWidth: 1,
        },
      ],
    },
  });

  stockSearchName.value = labelName;
  stockSearchVal.value = data.item[0].clpr;
  addComma(stockSearchVal, stockSearchVal.value);
}

//api 통해 입력한 종목의 가격 가져오기
async function data(startDate, endDate, stockValue) {
  const baseURL =
    "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
  const API_KEY = config.apikey;
  const reqUrl = `${baseURL}?serviceKey=${API_KEY}&beginBasDt=${startDate}&endBasDt=${endDate}&itmsNm=${stockValue}&resultType=json`;

  await fetch(reqUrl)
    .then((res) => res.json())
    .then((data) => {
      const chartData = data.response.body.items;
      return drawChart(chartData);
    });
}

//초기 날짜 지정
function dataInit() {
  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;
  const sevenDaysAgo = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate() - 7}`;

  startDate.value = sevenDaysAgo;
  endDate.value = today;
}

let num = 1;
//물타기 추가 버튼 클릭 시
waterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  num++;
  addWaterList(num);
  addNumComma();
});

//물타기에 신규 행 추가
function addWaterList(num) {
  const waterList = document.createElement("div");
  waterList.setAttribute("class", "water__list");

  waterList.innerHTML = `
    <label><input type="text" class="waterScale" id="addMoney${num}" />원</label>
    <label><input type="text" class="cntBox waterCnt" id="addCnt${num}" />주</label>
  `;

  waterBox.appendChild(waterList);
  waterList.scrollIntoView({ block: "center" });
}

//input - 3자리마다 , 추가
function addNumComma() {
  const input = document.querySelectorAll("input");

  for (const inputVal of input) {
    inputVal.addEventListener("keyup", (e) => {
      if (inputVal.className === "stock__name") {
        return;
      }

      let value = e.target.value;
      addComma(inputVal, value);
    });
  }
}

//계산하기 버튼 클릭 시
calBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const stockValue = stockName.value; //입력한 주식종목 값
  if (stockValue.length === 0) {
    return alert("종목 검색 후 계산할 수 있습니다.");
  }

  const inputCheckOk = inputValCheck();
  inputCheckOk ? showStockInfo() : alert("입력값을 확인해주세요.");
});

//초기화 버튼 클릭 시
refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

//입력값 빈값 여부 체크
function inputValCheck() {
  const input = document.querySelectorAll("input");
  const inputArr = Array.prototype.slice.call(input);

  return inputArr.every((val) => val.value !== "");
}

function addComma(inputVal, value) {
  value = value && Number(value.replaceAll(",", ""));
  obj[inputVal.id] = value;

  inputVal.value = isNaN(value) ? 0 : value.toLocaleString("ko-KR");
}

//주식 현황 표시
function showStockInfo() {
  const input = document.querySelectorAll("input");
  const input_array = Array.prototype.slice.call(input).slice(4);

  input_array.map(
    (item) => (item.value = parseInt(item.value.replace(/,/g, "")))
  );

  const water_arr = input_array.filter((item, index) => index >= 3);

  let waterMoneyArr = []; //총 물타기 금액 담을 배열
  let waterCntArr = []; //총 물타기 개수 담을 배열

  let waterMoney = 0; ////총 물타기 금액
  let waterCnt = 0; //총 물타기 개수

  water_arr.map((item, index) => {
    if (index % 2 === 0) {
      return waterMoneyArr.push(Number(item.value));
    }
    return waterCntArr.push(Number(item.value));
  });

  for (let i = 0; i < waterMoneyArr.length; i++) {
    waterMoney += waterMoneyArr[i] * waterCntArr[i];
    waterCnt += waterCntArr[i];
  }

  const { stockMoney, myCnt, myMoney } = obj;

  const totalMoney = myMoney * myCnt; //매수 금액
  const totalProfit = stockMoney * myCnt - totalMoney; //손익
  const totalRate = (((stockMoney - myMoney) / myMoney) * 100).toFixed(1); //수익률
  const waterTotalMoney = totalMoney + waterMoney; //총 매수 금액
  const waterTotalAverage = waterTotalMoney / (waterCnt + myCnt); //평단가
  const waterTotalProfit = stockMoney * (waterCnt + myCnt) - waterTotalMoney; //손익
  const waterTotalRate = ((waterTotalProfit / waterTotalMoney) * 100).toFixed(
    1
  ); //수익률
  const waterTotalRecovery = (
    ((waterTotalAverage - stockMoney) / stockMoney) *
    100
  ).toFixed(1); //원금 회복가능 수익률

  let valueArr = [
    totalMoney,
    totalProfit,
    totalRate,
    waterTotalMoney,
    waterTotalAverage,
    waterTotalProfit,
    waterTotalRate,
    waterTotalRecovery,
  ];

  const span = document.querySelectorAll(".resultCnt");
  const span_array = Array.prototype.slice.call(span);

  for (let i = 0; i < span_array.length; i++) {
    span_array[i].style.color = valueArr[i] < 0 ? "blue" : "red";
    span_array[i].textContent = Math.floor(valueArr[i]).toLocaleString("ko-KR");
  }

  input_array.map((item) => addComma(item, item.value));

  const totalText = document.querySelectorAll(".cal__text");
  totalText.forEach((text) => (text.style.visibility = "visible"));
}
