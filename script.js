const links = document.querySelectorAll(".nav-link");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

links.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.getAttribute("data-target");
    if (!target) return;
    const node = document.querySelector(target);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const hero = document.getElementById("hero");
const spotlight = document.getElementById("spotlight");
if (hero && spotlight) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty("--mx", `${x}%`);
    spotlight.style.setProperty("--my", `${y}%`);
  });
}

const projectContent = {
  email: {
    title: "AI Smart Email Response Generator",
    text: "Created an LLM-powered email drafting tool with tone control, context instructions, and MongoDB-backed preference/history support. Built a clean Streamlit interface for practical daily use."
  },
  voice: {
    title: "Voice Assistant (Python)",
    text: "Developed a personal assistant script for weather checks and task automation. Implemented custom wake-word detection to make interaction faster and more responsive."
  },
  sim: {
    title: "SIM Carrier Identification Tool",
    text: "Built a quick Python utility that parses phone numbers and returns regional carrier metadata, focused on speed and clarity of output."
  }
};

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll(".project-card").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.project;
    const content = projectContent[key];
    if (!content) return;
    modalTitle.textContent = content.title;
    modalText.textContent = content.text;
    modal.showModal();
  });
});

if (closeModal) {
  closeModal.addEventListener("click", () => modal.close());
}

if (modal) {
  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    const inDialog = (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
    if (!inDialog) modal.close();
  });
}

const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      alert("Message sent successfully.");
    } catch (error) {
      const entries = JSON.parse(localStorage.getItem("sv_portfolio_messages") || "[]");
      entries.unshift({ ...data, at: new Date().toISOString(), fallback: true });
      localStorage.setItem("sv_portfolio_messages", JSON.stringify(entries));
      alert("Could not reach server right now. Message saved locally.");
    }
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear().toString();
// Advanced GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from('.hero-content h1', { duration: 1.2, y: 100, opacity: 0, ease: 'power4.out', delay: 0.2 });
gsap.from('.hero-content p', { duration: 1, y: 50, opacity: 0, ease: 'power3.out', delay: 0.5 });
gsap.from('.hero-content .btn', { duration: 0.8, y: 30, opacity: 0, ease: 'back.out(1.7)', stagger: 0.2, delay: 0.8 });

// Scroll animations for cards
gsap.utils.toArray('.card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scale: 0.95
  });
});

// Parallax for section headers
gsap.utils.toArray('.section-kicker, .section-head h2').forEach(header => {
  gsap.from(header, {
    scrollTrigger: {
      trigger: header,
      start: 'top 90%',
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.2
  });
});

// Magnetic effect for buttons
document.querySelectorAll('.btn, .nav-link').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  });
});
