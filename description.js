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