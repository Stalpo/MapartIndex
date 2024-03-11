let countdown = 3;

const updateCountdown = () => {
  document.getElementById('countdown').textContent = countdown;
  countdown--;

  if (countdown >= 0) {
    setTimeout(updateCountdown, 1000);
  } else {
    window.location.href = '/';
  }
};

updateCountdown();