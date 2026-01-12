document.addEventListener('DOMContentLoaded', function () {
    function showMessage(form, type, message) {
        let existing = form.querySelector('.form-message');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = 'form-message ' + type;
        div.textContent = message;
        div.style.padding = '12px';
        div.style.borderRadius = '6px';
        div.style.marginBottom = '16px';
        if (type === 'success') {
            div.style.background = '#E9F7EF';
            div.style.color = '#1f7a3a';
            div.style.border = '1px solid #b6e3c3';
        } else {
            div.style.background = '#FFEDED';
            div.style.color = '#8a1f1f';
            div.style.border = '1px solid #f2b6b6';
        }
        form.prepend(div);
    }

    function serializeForm(form) {
        const data = {};
        const fd = new FormData(form);
        for (const [k, v] of fd.entries()) {
            if (data[k]) {
                if (!Array.isArray(data[k])) data[k] = [data[k]];
                data[k].push(v);
            } else {
                data[k] = v;
            }
        }
        return data;
    }

    async function handleForm(e) {
        e.preventDefault();
        const form = e.currentTarget;
        // Basic required validation
        const required = form.querySelectorAll('[required]');
        for (let el of required) {
            if (!el.value || (el.type === 'checkbox' && !el.checked)) {
                el.focus();
                showMessage(form, 'error', 'Please fill all required fields.');
                return;
            }
        }

        const data = serializeForm(form);
        // If form has a data-action attribute, POST JSON to it
        const action = form.dataset.action || form.getAttribute('action');
        if (action && action !== '#') {
            try {
                const res = await fetch(action, {
                    method: form.method || 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    showMessage(form, 'success', 'Thanks — your submission was received.');
                    form.reset();
                } else {
                    showMessage(form, 'error', 'Submission failed. Please try again later.');
                }
            } catch (err) {
                console.error(err);
                showMessage(form, 'error', 'Unable to submit at this time.');
            }
        } else {
            // No backend configured — log and show success message
            console.log('Form data (no action configured):', data);
            showMessage(form, 'success', 'Thanks — your submission has been recorded locally.');
            form.reset();
        }
    }

    // Attach to membership and partnership forms if present
    const membership = document.querySelector('.membership-form');
    if (membership) membership.addEventListener('submit', handleForm);

    const partnership = document.querySelector('.partnership-form');
    if (partnership) partnership.addEventListener('submit', handleForm);
});
