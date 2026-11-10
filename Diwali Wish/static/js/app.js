/**
 * ============================================================================
 * 🪔 MAIN APPLICATION LOGIC - SHUBH DIWALI GREETINGS
 * Interactive Rituals, Personalized Card Studio & Community Wish Wall
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Fireworks Engine
  const fireworks = new DiwaliFireworks('fireworks-canvas');

  // 2. Audio & Ambient Controls
  const soundBtn = document.getElementById('btn-sound-toggle');
  const ambientBtn = document.getElementById('btn-music-toggle');
  const autoFireBtn = document.getElementById('btn-auto-fire');
  const sparklerBtn = document.getElementById('btn-sparkler-mode');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      soundBtn.innerHTML = isMuted ? '🔇 Sound: Off' : '🔊 Sound: On';
      soundBtn.classList.toggle('active', !isMuted);
      showToast(isMuted ? 'Sound effects muted' : 'Sound effects enabled! ✨');
    });
  }

  if (ambientBtn) {
    ambientBtn.addEventListener('click', () => {
      const isPlaying = window.soundEngine.toggleAmbientMusic();
      ambientBtn.innerHTML = isPlaying ? '🎵 Music: Playing' : '🎶 Ambient Music';
      ambientBtn.classList.toggle('active', isPlaying);
      showToast(isPlaying ? '🎶 Festive Raag Yaman Ambient started' : 'Music paused');
    });
  }

  if (autoFireBtn) {
    autoFireBtn.addEventListener('click', () => {
      const isAuto = fireworks.toggleAutoMode();
      autoFireBtn.innerHTML = isAuto ? '🎆 Auto Fireworks: ON' : '🎆 Auto Fireworks: OFF';
      autoFireBtn.classList.toggle('active', isAuto);
      showToast(isAuto ? 'Auto fireworks active!' : 'Auto fireworks paused. Click anywhere to fire!');
    });
  }

  if (sparklerBtn) {
    sparklerBtn.addEventListener('click', () => {
      const isSparkler = fireworks.toggleSparklerMode();
      sparklerBtn.innerHTML = isSparkler ? '✨ Sparkler Wand: ON' : '✨ Sparkler Wand: OFF';
      sparklerBtn.classList.toggle('active', isSparkler);
      showToast(isSparkler ? '✨ Move your mouse/finger to shower sparkler sparks!' : 'Sparkler wand deactivated');
    });
  }

  // 3. Interactive Diya Lighting Ceremony
  const diyas = document.querySelectorAll('.diya-item');
  const diyaBadge = document.getElementById('diya-count-badge');
  const mahaBanner = document.getElementById('maha-blessing-banner');
  let litCount = 0;
  const bellFrequencies = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5, D5, E5, G5, A5 auspicious notes

  diyas.forEach((diya, index) => {
    diya.addEventListener('click', () => {
      if (!diya.classList.contains('lit')) {
        diya.classList.add('lit');
        litCount++;

        // Play harmonic chime
        if (window.soundEngine) {
          window.soundEngine.playBell(bellFrequencies[index % bellFrequencies.length]);
        }

        // Add sparklers around the lit diya
        const rect = diya.getBoundingClientRect();
        for (let i = 0; i < 15; i++) {
          fireworks.addSparkler(rect.left + rect.width / 2, rect.top + 20);
        }

        // Update badge
        if (diyaBadge) {
          diyaBadge.textContent = `${litCount} of 5 Diyas Awakened ✨`;
        }

        // Check if all 5 are lit
        if (litCount === 5) {
          if (mahaBanner) {
            mahaBanner.style.display = 'block';
          }
          if (diyaBadge) {
            diyaBadge.textContent = '🌟 Maha Deepotsav Awakened! All 5 Diyas are Shining!';
            diyaBadge.style.background = 'linear-gradient(135deg, #FF9900, #FFD700)';
            diyaBadge.style.color = '#1a0826';
          }
          fireworks.triggerGrandCelebration();
          showToast('🪔 Divine Deepotsav Activated! May your life be illuminated with endless blessings!');
        }
      }
    });
  });

  // Light All Diyas Quick Action
  const btnLightAll = document.getElementById('btn-light-all');
  if (btnLightAll) {
    btnLightAll.addEventListener('click', () => {
      diyas.forEach((diya, i) => {
        setTimeout(() => {
          diya.click();
        }, i * 200);
      });
    });
  }

  // 4. Personalized Wish Generator & Live Card Studio
  const inputRecipient = document.getElementById('input-recipient');
  const inputSender = document.getElementById('input-sender');
  const inputMessage = document.getElementById('input-message');

  const previewRecipient = document.getElementById('preview-recipient');
  const previewSender = document.getElementById('preview-sender');
  const previewMessage = document.getElementById('preview-message');

  function updateCardPreview() {
    const to = inputRecipient.value.trim() || 'Dear Loved Ones';
    const from = inputSender.value.trim() || 'Your Well-Wisher';
    const msg = inputMessage.value.trim() || 'May the supreme divine light of Diwali illuminate your life with boundless peace, health, immense prosperity, and endless happiness!';

    if (previewRecipient) previewRecipient.textContent = to;
    if (previewSender) previewSender.textContent = `~ ${from}`;
    if (previewMessage) previewMessage.textContent = `“${msg}”`;
  }

  if (inputRecipient) inputRecipient.addEventListener('input', updateCardPreview);
  if (inputSender) inputSender.addEventListener('input', updateCardPreview);
  if (inputMessage) inputMessage.addEventListener('input', updateCardPreview);

  // Preset Quote Selector Pills
  const presetPills = document.querySelectorAll('.preset-pill');
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const quote = pill.getAttribute('data-quote');
      if (quote && inputMessage) {
        inputMessage.value = quote;
        updateCardPreview();
        showToast('Blessing updated in your card!');
      }
    });
  });

  // Check URL parameters on load for custom personalized greetings
  const urlParams = new URLSearchParams(window.location.search);
  const paramTo = urlParams.get('to');
  const paramFrom = urlParams.get('from');
  const paramMsg = urlParams.get('msg');

  if (paramTo || paramFrom || paramMsg) {
    if (paramTo && inputRecipient) inputRecipient.value = paramTo;
    if (paramFrom && inputSender) inputSender.value = paramFrom;
    if (paramMsg && inputMessage) inputMessage.value = paramMsg;
    updateCardPreview();

    // Show personalized welcome greeting on top
    const heroTitle = document.querySelector('.hero-section .sub-greeting');
    if (heroTitle && paramTo) {
      heroTitle.textContent = `✨ Specially For You, ${paramTo} ✨`;
    }
  }

  // Copy Personalized Link Button
  const btnCopyLink = document.getElementById('btn-copy-link');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', () => {
      const to = encodeURIComponent(inputRecipient ? inputRecipient.value.trim() : '');
      const from = encodeURIComponent(inputSender ? inputSender.value.trim() : '');
      const msg = encodeURIComponent(inputMessage ? inputMessage.value.trim() : '');

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?to=${to}&from=${from}&msg=${msg}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('📋 Custom Diwali Wish Link copied to clipboard!');
      }).catch(() => {
        prompt('Copy your custom Diwali greeting link:', shareUrl);
      });
    });
  }

  // Share via WhatsApp Button
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener('click', () => {
      const to = inputRecipient ? inputRecipient.value.trim() || 'My Dear Friends' : '';
      const from = inputSender ? inputSender.value.trim() || 'Raj' : '';
      const msg = inputMessage ? inputMessage.value.trim() : '';

      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?to=${encodeURIComponent(to)}&from=${encodeURIComponent(from)}&msg=${encodeURIComponent(msg)}`;

      const text = `🪔 *Shubh Deepavali Greetings!* ✨\n\nDear *${to}*,\n\n"${msg}"\n\nWith warm blessings and love,\n*${from}*\n\n🌟 View your personalized animated Diwali card here:\n${shareUrl}`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Download Greeting Card as Image (Pure Canvas Generator)
  const btnDownloadCard = document.getElementById('btn-download-card');
  if (btnDownloadCard) {
    btnDownloadCard.addEventListener('click', () => {
      generateAndDownloadCard();
    });
  }

  function generateAndDownloadCard() {
    showToast('Rendering high-resolution Diwali greeting card...');
    const to = inputRecipient ? inputRecipient.value.trim() || 'Dear Loved Ones' : 'Dear Loved Ones';
    const from = inputSender ? inputSender.value.trim() || 'Your Well-Wisher' : 'Your Well-Wisher';
    const msg = inputMessage ? inputMessage.value.trim() || 'May the light of Diwali brighten your world.' : '';

    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1200;
    cardCanvas.height = 800;
    const ctx = cardCanvas.getContext('2d');

    // Rich gradient background
    const bgGrad = ctx.createRadialGradient(600, 400, 50, 600, 400, 700);
    bgGrad.addColorStop(0, '#2d0c45');
    bgGrad.addColorStop(0.5, '#150624');
    bgGrad.addColorStop(1, '#08020e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Ornate gold border
    ctx.lineWidth = 10;
    const borderGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    borderGrad.addColorStop(0, '#FFD700');
    borderGrad.addColorStop(0.3, '#FFF4BD');
    borderGrad.addColorStop(0.7, '#FFA500');
    borderGrad.addColorStop(1, '#B8860B');
    ctx.strokeStyle = borderGrad;
    ctx.strokeRect(35, 35, 1130, 730);

    // Inner thin border
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.strokeRect(50, 50, 1100, 700);

    // Corner decorative accents
    const drawCorner = (x, y) => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(50, 50);
    drawCorner(1150, 50);
    drawCorner(50, 750);
    drawCorner(1150, 750);

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFB300';
    ctx.font = 'bold 30px Georgia, serif';
    ctx.fillText('✨ शुभ दीपावली ✨', 600, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText('HAPPY DIWALI', 600, 185);

    // Recipient
    ctx.fillStyle = '#FFF4BD';
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillText(`Dedicated to: ${to}`, 600, 260);

    // Diya Graphic Illustration
    ctx.font = '72px sans-serif';
    ctx.fillText('🪔', 600, 360);

    // Message (Wrapped text)
    ctx.fillStyle = '#FBEFE0';
    ctx.font = '28px Georgia, serif';
    wrapText(ctx, `“${msg}”`, 600, 440, 920, 42);

    // Sender
    ctx.fillStyle = '#FFD700';
    ctx.font = 'italic bold 36px Georgia, cursive';
    ctx.fillText(`Warmest Wishes From: ${from}`, 600, 640);

    // Footer shloka
    ctx.fillStyle = '#FFA500';
    ctx.font = '20px Georgia, serif';
    ctx.fillText('तमसो मा ज्योतिर्गमय • May the divine light lead you to peace and glory', 600, 710);

    // Convert to PNG download
    const link = document.createElement('a');
    link.download = `Diwali_Wish_${to.replace(/\s+/g, '_')}.png`;
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
    showToast('🎉 Greeting Card downloaded successfully!');
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  // 5. Community Wish Wall
  const wishesContainer = document.getElementById('wishes-wall-container');
  const btnPostWish = document.getElementById('btn-post-wish');
  const inputWallName = document.getElementById('input-wall-name');
  const inputWallText = document.getElementById('input-wall-text');

  const defaultWishes = [
    { name: "Aarav Sharma", text: "Wishing everyone immense wealth, supreme joy, and glowing health this Deepavali!", time: "Just now" },
    { name: "Pooja Patel", text: "May Maa Lakshmi bless your sweet home with eternal abundance and harmony. Shubh Diwali!", time: "2 hours ago" },
    { name: "Vikram Malhotra", text: "Happy Diwali to all friends and family! Light lamps of gratitude and love.", time: "4 hours ago" },
    { name: "Ananya Iyer", text: "May the holy festival usher in success in all your new ventures and dreams!", time: "5 hours ago" }
  ];

  function renderWishItem(wish) {
    const card = document.createElement('div');
    card.className = 'wish-item';
    card.innerHTML = `
      <div class="wish-item-header">
        <span class="wish-author">🪔 ${escapeHtml(wish.name)}</span>
        <span class="wish-time">${escapeHtml(wish.time || 'Recently')}</span>
      </div>
      <div class="wish-text">${escapeHtml(wish.text)}</div>
    `;
    return card;
  }

  function loadWishes() {
    // Try to load from Python Flask API if running
    fetch('/api/wishes')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.wishes) && wishesContainer) {
          wishesContainer.innerHTML = '';
          data.wishes.forEach(w => wishesContainer.appendChild(renderWishItem(w)));
        }
      })
      .catch(() => {
        // Fallback to local storage or defaults when opened directly as file
        const stored = localStorage.getItem('diwali_wishes');
        const list = stored ? JSON.parse(stored) : defaultWishes;
        if (wishesContainer) {
          wishesContainer.innerHTML = '';
          list.forEach(w => wishesContainer.appendChild(renderWishItem(w)));
        }
      });
  }

  loadWishes();

  if (btnPostWish) {
    btnPostWish.addEventListener('click', () => {
      const name = (inputWallName ? inputWallName.value.trim() : '') || 'Kind Soul';
      const text = inputWallText ? inputWallText.value.trim() : '';

      if (!text) {
        showToast('Please type your warm Diwali wish first! ✨');
        return;
      }

      const newWish = { name: name, text: text, time: 'Just now' };

      // Try sending to Python Flask backend
      fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish)
      })
      .then(res => res.json())
      .then(data => {
        if (wishesContainer) {
          wishesContainer.prepend(renderWishItem(newWish));
        }
        clearInputs();
        showToast('✨ Your blessing has been added to the Diwali Wish Wall!');
      })
      .catch(() => {
        // LocalStorage fallback for standalone offline mode
        const stored = localStorage.getItem('diwali_wishes');
        const list = stored ? JSON.parse(stored) : defaultWishes;
        list.unshift(newWish);
        localStorage.setItem('diwali_wishes', JSON.stringify(list));
        if (wishesContainer) {
          wishesContainer.prepend(renderWishItem(newWish));
        }
        clearInputs();
        showToast('✨ Your blessing has been saved to the Wish Wall!');
      });

      // Play bell chime on posting wish
      if (window.soundEngine) {
        window.soundEngine.playBell(783.99);
      }
    });
  }

  function clearInputs() {
    if (inputWallName) inputWallName.value = '';
    if (inputWallText) inputWallText.value = '';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});

// Global Toast Notification Helper
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
