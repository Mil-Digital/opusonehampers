"use strict";

/*
  CENTRAL CONFIGURATION
  Update this object to change the WhatsApp number or catalogue destinations.
  Keep an unavailable category as null; its button will request the latest
  catalogue through WhatsApp instead of opening a fabricated link.
*/
const CONFIG = {
  whatsappNumber: "628112340951",
  catalogues: {
    general: {
      label: "Katalog Natal Resmi",
      url: "https://drive.google.com/drive/folders/1VM7Fjpm_-Q8R0I4zUT91P7_mW1ZiOiAh?usp=sharing"
    },
    giftSet: { label: "Katalog Gift Set", url: null },
    hampersBox: { label: "Katalog Hampers Box", url: null },
    hampersTinggi: { label: "Katalog Hampers Tinggi", url: null },
    collaborations: { label: "Katalog Special Collaborations", url: null }
  }
};

const QUESTIONS = [
  {
    id: "recipient",
    title: "Who are you gifting for?",
    helper: "Pilih hubungan dengan orang yang akan menerima hadiah ini.",
    options: [
      ["loved-ones", "Keluarga & Orang Terdekat"],
      ["friends", "Teman & Orang Spesial"],
      ["clients", "Mitra Bisnis & Klien"],
      ["employees", "Karyawan & Tim"]
    ]
  },
  {
    id: "occasion",
    title: "What’s the occasion?",
    helper: "Alasan pemberian membantu menentukan kesan hadiah yang paling sesuai.",
    options: [
      ["christmas", "Perayaan Natal & Akhir Tahun"],
      ["client-appreciation", "Apresiasi untuk Klien"],
      ["employee-appreciation", "Apresiasi untuk Karyawan"],
      ["personal", "Perayaan Personal"],
      ["other", "Momen Spesial Lainnya"]
    ]
  },
  {
    id: "quantity",
    title: "How many recipients?",
    helper: "Perkiraan jumlah sudah cukup untuk membantu kami menyarankan skala hadiah yang tepat.",
    options: [
      ["1-5", "1–5 penerima"],
      ["6-20", "6–20 penerima"],
      ["21-50", "21–50 penerima"],
      ["50-plus", "Lebih dari 50 penerima"]
    ]
  },
  {
    id: "style",
    title: "What kind of gifting experience do you prefer?",
    helper: "Pilih kesan yang ingin ditinggalkan melalui hadiah tersebut.",
    options: [
      ["simple", "Sederhana & Penuh Perhatian"],
      ["elegant", "Elegan & Berkesan"],
      ["premium", "Premium & Menonjol"],
      ["customized", "Kustom & Personal"],
      ["open", "Terbuka untuk Rekomendasi"]
    ]
  },
  {
    id: "packaging",
    title: "Would you like personalized packaging?",
    helper: "Pilihan ini membantu kami memahami kebutuhan kemasan hadiah Anda.",
    options: [
      ["logo", "Logo perusahaan khusus"],
      ["custom-size", "Kemasan dan ukuran khusus"],
      ["ready-made", "Kemasan siap pakai"],
      ["explore", "Ingin melihat pilihan terlebih dahulu"]
    ]
  }
];

const RECOMMENDATIONS = {
  giftSet: {
    key: "giftSet",
    title: "Gift Set",
    mood: "Thoughtful & Simple",
    catalogueKey: "giftSet",
    image: "assets/images/frida-luzia-a-25567.png",
    imageAlt: "Opus One Gift Box Set Frida Luzia A 25567",
    productFit: true,
    description: "Pilihan hadiah yang hangat dan personal, sesuai untuk keluarga, teman, atau lingkaran penerima yang lebih terbatas.",
    packaging: ["Box kardus coklat", "Box printed motif"],
    verifiedExample: "Inspirasi produk terverifikasi: Opus One Gift Box Set Frida Luzia A 25567. Pilihan akhir dan ketersediaan untuk Natal dikonfirmasi oleh Opus One."
  },
  hampersBox: {
    key: "hampersBox",
    title: "Hampers Box",
    mood: "Elegant & Generous",
    catalogueKey: "hampersBox",
    image: "assets/images/bluebell-heirloom.jpg",
    imageAlt: "Bluebell Heirloom tableware collection by Opus One",
    productFit: false,
    description: "Pilihan hadiah dengan tampilan lebih istimewa untuk keluarga, klien, mitra bisnis, maupun tim.",
    packaging: ["Box akrilik", "Box kayu kaca", "Box kayu tertutup"],
    verifiedExample: null
  },
  hampersTinggi: {
    key: "hampersTinggi",
    title: "Hampers Tinggi",
    mood: "Statement & Premium",
    catalogueKey: "hampersTinggi",
    image: "assets/images/millefleur-de-verdaine.jpg",
    imageAlt: "Millefleur de Verdaine tableware collection by Opus One",
    productFit: false,
    description: "Pilihan hadiah premium dengan presentasi yang lebih menonjol untuk momen penting dan bentuk apresiasi istimewa.",
    packaging: ["Kemasan tinggi dengan tampilan premium", "Format akhir dikonfirmasi bersama Opus One"],
    verifiedExample: null
  },
  corporate: {
    key: "corporate",
    title: "Custom Corporate Hampers",
    mood: "Customized & Personalized",
    catalogueKey: "general",
    image: "assets/images/evangeline-en-rouge.jpg",
    imageAlt: "Evangeline en Rouge tableware collection by Opus One",
    productFit: false,
    description: "Pilihan corporate gifting yang fleksibel dan dapat disesuaikan dengan penerima, jumlah hadiah, serta identitas perusahaan.",
    packaging: ["Box khusus", "Ukuran khusus", "Logo perusahaan"],
    verifiedExample: null
  }
};

const state = {
  quizStep: 0,
  answers: {},
  rankedKeys: [],
  currentRecommendationKey: null,
  toastTimer: null
};

const quizDialog = document.getElementById("quizDialog");
const quizTitle = document.getElementById("quizTitle");
const quizHelper = document.getElementById("quizHelper");
const quizOptions = document.getElementById("quizOptions");
const quizStepLabel = document.getElementById("quizStepLabel");
const quizPercent = document.getElementById("quizPercent");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizBack = document.getElementById("quizBack");
const quizContinue = document.getElementById("quizContinue");
const quizQuestionWrap = document.getElementById("quizQuestionWrap");
const resultSection = document.getElementById("result");
const recommendationOutput = document.getElementById("recommendationOutput");
const resultGreeting = document.getElementById("resultGreeting");
const toast = document.getElementById("toast");
const audio = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

function optionLabel(questionId, value) {
  const question = QUESTIONS.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item[0] === value);
  return option ? option[1] : value;
}

function resetQuiz() {
  state.quizStep = 0;
  state.answers = {};
  state.rankedKeys = [];
  state.currentRecommendationKey = null;
}

function openQuiz({ reset = true } = {}) {
  if (reset) resetQuiz();
  renderQuestion();
  if (typeof quizDialog.showModal === "function") {
    quizDialog.showModal();
  } else {
    quizDialog.setAttribute("open", "");
  }
  document.body.classList.add("quiz-open");
}

function closeQuiz() {
  if (quizDialog.open && typeof quizDialog.close === "function") {
    quizDialog.close();
  } else {
    quizDialog.removeAttribute("open");
  }
  document.body.classList.remove("quiz-open");
}

function renderQuestion() {
  const question = QUESTIONS[state.quizStep];
  const selected = state.answers[question.id];
  const progress = Math.round(((state.quizStep + 1) / QUESTIONS.length) * 100);

  quizTitle.textContent = question.title;
  quizHelper.textContent = question.helper;
  quizStepLabel.textContent = `Pertanyaan ${state.quizStep + 1} dari ${QUESTIONS.length}`;
  quizPercent.textContent = `${progress}%`;
  quizProgressBar.style.width = `${progress}%`;
  quizBack.disabled = state.quizStep === 0;
  quizContinue.disabled = !selected;
  quizContinue.textContent = state.quizStep === QUESTIONS.length - 1 ? "Lihat Rekomendasi" : "Lanjutkan";

  quizOptions.innerHTML = question.options.map(([value, label], index) => `
    <button
      class="quiz-option"
      type="button"
      role="radio"
      aria-checked="${selected === value}"
      tabindex="${selected ? (selected === value ? "0" : "-1") : (index === 0 ? "0" : "-1")}" 
      data-value="${value}">
      <span>${label}</span>
    </button>
  `).join("");

  quizQuestionWrap.classList.remove("is-changing");
  requestAnimationFrame(() => quizTitle.focus({ preventScroll: true }));
}

function moveQuestion(direction) {
  quizQuestionWrap.classList.add("is-changing");
  window.setTimeout(() => {
    state.quizStep += direction;
    renderQuestion();
  }, 130);
}

function scoreRecommendations(answers) {
  const score = { giftSet: 0, hampersBox: 0, hampersTinggi: 0, corporate: 0 };
  const add = (key, points) => { score[key] += points; };

  const recipientRules = {
    "loved-ones": { giftSet: 5, hampersBox: 2, hampersTinggi: 1 },
    friends: { giftSet: 4, hampersBox: 2, hampersTinggi: 1 },
    clients: { corporate: 5, hampersBox: 4, hampersTinggi: 2 },
    employees: { corporate: 5, hampersBox: 4, giftSet: 1 }
  };
  const occasionRules = {
    christmas: { hampersBox: 2, giftSet: 2, hampersTinggi: 1, corporate: 1 },
    "client-appreciation": { corporate: 5, hampersBox: 3, hampersTinggi: 2 },
    "employee-appreciation": { corporate: 5, hampersBox: 3, giftSet: 1 },
    personal: { giftSet: 4, hampersBox: 1, hampersTinggi: 1 },
    other: { giftSet: 2, hampersBox: 2, hampersTinggi: 1 }
  };
  const quantityRules = {
    "1-5": { giftSet: 4, hampersTinggi: 2, hampersBox: 1 },
    "6-20": { hampersBox: 4, corporate: 2, giftSet: 1 },
    "21-50": { corporate: 5, hampersBox: 4 },
    "50-plus": { corporate: 7, hampersBox: 3 }
  };
  const styleRules = {
    simple: { giftSet: 6 },
    elegant: { hampersBox: 6, giftSet: 1 },
    premium: { hampersTinggi: 7, hampersBox: 2 },
    customized: { corporate: 7, hampersBox: 1 },
    open: { giftSet: 1, hampersBox: 2, hampersTinggi: 1, corporate: 1 }
  };
  const packagingRules = {
    logo: { corporate: 8 },
    "custom-size": { corporate: 8, hampersTinggi: 1 },
    "ready-made": { giftSet: 4, hampersBox: 3 },
    explore: { giftSet: 1, hampersBox: 1, hampersTinggi: 1, corporate: 1 }
  };

  [
    recipientRules[answers.recipient],
    occasionRules[answers.occasion],
    quantityRules[answers.quantity],
    styleRules[answers.style],
    packagingRules[answers.packaging]
  ].forEach((rules) => {
    Object.entries(rules || {}).forEach(([key, points]) => add(key, points));
  });

  const stableOrder = ["giftSet", "hampersBox", "hampersTinggi", "corporate"];
  return stableOrder.sort((a, b) => score[b] - score[a]);
}

function recommendationReason(recommendation) {
  const recipient = optionLabel("recipient", state.answers.recipient).toLowerCase();
  const quantity = optionLabel("quantity", state.answers.quantity).toLowerCase();
  const style = optionLabel("style", state.answers.style).toLowerCase();
  const packaging = optionLabel("packaging", state.answers.packaging).toLowerCase();

  return `${recommendation.description} Rekomendasi ini mempertimbangkan hadiah untuk ${recipient}, jumlah ${quantity}, serta preferensi ${style}. Pilihan kemasan “${packaging}” juga menjadi pertimbangan untuk langkah berikutnya.`;
}

function renderRecommendation(primaryKey, alternativeKeys) {
  const primary = RECOMMENDATIONS[primaryKey];
  const alternates = alternativeKeys.map((key) => RECOMMENDATIONS[key]);
  const isTopMatch = !state.rankedKeys.length || state.rankedKeys[0] === primaryKey;
  state.currentRecommendationKey = primaryKey;

  resultGreeting.textContent = isTopMatch
    ? `Berdasarkan lima jawaban Anda, ${primary.title} menjadi rekomendasi yang paling sesuai. Pilihan produk akhir dan ketersediaannya akan dikonfirmasi bersama Opus One.`
    : `Anda memilih ${primary.title} sebagai alternatif arah hadiah. Pilihan produk akhir dan ketersediaannya akan dikonfirmasi bersama Opus One.`;

  const packagingItems = primary.packaging.map((item) => `<li>${item}</li>`).join("");
  const verifiedExample = primary.verifiedExample
    ? `<p class="verified-example">${primary.verifiedExample}</p>`
    : "";
  const alternatives = alternates.map((item) => `
    <button class="alternative-card" type="button" data-alternative="${item.key}">
      <img src="${item.image}" alt="" loading="lazy">
      <span><strong>${item.title}</strong><span>${item.mood}. Pilih sebagai arah hadiah utama Anda.</span></span>
    </button>
  `).join("");

  recommendationOutput.innerHTML = `
    <article class="recommendation-card">
      <div class="recommendation-visual ${primary.productFit ? "product-fit" : ""}">
        <img src="${primary.image}" alt="${primary.imageAlt}">
        <span class="recommendation-badge">${isTopMatch ? "Rekomendasi Utama" : "Pilihan Anda"}</span>
      </div>
      <div class="recommendation-copy">
        <p class="recommendation-subtitle">${primary.mood}</p>
        <h3>${primary.title}</h3>
        <p class="recommendation-reason">${recommendationReason(primary)}</p>
        ${verifiedExample}
        <div class="detail-group">
          <strong>Pilihan Kemasan</strong>
          <ul>${packagingItems}</ul>
        </div>
        <div class="result-actions">
          <button class="button button-navy" type="button" data-result-whatsapp>Tanyakan via WhatsApp</button>
          <button class="button button-outline" type="button" data-result-catalogue="${primary.catalogueKey}">Lihat Katalog</button>
          <button class="button button-quiet" type="button" data-retake>Ulangi Kuis</button>
        </div>
      </div>
    </article>
    <div class="alternatives">
      <h3>Two more directions to consider</h3>
      <div class="alternative-grid">${alternatives}</div>
    </div>
  `;
}

function completeQuiz() {
  state.rankedKeys = scoreRecommendations(state.answers);
  renderRecommendation(state.rankedKeys[0], state.rankedKeys.slice(1, 3));
  closeQuiz();
  resultSection.hidden = false;
  window.setTimeout(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
}

function buildQuizWhatsAppMessage() {
  const recommendation = RECOMMENDATIONS[state.currentRecommendationKey];
  const lines = [
    "Halo Opus One, saya sudah mengisi Christmas Gifting Experience dan ingin mendiskusikan rekomendasi hadiah saya.",
    "",
    `Rekomendasi hadiah: ${recommendation.title}`,
    `Penerima: ${optionLabel("recipient", state.answers.recipient)}`,
    `Momen: ${optionLabel("occasion", state.answers.occasion)}`,
    `Jumlah: ${optionLabel("quantity", state.answers.quantity)}`,
    `Gaya hadiah: ${optionLabel("style", state.answers.style)}`,
    `Preferensi kemasan: ${optionLabel("packaging", state.answers.packaging)}`,
    "",
    "Mohon kirimkan pilihan dan katalog terbaru yang tersedia. Terima kasih."
  ];
  return lines.join("\n");
}

function openWhatsApp(message) {
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openCatalogue(key) {
  const destination = CONFIG.catalogues[key];
  if (!destination) return;

  if (destination.url) {
    window.open(destination.url, "_blank", "noopener,noreferrer");
    return;
  }

  openWhatsApp(`Halo Opus One, saya ingin meminta ${destination.label} terbaru. Mohon kirimkan PDF atau tautan katalog yang saat ini tersedia. Terima kasih.`);
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function initializeCatalogueButtons() {
  document.querySelectorAll("[data-catalogue]").forEach((button) => {
    const destination = CONFIG.catalogues[button.dataset.catalogue];
    if (!destination?.url && button.dataset.catalogue !== "general") {
      button.dataset.catalogueUnavailable = "true";
      button.setAttribute("title", "Requests the latest catalogue through WhatsApp");
    }
  });
}

function selectCatalogueTab(tab) {
  const tabName = tab.dataset.tab;
  document.querySelectorAll("[role='tab'][data-tab]").forEach((item) => {
    const isSelected = item === tab;
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => {
    const isSelected = panel.dataset.panel === tabName;
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function initializeMusic() {
  audio.volume = 0.18;
  audio.addEventListener("error", () => {
    musicToggle.disabled = true;
    musicLabel.textContent = "Musik Tidak Tersedia";
    musicToggle.setAttribute("aria-label", "Musik latar tidak tersedia");
  });

  musicToggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "Musik Nyala";
        showToast("Musik Natal aktif. Gunakan tombol musik kapan saja untuk mematikannya.");
      } catch (error) {
        showToast("Browser tidak dapat memutar musik latar.");
      }
    } else {
      audio.pause();
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Musik Mati";
    }
  });
}

document.querySelectorAll("[data-start-quiz]").forEach((button) => {
  button.addEventListener("click", () => openQuiz({ reset: true }));
});

document.getElementById("quizClose").addEventListener("click", closeQuiz);
quizDialog.addEventListener("close", () => document.body.classList.remove("quiz-open"));
quizDialog.addEventListener("cancel", () => document.body.classList.remove("quiz-open"));

quizOptions.addEventListener("click", (event) => {
  const option = event.target.closest("[data-value]");
  if (!option) return;
  const question = QUESTIONS[state.quizStep];
  state.answers[question.id] = option.dataset.value;
  quizOptions.querySelectorAll("[role='radio']").forEach((item) => {
    const selected = item === option;
    item.setAttribute("aria-checked", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  quizContinue.disabled = false;
});

quizOptions.addEventListener("keydown", (event) => {
  const options = [...quizOptions.querySelectorAll("[role='radio']")];
  const currentIndex = options.indexOf(document.activeElement);
  if (currentIndex < 0 || !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
  event.preventDefault();
  const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
  const nextIndex = (currentIndex + direction + options.length) % options.length;
  options[nextIndex].focus();
  options[nextIndex].click();
});

quizBack.addEventListener("click", () => {
  if (state.quizStep > 0) moveQuestion(-1);
});

quizContinue.addEventListener("click", () => {
  if (!state.answers[QUESTIONS[state.quizStep].id]) return;
  if (state.quizStep === QUESTIONS.length - 1) completeQuiz();
  else moveQuestion(1);
});

recommendationOutput.addEventListener("click", (event) => {
  const alternative = event.target.closest("[data-alternative]");
  if (alternative) {
    const newPrimary = alternative.dataset.alternative;
    const remaining = state.rankedKeys.filter((key) => key !== newPrimary).slice(0, 2);
    renderRecommendation(newPrimary, remaining);
    document.getElementById("resultTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`${RECOMMENDATIONS[newPrimary].title} menjadi pilihan arah hadiah Anda.`);
    return;
  }
  if (event.target.closest("[data-result-whatsapp]")) {
    openWhatsApp(buildQuizWhatsAppMessage());
    return;
  }
  const catalogueButton = event.target.closest("[data-result-catalogue]");
  if (catalogueButton) {
    openCatalogue(catalogueButton.dataset.resultCatalogue);
    return;
  }
  if (event.target.closest("[data-retake]")) openQuiz({ reset: true });
});

document.addEventListener("click", (event) => {
  const catalogueButton = event.target.closest("[data-catalogue]");
  if (catalogueButton) {
    openCatalogue(catalogueButton.dataset.catalogue);
    return;
  }
  const whatsappButton = event.target.closest("[data-whatsapp-context]");
  if (whatsappButton) {
    const context = whatsappButton.dataset.whatsappContext;
    const message = context === "corporate"
      ? "Halo Opus One, saya ingin mendiskusikan corporate Christmas gifting, termasuk jumlah hadiah serta opsi kustomisasi box, ukuran, dan logo. Mohon kirimkan informasi dan katalog terbaru. Terima kasih."
      : "Halo Opus One, saya ingin mengetahui lebih lanjut mengenai pilihan Christmas gifting dan katalog terbaru. Terima kasih.";
    openWhatsApp(message);
  }
});

document.querySelectorAll("[role='tab'][data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => selectCatalogueTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll("[role='tab'][data-tab]")];
    const index = tabs.indexOf(tab);
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    tabs[nextIndex].focus();
    selectCatalogueTab(tabs[nextIndex]);
  });
});

function initializeSnow() {
  const snowLayer = document.getElementById("snowLayer");
  if (!snowLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const flakeCount = window.matchMedia("(max-width: 820px)").matches ? 14 : 38;
  for (let index = 0; index < flakeCount; index += 1) {
    const flake = document.createElement("span");
    flake.className = "snowflake";
    flake.textContent = index % 5 === 0 ? "✧" : "•";
    flake.style.setProperty("--snow-left", `${Math.random() * 100}%`);
    flake.style.setProperty("--snow-size", `${3 + Math.random() * 6}px`);
    flake.style.setProperty("--snow-duration", `${10 + Math.random() * 13}s`);
    flake.style.setProperty("--snow-delay", `${Math.random() * -22}s`);
    flake.style.setProperty("--snow-drift", `${-50 + Math.random() * 100}px`);
    flake.style.setProperty("--snow-opacity", `${0.28 + Math.random() * 0.58}`);
    snowLayer.appendChild(flake);
  }
}

initializeCatalogueButtons();
initializeMusic();
setupRevealAnimations();
initializeSnow();
