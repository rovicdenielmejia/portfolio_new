(function() {
  function initInquireModal() {
    var modal = document.getElementById('inquire-modal');
    var modalTitle = document.getElementById('inquire-modal-title');
    var modalForm = document.getElementById('inquire-modal-form');
    var subjectInput = modalForm ? modalForm.querySelector('input[name="subject"]') : null;
    var lastFocused = null;
    var inquireToOverride = null;

    function openModal(subject, title, triggerEl) {
      if (!modal || !modalForm) return;
      lastFocused = triggerEl || document.activeElement;
      inquireToOverride = triggerEl && triggerEl.getAttribute('data-inquire-to');
      if (subjectInput) subjectInput.value = subject || '';
      if (modalTitle) modalTitle.textContent = title || 'Book a Strategic Consultation';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var closeBtn = modal.querySelector('.inquire-modal-close');
      var firstFocusable = closeBtn || modalForm.querySelector('input, textarea, button');
      if (firstFocusable) setTimeout(function() { firstFocusable.focus(); }, 50);
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    var closeBtn = modal ? modal.querySelector('.inquire-modal-close') : null;
    var backdrop = modal ? modal.querySelector('.inquire-modal-backdrop') : null;
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });

    var inquireSelectors = '.services-inquire-btn, .pageant-inquire-btn, .live-coverage-inquire-btn';
    document.querySelectorAll(inquireSelectors).forEach(function(btn) {
      btn.addEventListener('click', function() {
        var subject = this.getAttribute('data-inquire-subject') || '';
        var title = this.getAttribute('data-inquire-title') || 'Book a Strategic Consultation';
        openModal(subject, title, this);
      });
    });

    if (!modalForm) return;

    var phoneInput = modalForm.querySelector('input[name="phone"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); });
      phoneInput.addEventListener('paste', function(e) {
        e.preventDefault();
        var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
        var start = this.selectionStart, end = this.selectionEnd;
        this.value = this.value.slice(0, start) + pasted + this.value.slice(end);
        this.setSelectionRange(start + pasted.length, start + pasted.length);
      });
    }

    var submitBtn = modalForm.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

    modalForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      var nameEl = modalForm.elements.name;
      var emailEl = modalForm.elements.email;
      var phoneEl = modalForm.elements.phone;
      var messageEl = modalForm.elements.message;
      
      var formData = {
        name: nameEl ? nameEl.value.trim() : '',
        email: emailEl ? emailEl.value.trim() : '',
        phone: phoneEl ? phoneEl.value.trim() : '',
        message: messageEl ? messageEl.value.trim() : '',
        service: subjectInput && subjectInput.value ? subjectInput.value.trim() : 'General Inquiry',
        source: window.location.pathname || 'portfolio'
      };

      if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      try {
        var response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          closeModal();
          modalForm.reset();
          alert('Thank you for your inquiry! I will get back to you soon.');
        } else {
          var errorData = await response.json();
          alert('Error: ' + (errorData.error || 'Failed to submit inquiry'));
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit. Please try again or email directly.');
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      }
      inquireToOverride = null;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInquireModal);
  } else {
    initInquireModal();
  }
})();
