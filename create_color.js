// グローバルスコープで変数を宣言
const selectedColors = [];

document.addEventListener("DOMContentLoaded", () => {
    const colors = [
      "#A6B5A5", "#F4EBDA", "#769CBF", "#D99AAD", "#D89323",
      "#007A02", "#28A6A5", "#CF2B0E", "#A05CB0", "#B4BC4E"
    ];
    // #A6B5A5: セージグリーン (Sage Green)
    // #F4EBDA: アイボリー (Ivory)
    // #769CBF: コーンフラワーブルー (Cornflower Blue)
    // #D99AAD: ピンクパール (Pink Pearl)
    // #D89323: ゴールデンロッド (Goldenrod)
    // #007A02: フォレストグリーン (Forest Green)
    // #28A6A5: ティール (Teal)
    // #CF2B0E: チリレッド (Chili Red)
    // #A05CB0: ヘリオトロープ (Heliotrope)
    // #3B535F: チャコールグレー (Charcoal Gray)

    const circleContainer = document.getElementById("circle-container");
    const nextButton = document.getElementById("next-button");
  
    // カラーボール作成
    colors.forEach((color, index) => {
        const angle = (index * (360 / colors.length)) * (Math.PI / 180);
        const x = Math.cos(angle) * 100;　　// 円の半径
        const y = Math.sin(angle) * 100;

        const ball = document.createElement("div");
        ball.classList.add("rotating-ball");
        ball.style.backgroundColor = color;
        ball.style.transform = `translate(${x}px, ${y}px)`;

        circleContainer.appendChild(ball);
        ball.addEventListener("click", () => handleSelectColor(color, ball));
    });
  
    // 色選択の処理
    function handleSelectColor(color, ball) {
        if (selectedColors.includes(color)) {
            selectedColors.splice(selectedColors.indexOf(color), 1);
            ball.classList.remove("selected");
        } else if (selectedColors.length < 2) {
            selectedColors.push(color);
            ball.classList.add("selected");
        }
        updateNextButton();
    }
  
    // 次へボタンの状態更新
    function updateNextButton() {
        if (selectedColors.length === 2) {
            nextButton.classList.add("visible");
        } else {
            nextButton.classList.remove("visible");
        }
    }

    // 次へボタンのクリックイベント
    nextButton.addEventListener("click", () => {
        if (selectedColors.length === 2) {
            localStorage.setItem('color1', selectedColors[0]);
            localStorage.setItem('color2', selectedColors[1]);
            window.location.href = "mix_color.html";
        }
    });
});
