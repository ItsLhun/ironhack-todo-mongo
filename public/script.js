const button = document.querySelector(
  `form[action=/toggle/${req.params.id}/${req.params.completed}] button`
);
button.classList.toggle('completed-false');
button.classList.toggle('completed-true');
