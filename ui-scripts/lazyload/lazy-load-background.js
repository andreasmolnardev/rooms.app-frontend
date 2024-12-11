
document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const backgroundSrc = body.dataset.backgroundSrc;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          body.style.backgroundImage = `url(${backgroundSrc})`;
          observer.unobserve(body);
        }
      });
    });

    observer.observe(body);
  });
