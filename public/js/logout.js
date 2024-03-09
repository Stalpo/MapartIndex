let countdown = 5;

const updateCountdown = () => {
  document.cookie = 'token=; path=/;';
  document.getElementById('countdown').textContent = countdown;
  countdown--;

  if (countdown >= 0) {
    setTimeout(updateCountdown, 1000);
  } else {
    window.location.href = '/';
  }
};

updateCountdown();