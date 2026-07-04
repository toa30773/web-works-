(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = [
    {
      id: 'name',
      validate: (v) => v.trim().length > 0,
      message: 'お名前を入力してください。',
    },
    {
      id: 'email',
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: 'メールアドレスを正しく入力してください。',
    },
    {
      id: 'message',
      validate: (v) => v.trim().length >= 10,
      message: 'お問い合わせ内容を10文字以上でご入力ください。',
    },
  ];

  const setError = (id, msg) => {
    const input = document.getElementById(id);
    const errEl = document.querySelector(`[data-error-for="${id}"]`);
    if (!input || !errEl) return;
    if (msg) {
      input.classList.add('error');
      errEl.textContent = msg;
    } else {
      input.classList.remove('error');
      errEl.textContent = '';
    }
  };

  fields.forEach(({ id, validate, message }) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      setError(id, validate(input.value) ? '' : message);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error') && validate(input.value)) {
        setError(id, '');
      }
    });
  });

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const setStatus = (msg, type) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (type ? ' form-status-' + type : '');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;
    fields.forEach(({ id, validate, message }) => {
      const input = document.getElementById(id);
      if (!input) return;
      if (!validate(input.value)) {
        setError(id, message);
        hasError = true;
      } else {
        setError(id, '');
      }
    });

    if (hasError) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      setStatus('入力内容をご確認ください。', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中…';
    }
    setStatus('送信しています…', '');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        setStatus('送信ありがとうございました。通常2営業日以内にご返信いたします。', 'success');
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.errors ? data.errors.map((x) => x.message).join(', ') : '送信に失敗しました。時間をおいて再度お試しください。';
        setStatus(msg, 'error');
      }
    } catch (err) {
      setStatus('通信エラーが発生しました。ネットワーク環境をご確認ください。', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      }
    }
  });
})();
