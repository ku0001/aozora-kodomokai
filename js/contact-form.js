// 青空子ども会Ⅱ - お問い合わせフォーム送信（contact.html 専用）
//
// Google Apps Script（GAS）の Web App エンドポイントへ送信する。
// GAS Web App は CORS 応答ヘッダーを返さないため mode:"no-cors" で送信し、
// fetch 自体が例外を投げなければ成功とみなす（レスポンス内容は読めない）。
//
// セットアップ手順は README.md を参照。デプロイ後に発行される
// Web App URL を、下の GAS_ENDPOINT に設定してください。
// 幹事長交代時の宛先メール変更は、この定数ではなく GAS 側の
// Script Properties（CONTACT_TO_EMAIL）を書き換えるだけで完結します。

const GAS_ENDPOINT = "https://script.google.com/macros/s/【ここにデプロイ後のWebApp URLを設定】/exec";

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("#contact-form");
  const contactSuccess = document.querySelector("#contact-success");
  const contactError = document.querySelector("#contact-error");
  if (!contactForm || !contactSuccess) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitButtonLabel = submitButton ? submitButton.textContent : "";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    if (contactError) contactError.classList.add("hidden");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "送信中…";
    }

    try {
      await fetch(GAS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(contactForm),
      });

      // no-cors のためレスポンス内容は検証できない。fetch自体が例外を
      //投げなければ、GAS側へは届いているとみなして成功表示にする。
      contactForm.classList.add("hidden");
      contactSuccess.classList.remove("hidden");
      contactSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButtonLabel;
      }
      if (contactError) {
        contactError.classList.remove("hidden");
        contactError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
});
