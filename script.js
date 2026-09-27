// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Intro Loader & Hero Animation with Anime.js
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  const loaderTimeline = anime.timeline({
    easing: 'easeOutExpo',
  });

  loaderTimeline
    .to('.loader-text', {
      opacity: 1,
      scale: [0.8, 1],
      duration: 1000
    })
    .to('.loader', {
      translateY: '-100%',
      duration: 1200,
      delay: 500,
      easing: 'easeInOutExpo',
      complete: () => {
        document.body.style.overflow = 'auto';
        
        // Staggered letters for Hero Name
        anime({
          targets: '.huge-title .letter',
          translateY: ['100%', '0%'],
          opacity: [0, 1],
          duration: 1200,
          delay: anime.stagger(80),
          easing: 'easeOutExpo'
        });

        // Fade up other elements
        anime({
          targets: '.fade-up',
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: anime.stagger(150),
          easing: 'easeOutQuad'
        });
        
        // Background circles parallax
        anime({
          targets: '.bg-circle',
          scale: [0.8, 1],
          opacity: [0, 0.5],
          duration: 2000,
          easing: 'easeOutExpo'
        });
      }
    });
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

// Smooth follow for outline
function renderCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  cursorOutline.style.left = `${outlineX}px`;
  cursorOutline.style.top = `${outlineY}px`;
  requestAnimationFrame(renderCursor);
}
renderCursor();

// Magnetic Cursor Hover Effect
document.querySelectorAll('a, button, .magnetic, .magnetic-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Split text for section headers manually to animate characters
document.querySelectorAll('.split-text').forEach(header => {
  const text = header.innerText;
  header.innerHTML = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  
  gsap.from(header.querySelectorAll('.char'), {
    scrollTrigger: {
      trigger: header,
      start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.03,
    ease: 'back.out(1.7)'
  });
});

// Reveal cards on scroll
gsap.utils.toArray('.scroll-reveal .card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// Navigation Links
document.querySelectorAll('.nav-link[data-target]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('data-target'));
    if (target) {
      lenis.scrollTo(target);
    }
  });
});

// Project Modals
const projectData = {
  email: {
    title: "AI Smart Email Generator",
    tags: ["LangChain", "MongoDB", "Streamlit", "Python"],
    desc: "Created an LLM-powered email drafting tool with tone control, context instructions, and MongoDB-backed preference/history support. Built a clean Streamlit interface for practical daily use.",
    repo: "https://github.com/ShauryaVaid/ai-smart-email-reply-generator-for-professionals"
  },
  hardware: {
    title: "Reconfigurable Approx ALU",
    tags: ["Verilog", "Vivado", "Hardware Design"],
    desc: "Designed a Runtime-Reconfigurable Approximate Arithmetic Unit for Edge Computing capable of switching between exact logic and approximate logic to save 66% dynamic power.",
    repo: "https://github.com/ShauryaVaid/reconfig-approx-alu"
  },
  voice: {
    title: "Voice Assistant",
    tags: ["Python", "SpeechRecognition", "OS"],
    desc: "Developed a personal assistant script for weather checks and task automation. Implemented custom wake-word detection to make interaction faster and more responsive.",
    repo: "https://github.com/ShauryaVaid/Video-Analyst"
  }
};

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalTags = document.getElementById("modalTags");
const modalText = document.getElementById("modalText");
const modalRepo = document.getElementById("modalRepo");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll(".project-card").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.project;
    const data = projectData[key];
    if (!data) return;
    
    modalTitle.textContent = data.title;
    modalText.textContent = data.desc;
    modalRepo.href = data.repo;
    
    modalTags.innerHTML = '';
    data.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modal.showModal();
    document.body.style.overflow = 'hidden';
    lenis.stop();
  });
});

closeModal.addEventListener("click", () => {
  modal.close();
  document.body.style.overflow = 'auto';
  lenis.start();
});

modal.addEventListener("click", (e) => {
  const rect = modal.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    modal.close();
    document.body.style.overflow = 'auto';
    lenis.start();
  }
});

// Update Year
document.getElementById('year').textContent = new Date().getFullYear();
