document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("color-canvas");
    const ctx = canvas.getContext("2d");
    const finishButton = document.getElementById("finishButton");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const mixedColor = localStorage.getItem('mixedColor') || "#FF5733";
    
    let throwCount = 0;
    const maxThrows = 3;
    let ball = { 
        x: canvas.width / 2, 
        y: canvas.height / 2, 
        radius: 20,
        speedX: 0,
        speedY: -15  // 上向きの初速
    };
    const gravity = 0.5;  // 重力加速度
    let isThrown = false;
    let isAnimating = false;

    finishButton.style.display = 'none';
    
    const drawBall = () => {
        ctx.fillStyle = "rgba(0,0,0,0.1)";  // 軌跡効果
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = mixedColor;
        ctx.fill();
    };
    
    const animate = () => {
        if (isThrown && isAnimating) {
            // 物理演算
            ball.speedY += gravity;  // 重力の影響
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            
            drawBall();
            
            // ボールが画面外に出たら
            if (ball.y + ball.radius < 0 || ball.y - ball.radius > canvas.height) {
                isAnimating = false;
                throwCount++;
                
                // リセット
                ball = { 
                    x: canvas.width / 2, 
                    y: canvas.height / 2, 
                    radius: 20,
                    speedX: 0,
                    speedY: -15
                };
                isThrown = false;
                
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
        const { x = 0, y = 0 } = acceleration;
        
        if (!isThrown && !isAnimating && throwCount < maxThrows && 
            (Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold)) {
            isThrown = true;
            isAnimating = true;
            ball.speedX = x * 0.2;  // 加速度センサーの値を速度に変換
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
    
    finishButton.addEventListener("click", () => {
        window.location.href = "complete.html";
    });
});