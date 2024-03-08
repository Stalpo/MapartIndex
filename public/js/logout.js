let countdown = 5;

const updateCountdown = () => {
  document.getElementById('countdown').textContent = countdown;
  countdown--;

  if (countdown >= 0) {
    setTimeout(updateCountdown, 1000);
  } else {
    document.cookie = 'token=; path=/;';
    window.location.href = '/';
  }
};

updateCountdown();