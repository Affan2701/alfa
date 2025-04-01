document.addEventListener('DOMContentLoaded', function () {
  // Initialize all galleries on the page
  const galleries = document.querySelectorAll('.gallery-container');

  galleries.forEach((gallery) => {
    const slider = gallery.querySelector('.gallery-slider');
    const slides = gallery.querySelectorAll('.slide');
    const prevBtn = gallery.querySelector('.prev-btn');
    const nextBtn = gallery.querySelector('.next-btn');
    const dotsContainer = gallery.querySelector('.dots-container');

    let currentIndex = 0;
    const slideCount = slides.length;

    // Clone first slide and append to end for seamless looping
    const firstSlideClone = slides[0].cloneNode(true);
    slider.appendChild(firstSlideClone);

    // Create dots for this gallery (don't create for the clone)
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    // Update slider position
    function updateSlider() {
      // When at the clone (last position), instantly jump to first slide without animation
      if (currentIndex >= slideCount) {
        slider.style.transition = 'none';
        slider.style.transform = `translateX(0)`;
        // Force reflow to apply the immediate change
        void slider.offsetWidth;
        currentIndex = 0;
        slider.style.transition = 'transform 0.5s ease-in-out';
      }

      slider.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update active dot (use modulo to handle the clone position)
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex % slideCount);
      });
    }

    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    // Next slide - always moves right
    function nextSlide() {
      currentIndex++;
      updateSlider();
    }

    // Previous slide - moves left but still loops continuously
    function prevSlide() {
      if (currentIndex <= 0) {
        // If at first slide, jump to the clone position (no animation)
        slider.style.transition = 'none';
        currentIndex = slideCount;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        // Force reflow to apply the immediate change
        void slider.offsetWidth;
        slider.style.transition = 'transform 0.5s ease-in-out';
      }
      currentIndex--;
      updateSlider();
    }

    // Button events for this gallery
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    slider.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      const threshold = 50; // Minimum swipe distance
      if (touchEndX < touchStartX - threshold) {
        nextSlide(); // Swipe left
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide(); // Swipe right
      }
    }

    // Auto-advance (optional) - uncomment to enable
    // setInterval(nextSlide, 5000);
  });
});
