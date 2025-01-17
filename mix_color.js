document.addEventListener("DOMContentLoaded", () => {
    const loadingText = document.getElementById("loading-text");
    const startButton = document.getElementById("start-button");
    const colors = [
        localStorage.getItem('color1') || "#FF0000",
        localStorage.getItem('color2') || "#0000FF"
    ];
    let mixProgress = 0;
    let cooldown = false;
    const shakeThreshold = 40; // 加速度センサーの閾値
  
    const hexToRgb = (hex) =>
      hex
        .replace("#", "")
        .match(/.{1,2}/g)
        .map((x) => parseInt(x, 16));
  
    const rgbToHex = ([r, g, b]) =>
      `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  
    const blendColors = (color1, color2, progress) => {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const blended = rgb1.map((c, i) =>
        Math.floor(c + (rgb2[i] - c) * (progress / 100))
      );
      return rgbToHex(blended);
    };
  
    const updateBlendedColor = () => {
      const blendedColor = blendColors(colors[0], colors[1], mixProgress);
      loadingText.style.setProperty("--progress", `${mixProgress}%`);
      loadingText.style.setProperty("--blended-color", blendedColor);
      if (mixProgress >= 100) {
        startButton.classList.add("visible");
        localStorage.setItem('mixedColor', blendedColor);
      }
    };
  
    const handleShake = (event) => {
      const acceleration = event.acceleration || {};
      const y = acceleration.y || 0;
  
      if (!cooldown && Math.abs(y) > shakeThreshold) {
        mixProgress = Math.min(mixProgress + 10, 100);
        updateBlendedColor();
        cooldown = true;
  
        setTimeout(() => (cooldown = false), 300);
      }
    };
  
    const requestPermission = async () => {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== "granted") {
            alert("加速度センサーの使用が許可されませんでした。");
          }
        } catch (error) {
          console.error("加速度センサーの使用許可リクエスト中にエラー:", error);
        }
      }
    };
  
    const addSafariPermissionListener = () => {
      const handleClick = () => {
        requestPermission();
        window.removeEventListener("click", handleClick);
      };
      window.addEventListener("click", handleClick);
    };
  
    if (
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    ) {
      addSafariPermissionListener(); // Safari用許可
    } else {
      requestPermission(); // Chrome用
    }
  
    window.addEventListener("devicemotion", handleShake);
});
  
document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.getElementById("start-button");

    nextButton.addEventListener("click", () => {
        window.location.href = "description.html"; // 遷移先のHTMLファイル名を指定
    });
});