(() => {
  const navToggle = document.getElementById("navToggle");
  const nav = document.querySelector(".nav");
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // Skills: each chip links to its strongest example; with JS, scroll there and light up every
  // card that uses the skill, and say where it was used.
  const toast = document.getElementById("skillToast");
  let toastTimer;
  document.querySelectorAll("a.skill-chip[data-targets]").forEach((chip) =>
    chip.addEventListener("click", (e) => {
      const targets = chip.dataset.targets
        .split(" ")
        .map((id) => document.getElementById(id))
        .filter(Boolean);
      if (!targets.length) return;
      e.preventDefault();
      // Clear the previous skill's highlight so only this skill's cards light up.
      document.querySelectorAll(".is-flash").forEach((el) => el.classList.remove("is-flash"));
      targets.forEach((el) => {
        el.classList.add("in");
        el.classList.remove("is-flash");
        void el.offsetWidth; // restart the animation if it's already running
        el.classList.add("is-flash");
      });
      targets[0].scrollIntoView({ behavior: "smooth", block: "center" });
      history.replaceState(null, "", `#${targets[0].id}`);
      if (toast) {
        toast.textContent = chip.title.replace("Used in:", `${chip.textContent} — used in:`);
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => (toast.hidden = true), 4500);
      }
    })
  );
  document.addEventListener("animationend", (e) => {
    if (e.animationName === "flash") e.target.classList.remove("is-flash");
  });

  // Chat: answers come from the Bro API on Vercel, which holds the Anthropic key server-side.
  const CHAT_API = "https://job-go-mauve.vercel.app/api/portfolio-qa";
  const openBtn = document.getElementById("chatOpen");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const log = document.getElementById("chatLog");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const sendBtn = form.querySelector("button[type=submit]");
  let pending = false;

  const setOpen = (open) => {
    panel.hidden = !open;
    openBtn.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  openBtn.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn.addEventListener("click", () => {
    setOpen(false);
    openBtn.focus();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });

  const addMsg = (text, kind) => {
    const p = document.createElement("p");
    p.className = `chat-msg chat-${kind}`;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  };

  const ask = async (question) => {
    if (pending) return;
    if (question.length < 3) {
      addMsg("Please ask a slightly longer question.", "error");
      return;
    }
    const suggest = log.querySelector(".chat-suggest");
    if (suggest) suggest.remove();

    pending = true;
    sendBtn.disabled = true;
    addMsg(question, "user");
    const reply = addMsg("Thinking…", "bot");
    reply.classList.add("chat-pending");

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      let data = {};
      try { data = await res.json(); } catch (_) {}
      if (res.ok && data.answer) {
        reply.textContent = data.answer;
      } else {
        reply.textContent = data.error || "Something went wrong. Please try again.";
        reply.className = "chat-msg chat-error";
      }
    } catch (_) {
      reply.textContent = "Couldn't reach the server. Check your connection and try again.";
      reply.className = "chat-msg chat-error";
    } finally {
      reply.classList.remove("chat-pending");
      pending = false;
      sendBtn.disabled = false;
      log.scrollTop = log.scrollHeight;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });
  log.querySelectorAll(".chat-suggest button").forEach((b) =>
    b.addEventListener("click", () => ask(b.textContent.trim()))
  );
})();
