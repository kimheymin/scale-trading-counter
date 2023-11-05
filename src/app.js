const searchBtn = document.querySelector(".searchBtn"); //돋보기 버튼
const calBtn = document.querySelector(".calBtn"); //계산하기 버튼
const refreshBtn = document.querySelector(".refreshBtn"); //초기화 버튼
const waterBtn = document.querySelector(".waterBtn"); //물타기 추가 버튼

const enterStockVal = document.querySelector(".stock_current"); //주식 종목
const waterBox = document.querySelector(".water_box"); //물타기 입력 영역

let obj = {};

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

  const inputCheckOk = inputValCheck();
  inputCheckOk ? showStockInfo() : alert("입력값을 확인해주세요.");
});

//초기화 버튼 클릭 시
refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

//돋보기 버튼 클릭 시
searchBtn.addEventListener("click", (e) => {
  const stock = document.querySelector(".stock__text");
  data(stock.value);
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

//입력값 빈값 여부 체크
function inputValCheck() {
  const input = document.querySelectorAll("input");
  const inputArr = Array.prototype.slice.call(input);

  return inputArr.every((val) => val.value !== "");
}

//input - 3자리마다 , 추가
function addNumComma() {
  const input = document.querySelectorAll("input");

  for (const inputVal of input) {
    inputVal.addEventListener("keyup", (e) => {
      if (inputVal.className === "stock__text") {
        return;
      }

      let value = e.target.value;
      addComma(inputVal, value);
    });
  }
}

function addComma(inputVal, value) {
  value = value && Number(value.replaceAll(",", ""));
  obj[inputVal.id] = value;

  inputVal.value = isNaN(value) ? 0 : value.toLocaleString("ko-KR");
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
      const searchResult = data.response.body.items.item[0].clpr;
      addComma(enterStockVal, searchResult);
    });
}

//주식 현황 표시
function showStockInfo() {
  const input = document.querySelectorAll("input");
  const input_array = Array.prototype.slice.call(input).slice(1);
  input_array.map(
    (item) => (item.value = parseInt(item.value.replace(/,/g, "")))
  );

  const water_arr = input_array.filter((item, index) => index >= 3);

  let waterMoenyArr = []; //총 물타기 금액 담을 배열
  let waterCntArr = []; //총 물타기 개수 담을 배열

  let waterMoeny = 0; ////총 물타기 금액
  let waterCnt = 0; //총 물타기 개수

  water_arr.map((item, index) => {
    if (index % 2 === 0) {
      return waterMoenyArr.push(Number(item.value));
    }
    return waterCntArr.push(Number(item.value));
  });

  for (let i = 0; i < waterMoenyArr.length; i++) {
    waterMoeny += waterMoenyArr[i] * waterCntArr[i];
    waterCnt += waterCntArr[i];
  }

  const { stockMoney, myCnt, myMoney } = obj;

  const value1 = myMoney * myCnt; //매수 금액
  const value2 = stockMoney * myCnt - value1; //손익
  const value3 = (((stockMoney - myMoney) / myMoney) * 100).toFixed(1); //수익률
  const value4 = value1 + waterMoeny; //총 매수 금액
  const value5 = value4 / (waterCnt + myCnt); //평단가
  const value6 = stockMoney * (waterCnt + myCnt) - value4; //손익
  const value7 = ((value6 / value4) * 100).toFixed(1); //수익률
  const value8 = (((value5 - stockMoney) / stockMoney) * 100).toFixed(1); //원금 회복가능 수익률

  let valueArr = [];
  valueArr.push(value1, value2, value3, value4, value5, value6, value7, value8);

  const span = document.querySelectorAll(".resultCnt");
  const span_array = Array.prototype.slice.call(span);

  for (let i = 0; i < span_array.length; i++) {
    if (valueArr[i] < 0) {
      span_array[i].setAttribute("style", "color:blue");
    } else {
      span_array[i].setAttribute("style", "color:red");
    }

    span_array[i].textContent = valueArr[i].toLocaleString("ko-KR");
  }

  input_array.map((item) => addComma(item, item.value));

  const totalText = document.querySelectorAll(".cal__text");
  totalText.forEach((text) => text.setAttribute("style", "visibility:visible"));
}