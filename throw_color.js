document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("color-canvas");
    const ctx = canvas.getContext("2d");
    const finishButton = document.getElementById("finishButton");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const mixedColor = localStorage.getItem('mixedColor') || "#FF5733";
    const shakeThresholdLow = 20;  // 低い閾値
    const shakeThresholdHigh = 40; // 高い閾値
    
    let throwCount = 0;
    const maxThrows = 3;
    let ball = { 
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 35,
        speedX: 0,
        speedY: 0
    };
    let isThrown = false;
    let isAnimating = false;

    finishButton.style.display = 'none';
    
    const drawBall = () => {
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = mixedColor;
        ctx.fill();
    };
    
    const animate = () => {
        if (isThrown && isAnimating) {
            ball.y += ball.speedY;
            ball.x += ball.speedX;
            
            drawBall();
            
            if (ball.y + ball.radius < -100) {
                isAnimating = false;
                throwCount++;
                
                // リセット処理
                ball = { 
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    radius: 35,
                    speedX: 0,
                    speedY: 0
                };
                isThrown = false;
                
                // 1回目の投げ終わりで終了ボタンを表示
                if (throwCount >= 1) {
                    finishButton.style.display = 'block';
                }
            } else {
                requestAnimationFrame(animate);
            }
        }
    };
    
    const handleThrow = (event) => {
        const acceleration = event.acceleration || {};
        const { x = 0, y = 0, z = 0 } = acceleration;
        const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
        
        if (!isThrown && !isAnimating && throwCount < maxThrows) {
            if (totalAcceleration > shakeThresholdHigh) {
                // 強い振り
                isThrown = true;
                // 1秒のディレイを追加
                setTimeout(() => {
                    isAnimating = true;
                    ball.speedY = -20;
                    ball.speedX = x * 0.3;
                    animate();
                }, 1000);
            } else if (totalAcceleration > shakeThresholdLow) {
                // 弱い振り
                isThrown = true;
                // 1秒のディレイを追加
                setTimeout(() => {
                    isAnimating = true;
                    ball.speedY = -10;
                    ball.speedX = x * 0.15;
                    animate();
                }, 1000);
            }
        }
    };
    
    window.addEventListener("devicemotion", handleThrow);
    
    finishButton.addEventListener("click", () => {
        window.location.href = "complete.html";
    });
});