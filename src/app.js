const input = document.querySelectorAll("input");
const calBtn = document.querySelector(".calBtn");

const waterBtn = document.querySelector('.waterBtn');
const waterBox = document.querySelector('.water_box');

const scockVal = document.querySelector(".scock_current");
const myScockMoney = document.querySelector(".myMoney");
const mySockCount = document.querySelector(".myCnt");
const addScockMoney = document.querySelector(".addMoney");
const addSockCount = document.querySelector(".addCnt");

const totalMoney = document.querySelector(".totalMoney");
const totalPlus = document.querySelector(".totalPlus");
const totlaPercent = document.querySelector(".totlaPercent");
const totalText = document.querySelectorAll('.cal__text');

calBtn.addEventListener('click', (e)=> {
  e.preventDefault();

  const myScockMoney_val = myScockMoney.value;
  const mySockCount_val = mySockCount.value;
  const scockVal_val = scockVal.value;

  const value1 = myScockMoney_val * mySockCount_val;
  const value2 = scockVal_val * mySockCount_val - myScockMoney_val * mySockCount_val;
  const value3 = (((scockVal_val - myScockMoney_val) / myScockMoney_val) * 100).toFixed(1);

  totalMoney.textContent = `${value1}`;
  totalPlus.textContent = `${value2}`;
  totlaPercent.textContent = `${value3}`;
  
  totalText.forEach(text => text.setAttribute('style','visibility:visible'));
})

waterBtn.addEventListener('click', (e)=> {
  e.preventDefault();
  
  const waterList = document.createElement('div');
  waterList.setAttribute('class','water__list');

  waterList.innerHTML = `
    <input type="number" class="myScale addMoney" />원
    <input type="number" class="myScale addCnt" />주
  `;

  waterBox.appendChild(waterList);
})