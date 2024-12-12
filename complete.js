document.addEventListener("DOMContentLoaded", () => {
    const CLASSNAME = "-visible";
    const DELAY = 1300; // 開始までの遅延時間
    const target = document.querySelector(".title");

    // 1.5秒後に1回だけアニメーションを実行
    setTimeout(() => {
        target.classList.add(CLASSNAME);
    }, DELAY);
});