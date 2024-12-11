document.addEventListener("DOMContentLoaded", () => {
    const okButton = document.getElementById("okButton");

    okButton.addEventListener("click", () => {
        window.location.href = "create_color.html"; // 遷移先のHTMLファイル名を指定
    });
});
