document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');

  let count = 0;
  button.addEventListener('click', (e) => {
    e.preventDefault();
    button.textContent = `You clicked ${++count} times!`;
  });
});
