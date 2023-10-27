const data = [
  {
    text: "성공은 그 자체로 실패의 씨앗을 품고 있으며, 실패는 그 자체로 성공의 씨앗을 품고 있다.",
    img: "/datas/images/img1.jpg",
  },
  {
    text: "가치에 대한 확고한 신념이 있어야만 수익이 발생하지 않는 기간을 버텨낼 수 있다.",
    img: "/datas/images/img2.jpg",
  },
  {
    text: "시장의 타이밍을 맞추려고 애쓰는 것은 스스로를 불안과 초조의 깊은 늪으로 빠트리는 지름길이다.",
    img: "/datas/images/img3.jpg",
  },
  {
    text: "주식을 평가하는 최선의 방법은 해당 기업의 현금 흐름을 분석하는 것이다.",
    img: "/datas/images/img4.jpg",
  },
  {
    text: "돈을 빨리 벌고자 하는 유혹이 너무 커서 많은 투자자들이 대중에 역하는 것을 어려워한다.",
    img: "/datas/images/img5.jpg",
  },
  {
    text: "일관성과 인내심을 가지는 것이 중요하다. 참으면 참을수록 복리라는 놈은 더더욱 당신 편이 될 것이다.",
    img: "/datas/images/img6.jpg",
  },
  {
    text: "최적의 매수 타이밍은 시장에 피가 낭자할 때다. 설령 그것이 당신의 피일지라도 말이다.",
    img: "/datas/images/img7.jpg",
  },
  {
    text: "보수적인 투자란 최소한의 리스크로 자신이 갖고 있는 자산의 구매력을 가장 잘 지키는 것이다.",
    img: "/datas/images/img8.jpg",
  },
  {
    text: "현명한 투자자는 비관주의자에게서 주식을 사서 낙관주의자에게 판다.",
    img: "/datas/images/img9.jpg",
  },
  {
    text: "투자자가 대중의 히스테리에 파묻히지 않으려면 훈련을 해야 하며, 냉정하다 못해 냉소적이기까지 해야 한다.",
    img: "/datas/images/img10.jpg",
  },
  {
    text: "내가 엄청난 투자의 오류를 하나 고른다면, 그것은 주가가 오르면 자신이 투자를 잘 했다고 믿는 사고방식이다.",
    img: "/datas/images/img2.jpg",
  },
];

const banner = document.querySelector(".header__randomBanner");

const bannerData = data[Math.floor(Math.random() * data.length)];
const bannerHtml = `
  <img class="header__img" src="${bannerData.img}" alt="img" />
  <p class="header__text">${bannerData.text}</p>
`;

banner.innerHTML = bannerHtml;
