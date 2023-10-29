const input = document.querySelectorAll("input");
const calBtn = document.querySelector(".calBtn"); //계산하기 버튼

//왼쪽 영역 변수 선언
const waterBtn = document.querySelector(".waterBtn"); //물타기 추가 버튼
const waterBox = document.querySelector(".water_box"); //물타기 입력 영역

//오른쪽 영역 변수 선언
const stockVal = document.querySelector(".stock_current"); //주식 단가
const mystockMoney = document.querySelector(".myMoney"); //내 주식 단가
const mySockCount = document.querySelector(".myCnt"); //주식 보유 수량

//1. 현재 주식 상황 - 변수 선언
const totalMoney = document.querySelector(".totalMoney"); //매수금액
const totalPlus = document.querySelector(".totalPlus"); //손익
const totlaPercent = document.querySelector(".totlaPercent"); //수익률
const totalText = document.querySelectorAll(".cal__text"); //~원

//2. 추가 매수 시 주식 현황 - 변수 선언
const totalWaterCount = document.querySelector(".totalWaterCount");
const totalAVG = document.querySelector(".totalAVG");
const totalPlus2 = document.querySelector(".totalPlus2"); //손익
const totalUpPercent = document.querySelector(".totalUpPercent");
const totalPercent2 = document.querySelector(".totalPercent2");

//계산하기 버튼 클릭 시
calBtn.addEventListener("click", (e) => {
  e.preventDefault();

  showStockInfo();
  // showAddStockInfo();

  // const addstockMoney_val = addstockMoney.value;
  // const addstockCount_val = addSockCount.value;

  let sum1 = 0; //총 물타기 금액
  let sum2 = 0; //총 물타기 개수

  // waterstockMoney.forEach((money1) => (sum1 += Number(money1.value)));
  // waterSockCount.forEach((money2) => (sum2 += Number(money2.value)));

  totalText.forEach((text) => text.setAttribute("style", "visibility:visible"));
});

let num = 1;

//물타기 추가 버튼 클릭 시
waterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addWaterList(num);
});

//물타기에 신규 행 추가
function addWaterList(num) {
  num++;

  const waterList = document.createElement("div");
  waterList.setAttribute("class", "water__list");

  waterList.innerHTML = `
    <input type="number" class="waterScale addMoney${num}" />원
    <input type="number" class="waterCnt addCnt${num}" />주
  `;

  waterBox.appendChild(waterList);
}

//현재 주식 현황 표시
function showStockInfo() {
  const stockVal_val = stockVal.value;

  const mystockMoney_val = mystockMoney.value;
  const mySockCount_val = Number(mySockCount.value);

  const value1 = mystockMoney_val * mySockCount_val; //매수 금액
  const value2 =
    stockVal_val * mySockCount_val - mystockMoney_val * mySockCount_val; //손익
  const value3 = (((stockVal_val - mystockMoney_val) / mystockMoney_val) *100).toFixed(1); //수익률

  showAddStockInfo(stockVal_val, mystockMoney_val, mySockCount_val);

  totalMoney.textContent = `${value1}`;
  totalPlus.textContent = `${value2}`;
  totlaPercent.textContent = `${value3}`;
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
  const value8 = (((value5 - stockVal_val) / stockVal_val) * 100).toFixed(1);

  totalWaterCount.textContent = `${value4}`;
  totalAVG.textContent = `${value5}`;
  totalPlus2.textContent = `${value6}`;
  totalUpPercent.textContent = `${value7}`;
  totalPercent2.textContent = `${value8}`;
}
