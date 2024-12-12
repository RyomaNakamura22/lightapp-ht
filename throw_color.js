document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("color-canvas");
    const ctx = canvas.getContext("2d");
    const finishButton = document.getElementById("finishButton");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const mixedColor = localStorage.getItem('mixedColor') || "#FF5733";
    const shakeThreshold = 40; // 閾値を40に変更
    
    let throwCount = 0;
    const maxThrows = 3;
    let ball = { 
        x: canvas.width / 2,  // 画面中央のX座標
        y: canvas.height / 2, // 画面中央のY座標
        radius: 35,          // ボールのサイズを大きく
        speedX: 0,
        speedY: 0
    };
    let isThrown = false;
    let isAnimating = false;

    finishButton.style.display = 'none';
    
    const drawBall = () => {
        // 軌跡の透明度を調整
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // ボールを描画
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = mixedColor;  // mix_colorでブレンドされた色を使用
        ctx.fill();
    };
    
    const animate = () => {
        if (isThrown && isAnimating) {
            ball.y += ball.speedY;
            ball.x += ball.speedX;
            
            drawBall();
            
            // ボールが完全に画面外に出てから少し待ってリセット
            if (ball.y + ball.radius < -100) {  // 余裕を持って画面外まで
                setTimeout(() => {
                    isAnimating = false;
                    throwCount++;
                    
                    // リセット
                    ball = { 
                        x: canvas.width / 2,
                        y: canvas.height / 2,
                        radius: 35,
                        speedX: 0,
                        speedY: 0
                    };
                    isThrown = false;
                    
                    // キャンバスをクリア
                    ctx.fillStyle = "rgba(0,0,0,1)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    if (throwCount >= 1) {
                        finishButton.style.display = 'block';
                    }
                }, 500);  // 0.5秒待ってからリセット
            }
            requestAnimationFrame(animate);
        }
    };
    
    const handleThrow = (event) => {
        const acceleration = event.acceleration || {};
        const { x = 0, y = 0, z = 0 } = acceleration;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
        
        if (!isThrown && !isAnimating && throwCount < maxThrows && 
            totalAcceleration > shakeThreshold) {
            isThrown = true;
            isAnimating = true;
            ball.speedY = -20; // 上向きの速度を大きく
            ball.speedX = x * 0.3; // 横方向の動きも少し大きく
            animate();
        }
    };
    
    window.addEventListener("devicemotion", handleThrow);
    
    finishButton.addEventListener("click", () => {
        window.location.href = "complete.html";
    });
});