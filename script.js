document.addEventListener("DOMContentLoaded", async function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const reelsContainer = document.getElementById('reels-container');
    const fetch = require('node-fetch');

  
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  
    async function fetchInstagramReels() {
      const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url&access_token=${accessToken}`;  
      const response = await fetch(url);
      const data = await response.json();
      return data.data.filter(media => media.media_type === 'VIDEO');
    }
  
    const reels = await fetchInstagramReels();
  
    reels.forEach(reel => {
      const swiperSlide = document.createElement('div');
      swiperSlide.className = 'swiper-slide';
  
      const video = document.createElement('video');
      video.setAttribute('data-src', reel.media_url);
      video.controls = true;
      video.style.width = '100%';
  
      swiperSlide.appendChild(video);
      reelsContainer.appendChild(swiperSlide);
    });
  
    const swiper = new Swiper('.swiper-container', {
      effect: 'cards',
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      lazy: {
        loadPrevNext: true,
      },
    });
  
    // Set up Intersection Observer for Autoplay
    const videos = document.querySelectorAll('video');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };
  
    function handleIntersection(entries, observer) {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.getAttribute('data-src');
          }
          video.play();
          videos.forEach(v => {
            if (v !== video) {
              v.pause();
            }
          });
        } else {
          video.pause();
        }
      });
    }
  
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
  
    videos.forEach(video => {
      observer.observe(video);
    });
  });
  