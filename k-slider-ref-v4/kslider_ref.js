//로드 준비
function KSlider(target, option) {
  const toBeLoaded = document.querySelectorAll(`${target} img`);
  if (toBeLoaded.length === 0) {
    throw new Error(target + "라는 노드를 찾지 못했습니다");
  }
  let loadedImages = 0;
  toBeLoaded.forEach((item) => {
    item.onload = () => {
      loadedImages += 1;
      if (loadedImages === toBeLoaded.length) {
        run(target, option);
      }
    };
  });
}
//준비시키기
function run(target, option) {
  const OPTION = setOption(option);
  console.log("ok");
  setNode(target);
  setSliding(target, OPTION);
}
//옵션준비
function setOption(option) {
  //항목 점검
  let OPTION = {
    speed: 1000,
    direction: "horizontal",
  };
  for (prop in option) {
    if (prop in OPTION) {
      //값점검
      exception(prop, option[prop]);
      //값 셋팅
      OPTION[prop] = option[prop];
    } else {
      throw new Error(`사용할 수 없는 옵션입니다. `);
    }
  }
  function exception(prop, value) {
    switch (prop) {
      case "speed":
        if (value > 0) break;
      case "direction":
        if (value === "horizontal" || value === "vertical") break;
      default:
        throw new Error("사용할 수 없는 값입니다.");
    }
  }
  return Object.freeze(OPTION);
}
//노드 준비
function setNode(target) {
  /* 노드 준비 */
  const slider = document.querySelector(target);
  console.dir(slider);
  const kindWrap = document.createElement("div");
  const kindSlider = document.createElement("div");
  slider.classList.add("k_list");
  kindWrap.className = "kind_wrap";
  kindSlider.className = "kind_slider";
  //parentNode : 부모를 찾음
  slider.parentNode.insertBefore(kindWrap, slider);
  kindWrap.appendChild(kindSlider);
  kindSlider.appendChild(slider);

  const slideItems = slider.children;
  for (i = 0; i < slideItems.length; i++) {
    slideItems[i].className = "k_item";
  }
  const cloneA = slideItems[0].cloneNode(true);
  const cloneC = slideItems[slideItems.length - 1].cloneNode(true);
  slider.insertBefore(cloneC, slideItems[0]); //slideItems[0]앞에 cloneC를 넣어준다
  slider.appendChild(cloneA); // 뒤에 자식을 만들어주기

  const moveButton = document.createElement("div");
  moveButton.className = "arrow";
  const prevA = document.createElement("a");
  const nextA = document.createElement("a");
  prevA.className = "prev";
  prevA.textContent = "이전";
  prevA.href = "";
  nextA.className = "next";
  nextA.textContent = "다음";
  nextA.href = "";
  moveButton.appendChild(prevA);
  moveButton.appendChild(nextA);
  kindWrap.appendChild(moveButton);
} // 노드준비
//동작준비
function setSliding(target, OPTION) {
  // 주요 변수 초기화
  let moveDist = 0;
  let currentNum = 1;

  //클론포함 셋팅
  const slider = document.querySelector(target);
  const slideCloneItems = slider.querySelectorAll(".k_item");
  const moveButton = document.querySelector(".arrow");

  //클론포함 넓이 셋팅
  const liWidth = slideCloneItems[0].clientWidth;
  const sliderWidth = liWidth * slideCloneItems.length;
  slider.style.width = `${sliderWidth}px`;

  // 처음 위치 잡기
  moveDist = -liWidth;
  slider.style.left = `${moveDist}px`;
  const POS = { moveDist, liWidth, currentNum };

  // 이벤트 리스너 걸기
  moveButton.addEventListener("click", (ev) => {
    sliding(ev, OPTION, target, POS);
  });
}
//동작
function sliding(ev, OPTION, target, POS) {
  //이전이 눌렸을때
  ev.preventDefault();
  const slider = document.querySelector(target);
  const slideCloneItems = slider.querySelectorAll(".k_item");
  if (ev.target.className === "prev") {
    move(+1);
    if (POS.currentNum === 0) {
      setTimeout(() => {
        slider.style.transition = "none";
        POS.moveDist = -POS.liWidth * (slideCloneItems.length - 2);
        slider.style.left = `${POS.moveDist}px`;
        POS.currentNum = slideCloneItems.length - 2;
      }, OPTION.speed);
    }
  } else {
    //다음이 눌렸을때
    move(-1);
    if (POS.currentNum === slideCloneItems.length - 1) {
      //마지막이면
      setTimeout(() => {
        slider.style.transition = "none"; // 애니 끄고
        POS.moveDist = -POS.liWidth; // 진짜 1값으로 만듬
        slider.style.left = `${POS.moveDist}px`; //진짜 1의 위치로 보내고
        POS.currentNum = 1; //현재번호 업데이트
      }, OPTION.speed);
    }
  }
  function move(direction) {
    POS.currentNum += -1 * direction;
    POS.moveDist += POS.liWidth * direction;
    slider.style.left = `${POS.moveDist}px`;
    slider.style.transition = `all ${OPTION.speed}ms ease`;
  }
}
//============================================
// function KSlider(target, option) {
//   const toBeLoaded = document.querySelectorAll(`${target} img`);
//   if (toBeLoaded.length === 0) {
//     throw new Error(target + "라는 노드를 찾지 못했습니다");
//   }
//   let loadedImages = 0;
//   toBeLoaded.forEach((item) => {
//     item.onload = () => {
//       loadedImages += 1;
//       if (loadedImages === toBeLoaded.length) {
//         innerName(target, option);
//       }
//     };
//   });
//   // 이미지만 로드를 확인해서 innerName() 실행해주기
//   function innerName(target, option) {
//     // node 준비
//     const slider = document.querySelector(target);
//     console.dir(slider);
//     const kindWrap = document.createElement("div");
//     const kindSlider = document.createElement("div");
//     slider.classList.add("k_list");
//     kindWrap.className = "kind_wrap";
//     kindSlider.className = "kind_slider";
//     //parentNode : 부모를 찾음
//     slider.parentNode.insertBefore(kindWrap, slider);
//     kindWrap.appendChild(kindSlider);
//     kindSlider.appendChild(slider);

//     const slideItems = slider.children;
//     for (i = 0; i < slideItems.length; i++) {
//       slideItems[i].className = "k_item";
//     }
//     const cloneA = slideItems[0].cloneNode(true);
//     const cloneC = slideItems[slideItems.length - 1].cloneNode(true);
//     slider.insertBefore(cloneC, slideItems[0]); //slideItems[0]앞에 cloneC를 넣어준다
//     slider.appendChild(cloneA); // 뒤에 자식을 만들어주기
// const moveButton = document.createElement("div");
//     // moveButton.className = "arrow";
//     // const prevA = document.createElement("a");
//     // const nextA = document.createElement("a");
//     // prevA.className = "prev";
//     // prevA.textContent = "이전";
//     // prevA.href = "";
//     // nextA.className = "next";
//     // nextA.textContent = "다음";
//     // nextA.href = "";
//     // moveButton.appendChild(prevA);
//     // moveButton.appendChild(nextA);
//     // kindWrap.appendChild(moveButton);
//     // 아래 moveButton, 태그 생성 줄여서 작성
//     const moveButton = document.createElement("div");
//     moveButton.className = "arrow";
//     moveButton.innerHTML = `
//       <a href="" class="prev">이전</a>
//       <a href="" class="next">다음</a>`;
//     kindWrap.appendChild(moveButton);

//     // 74줄- moveButton, 63-66줄 태그생성
//     // const moveButton = document.createElement("div");
//     // moveButton.className = "arrow";
//     // const prevA = document.createElement("a");
//     // const nextA = document.createElement("a");
//     // prevA.className = "prev";
//     // prevA.textContent = "이전";
//     // prevA.href = "";
//     // nextA.className = "next";
//     // nextA.textContent = "다음";
//     // nextA.href = "";
//     // moveButton.appendChild(prevA);
//     // moveButton.appendChild(nextA);
//     // kindWrap.appendChild(moveButton);

//     //옵션 셋팅
//     const OPTION = (function (opt) {
//       const OPT = { ...opt };
//       if (opt.speed < 0) {
//         throw new Error("0이상 값을 넣으세요.");
//       } else {
//         return Object.freeze(OPT);
//       }
//     })(option);

//     // 주요 변수 초기화
//     let moveDist = 0;
//     let currentNum = 1;
//     // const speedTime = OPTION.speed;

//     // Cssom 셋업
//     const slideCloneLis = slider.querySelectorAll(".k_item");
//     const liWidth = slideItems[0].clientWidth;
//     const sliderWidth = liWidth * slideCloneLis.length;
//     slider.style.width = `${sliderWidth}px`;
//     moveDist = -liWidth;
//     slider.style.left = `${moveDist}px`;

//     // 리스너 설치하기
//     moveButton.addEventListener("click", moveSlide);

//     function moveSlide(ev) {
//       //이전이 눌렸을때
//       ev.preventDefault();

//       if (ev.target.className === "prev") {
//         move(-1);
//         if (currentNum === 0) {
//           setTimeout(() => {
//             slider.style.transition = "none";
//             moveDist = -liWidth * (slideCloneLis.length - 2);
//             slider.style.left = `${moveDist}px`;
//             currentNum = slideCloneLis.length - 2;
//           }, OPTION.speed);
//         }
//       } else {
//         //다음이 눌렸을때
//         move(+1);
//         if (currentNum === slideCloneLis.length - 1) {
//           //마지막이면
//           setTimeout(() => {
//             slider.style.transition = "none"; // 애니 끄고
//             moveDist = -liWidth; // 진짜 1값으로 만듬
//             slider.style.left = `${moveDist}px`; //진짜 1의 위치로 보내고
//             currentNum = 1; //현재번호 업데이트
//           }, OPTION.speed);
//         }
//       }
//       function move(plus) {
//         currentNum += plus;
//         moveDist += -liWidth * plus;
//         slider.style.left = `${moveDist}px`;
//         slider.style.transition = `all ${OPTION.speed}ms ease`;
//       }
//     }
//   }
// }
//=====================================================
