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

  form.addEventListener('submit', (e) => {
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
      e.preventDefault();
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
    }
  });
})();
