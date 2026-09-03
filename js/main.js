// 青空子ども会Ⅱ - 共通スクリプト（Vanilla JS、全ページ共通で読み込む）

document.addEventListener("DOMContentLoaded", () => {
  // ヘッダー：スクロールしたらふわっと影を付ける
  const header = document.querySelector("[data-header]");
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  }

  // ヘッダーロゴ：初回表示時のみ軽くはねる演出
  // ヘッダーロゴ：初回表示時にはねて、その後は数秒おきに軽くゆれる
  document.querySelectorAll("[data-logo-mark]").forEach((logoMark) => {
    requestAnimationFrame(() => logoMark.classList.add("logo-pop"));
    logoMark.addEventListener(
      "animationend",
      (event) => {
        if (event.animationName === "logo-pop") {
          logoMark.classList.add("logo-wiggle");
        }
      },
      { once: true }
    );
  });

  // フッター：西暦を自動更新
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // FAQ：タップで開閉するアコーディオン
  document.querySelectorAll(".faq-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  // モバイルメニュー：ハンバーガーボタンで開閉するドロップダウン
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  if (menuToggle && menuPanel) {
    const closeMenu = () => {
      menuToggle.classList.remove("is-open");
      menuPanel.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };
    const toggleMenu = () => {
      const isOpen = menuToggle.classList.toggle("is-open");
      menuPanel.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    };

    menuToggle.addEventListener("click", toggleMenu);

    menuPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (!menuToggle.classList.contains("is-open")) return;
      if (menuToggle.contains(event.target) || menuPanel.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // スクロールで写真・カードがふわっと現れる演出（意味のある箇所のみ）
  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // 常時表示のお問い合わせバー：お問い合わせセクション/ページが見えている間は隠す
  const stickyContactBar = document.querySelector("#sticky-contact-bar");
  const hideStickyTarget = document.querySelector("[data-hide-sticky-bar]");
  if (stickyContactBar && hideStickyTarget && "IntersectionObserver" in window) {
    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyContactBar.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    stickyObserver.observe(hideStickyTarget);
  }
});
