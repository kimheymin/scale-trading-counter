const input = document.querySelectorAll("input");
const inputArr = Array.prototype.slice.call(input);

const calBtn = document.querySelector(".calBtn"); //계산하기 버튼
const refreshBtn = document.querySelector(".refreshBtn"); //초기화 버튼
const waterBtn = document.querySelector(".waterBtn"); //물타기 추가 버튼

//왼쪽 영역 변수 선언
const waterBox = document.querySelector(".water_box"); //물타기 입력 영역
const enterStock = document.querySelector(".stock__text");
const enterStockVal = document.querySelector(".stock_current");

//오른쪽 영역 변수 선언
const stockVal = document.querySelector(".stock_current"); //주식 단가
const mystockMoney = document.querySelector(".myMoney"); //내 주식 단가
const mySockCount = document.querySelector(".myCnt"); //주식 보유 수량
const totalText = document.querySelectorAll(".cal__text"); //~원

//1. 현재 주식 상황 - 변수 선언
const totalMoney = document.querySelector(".totalMoney"); //매수금액
const totalPlus = document.querySelector(".totalPlus"); //손익
const totlaPercent = document.querySelector(".totlaPercent"); //수익률

//2. 추가 매수 시 주식 현황 - 변수 선언
const totalWaterCount = document.querySelector(".totalWaterCount");
const totalAVG = document.querySelector(".totalAVG");
const totalPlus2 = document.querySelector(".totalPlus2"); //손익
const totalUpPercent = document.querySelector(".totalUpPercent");
const totalPercent2 = document.querySelector(".totalPercent2");

//api 통해 입력한 종목의 최근 측정된 최종 가격 가져오기
async function data(value) {
  const baseURL =
    "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";
  const serviceKey =
    "084OlMmA%2FZos%2BCYHE8MIi3LwLDve4g4snFTBVmk9VuuXyaMs%2FQbFyOGSzuoqt79IovmwKf49cxjwCupgvaWX1Q%3D%3D";

  const params = { resultType: "json", itmsNm: value };
  const reqUrl = `${baseURL}?serviceKey=${serviceKey}&resultType=json&itmsNm=${value}`;

  await fetch(reqUrl)
    .then((res) => res.json())
    .then((data) => {
      const searchResult = data.response.body.items.item[0].clpr;
      return (enterStockVal.value = searchResult);
    });
}

inputValCheck();
//addNumComma();

for (const inputVal of input) {
  let arr = [];

  //초기화 버튼 클릭 시 입력값 모두 초기화
  refreshBtn.addEventListener("click", (e) => {
    e.preventDefault();
    inputVal.value = "";
  });

  //input - 3자리마다 , 추가
  inputVal.addEventListener("keyup", (e) => {
    let value = e.target.value;

    if (inputVal.className === "stock__text") {
      if (e.key === "Enter") {
        data(value);
      }
      return;
    }

    // value = Number(value.replaceAll(",", ""));

    // if (isNaN(value)) {
    //   inputVal.value = 0;
    // } else {
    //   const formatValue = value.toLocaleString("ko-KR");
    //   inputVal.value = formatValue;
    // }
  });

  calBtn.addEventListener("click", (e) => {
    e.preventDefault();
    //parseInt(inputVal.value.replace(/,/g, ""));

    showStockInfo();
  });
  // console.log(arr);

  // console.log(obj);
}

// //계산하기 버튼 클릭 시
// calBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   showStockInfo();

//   // inputValCheck();
//   // const inputVal = inputValCheck();

//   // console.log(inputVal);
//   // return inputVal ? showStockInfo() : alert("입력값을 확인해주세요.");

//   // const addstockMoney_val = addstockMoney.value;
//   // const addstockCount_val = addSockCount.value;

//   let sum1 = 0; //총 물타기 금액
//   let sum2 = 0; //총 물타기 개수

//   // waterstockMoney.forEach((money1) => (sum1 += Number(money1.value)));
//   // waterSockCount.forEach((money2) => (sum2 += Number(money2.value)));

//   totalText.forEach((text) => text.setAttribute("style", "visibility:visible"));
// });

//물타기 추가 버튼 클릭 시
waterBtn.addEventListener("click", (e) => {
  let num = 1;
  e.preventDefault();
  addWaterList(num);
});

//물타기에 신규 행 추가
function addWaterList(num) {
  num++;

  const waterList = document.createElement("div");
  waterList.setAttribute("class", "water__list");

  waterList.innerHTML = `
    <input type="text" class="waterScale addMoney${num}" />원
    <input type="text" class="cntBox waterCnt addCnt${num}" />주
  `;

  waterBox.appendChild(waterList);
}

//현재 주식 현황 표시
function showStockInfo() {
  console.log(inputArr);
  let arr = [];
  inputArr.map((item) => arr.push({ [item.id]: item.value }));
  console.log(arr);

  const stockVal_val = stockVal.value;
  // const stockVal = arr[1].value;

  const mystockMoney_val = mystockMoney.value;
  const mySockCount_val = mySockCount.value;

  const value1 = mystockMoney_val * mySockCount_val; //매수 금액
  const value2 =
    stockVal_val * mySockCount_val - mystockMoney_val * mySockCount_val; //손익
  const value3 = (
    ((stockVal_val - mystockMoney_val) / mystockMoney_val) *
    100
  ).toFixed(1); //수익률

  showAddStockInfo(stockVal_val, mystockMoney_val, mySockCount_val);

  totalMoney.textContent = `${value1}`;
  totalPlus.textContent = `${value2}`;
  totlaPercent.textContent = `${value3}`;

  totalText.forEach((text) => text.setAttribute("style", "visibility:visible"));
}

//추가 매수 시 주식 현황 표시
function showAddStockInfo(stockVal_val, mystockMoney_val, mySockCount_val) {
  const waterstockMoney = document.querySelectorAll(".waterScale"); //매수 주식 단가
  const waterStockCount = document.querySelectorAll(".waterCnt"); //매수 주식 수량

  let arr1 = []; //총 물타기 금액
  let arr2 = []; //총 물타기 개수
  let allMoney = 0;
  let allCnt = 0;
  let result = 0;

  waterstockMoney.forEach((money1) => {
    arr1.push(Number(money1.value));
    allMoney += Number(money1.value);
  });
  waterStockCount.forEach((money2) => {
    arr2.push(Number(money2.value));
    allCnt += Number(money2.value);
  });

  for (let i = 0; i < arr1.length; i++) {
    result += arr1[i] * arr2[i];
  }

  //추가매수 시 주식 현황
  const value4 = mystockMoney_val * mySockCount_val + result; //총 매수 금액
  const value5 = value4 / (allCnt + mySockCount_val); //평단가
  const value6 = stockVal_val * (allCnt + mySockCount_val) - value4; //손익
  const value7 = ((value6 / value4) * 100).toFixed(1); //수익률
  const value8 = (((value5 - stockVal_val) / stockVal_val) * 100).toFixed(1); //원금 회복가능 수익률

  totalWaterCount.textContent = `${value4}`;
  totalAVG.textContent = `${value5}`;
  totalPlus2.textContent = `${value6}`;
  totalUpPercent.textContent = `${value7}`;
  totalPercent2.textContent = `${value8}`;
}

function addNumComma() {
  value = Number(value.replaceAll(",", ""));

  if (isNaN(value)) {
    inputVal.value = 0;
  } else {
    const formatValue = value.toLocaleString("ko-KR");
    inputVal.value = formatValue;
  }
}

function inputValCheck() {}
