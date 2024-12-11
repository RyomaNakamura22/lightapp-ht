let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelector('.slides');
  const totalSlides = slides.children.length;
  currentSlide = (index + totalSlides) % totalSlides;
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function moveSlide(step) {
  showSlide(currentSlide + step);
}

// 初期表示
showSlide(currentSlide);

document.addEventListener("DOMContentLoaded", () => {
    const nextButton = document.getElementById("okbutton");

    nextButton.addEventListener("click", () => {
        window.location.href = "throw_color.html"; // 遷移先のHTMLファイル名を指定
    });
});