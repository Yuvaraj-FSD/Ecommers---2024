// Optional: Pause animation on hover
const track = document.getElementById('brand-track');
track.addEventListener('mouseenter', () => {
  track.style.animationPlayState = 'paused';
});
track.addEventListener('mouseleave', () => {
  track.style.animationPlayState = 'running';
});