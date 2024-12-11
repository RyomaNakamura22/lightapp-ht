document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("color-canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // mixcolorから渡された色を取得
    const urlParams = new URLSearchParams(window.location.search);
    const mixedColor = urlParams.get('mixedColor') || "#FF5733"; // デフォルトの完成した色
  
    let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 20 };
    let trail = [];
    const trailLength = 15;
    const shakeThreshold = 40;
    let isThrown = false;
  
    const drawBall = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // 軌跡を描画
      trail.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, ball.radius * (1 - index / trailLength), 0, Math.PI * 2);
        ctx.fillStyle = `${mixedColor}`;
        ctx.fill();
      });
  
      // ボールを描画
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = mixedColor;
      ctx.fill();
    };
  
    const animate = () => {
      if (isThrown) {
        ball.y -= 5; // ボールを上方向に移動
        ball.x += Math.random() * 4 - 2; // 軌跡にランダム性を追加
  
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > trailLength) {
          trail.shift();
        }
  
        drawBall();
  
        if (ball.y + ball.radius < 0) {
          alert("色が投げられました！");
        } else {
          requestAnimationFrame(animate);
        }
      }
    };
  
    const handleThrow = (event) => {
      const acceleration = event.acceleration || {};
      const { x = 0, y = 0 } = acceleration;
  
      if (!isThrown && (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold)) {
        isThrown = true;
        trail.push({ x: ball.x, y: ball.y });
        animate();
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
          console.error("加速度センサーの許可エラー:", error);
        }
      }
    };
  
    const addPermissionListener = () => {
      window.addEventListener("click", () => {
        requestPermission();
        window.removeEventListener("click", addPermissionListener);
      });
    };
  
    if (
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    ) {
      addPermissionListener();
    } else {
      requestPermission();
    }
  
    window.addEventListener("devicemotion", handleThrow);
  
    const nextButton = document.getElementById("next-button");
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        window.location.href = "complete.html"; // 遷移先のHTMLファイル名を指定
      });
    }
  });