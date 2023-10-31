const calBtn = document.querySelector(".calBtn"); //계산하기 버튼
const refreshBtn = document.querySelector(".refreshBtn"); //초기화 버튼
const waterBtn = document.querySelector(".waterBtn"); //물타기 추가 버튼

const enterStockVal = document.querySelector(".stock_current"); //주식 종목
const waterBox = document.querySelector(".water_box"); //물타기 입력 영역

//1. 현재 주식 상황 - 변수 선언
const totalMoney = document.querySelector(".totalMoney"); //매수금액
const totalPlus = document.querySelector(".totalPlus"); //손익
const totlaPercent = document.querySelector(".totlaPercent"); //수익률
const totalText = document.querySelectorAll(".cal__text"); //~원

//2. 추가 매수 시 주식 현황 - 변수 선언
const totalWaterCount = document.querySelector(".totalWaterCount"); //총 매수 금액
const totalAVG = document.querySelector(".totalAVG"); //평단가
const totalPlus2 = document.querySelector(".totalPlus2"); //손익
const totalUpPercent = document.querySelector(".totalUpPercent"); //수익률
const totalPercent2 = document.querySelector(".totalPercent2"); //원금 회복가능 수익률

addNumComma();

let num = 1;
//물타기 추가 버튼 클릭 시
waterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  num++;
  addWaterList(num);
  addNumComma();
});

//계산하기 버튼 클릭 시
calBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showStockInfo();
});

//초기화 버튼 클릭 시
refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
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
}

let obj = {};

//input - 3자리마다 , 추가
function addNumComma() {
  const input = document.querySelectorAll("input");

  for (const inputVal of input) {
    inputVal.addEventListener("keyup", (e) => {
      let value = e.target.value;

      if (inputVal.className === "stock__text") {
        if (e.key === "Enter") {
          data(value);
        }
        return;
      }

      addComma(inputVal, value);
    });
  }
}

function addComma(inputVal, value) {
  value = value && Number(value.replaceAll(",", ""));
  obj[inputVal.id] = value;

  if (isNaN(value)) {
    inputVal.value = 0;
  } else {
    const formatValue = value.toLocaleString("ko-KR");
    inputVal.value = formatValue;
  }
}

//api 통해 입력한 종목의 최근 측정된 최종 가격 가져오기
async function data(value) {
  const baseURL =
    "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
  const API_KEY = config.apikey;
  const reqUrl = `${baseURL}?serviceKey=${API_KEY}&resultType=json&itmsNm=${value}`;

  await fetch(reqUrl)
    .then((res) => res.json())
    .then((data) => {
      // return console.log(data);
      const searchResult = data.response.body.items.item[0].clpr;
      addComma(enterStockVal, searchResult);
    });
}

//현재 주식 현황 표시
function showStockInfo() {
  const input = document.querySelectorAll("input");

  input.forEach((item) => {
    item.value = parseInt(item.value.replace(/,/g, ""));
  });

  const { stockMoney, myCnt, myMoney } = obj;

  const value1 = myMoney * myCnt; //매수 금액
  const value2 = stockMoney * myCnt - value1; //손익
  const value3 = (((stockMoney - myMoney) / myMoney) * 100).toFixed(1); //수익률

  showAddStockInfo(input);

  totalMoney.textContent = `${value1.toLocaleString("ko-KR")}`;
  totalPlus.textContent = `${value2.toLocaleString("ko-KR")}`;
  totlaPercent.textContent = `${value3.toLocaleString("ko-KR")}`;
}

//추가 매수 시 주식 현황 표시
function showAddStockInfo(input) {
  const waterstockMoney = document.querySelectorAll(".waterScale"); //매수 주식 단가
  const waterStockCount = document.querySelectorAll(".waterCnt"); //매수 주식 수량

  let arr1 = []; //총 물타기 금액
  let arr2 = []; //총 물타기 개수
  let allCnt = 0;
  let result = 0;

  waterstockMoney.forEach((money) => {
    arr1.push(money.value);
  });

  waterStockCount.forEach((cnt) => {
    arr2.push(Number(cnt.value));
    allCnt = arr2.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  });

  for (let i = 0; i < arr1.length; i++) {
    result += arr1[i] * arr2[i];
  }

  const { stockMoney, myCnt, myMoney } = obj;

  const value4 = myMoney * myCnt + result; //총 매수 금액
  const value5 = value4 / (allCnt + myCnt); //평단가
  const value6 = stockMoney * (allCnt + myCnt) - value4; //손익
  const value7 = ((value6 / value4) * 100).toFixed(1); //수익률
  const value8 = (((value5 - stockMoney) / stockMoney) * 100).toFixed(1);

  totalWaterCount.textContent = `${value4.toLocaleString("ko-KR")}`;
  totalAVG.textContent = `${value5.toLocaleString("ko-KR")}`;
  totalPlus2.textContent = `${value6.toLocaleString("ko-KR")}`;
  totalUpPercent.textContent = `${value7.toLocaleString("ko-KR")}`;
  totalPercent2.textContent = `${value8.toLocaleString("ko-KR")}`;

  input.forEach((item) => {
    addComma(item, item.value);
  });

  totalText.forEach((text) => text.setAttribute("style", "visibility:visible"));
}
