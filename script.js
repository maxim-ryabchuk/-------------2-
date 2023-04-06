fetch('https://cats.petiteweb.dev/api/single/{db}/show/')
  .then(response => response.json())
  .then(data => {
    // Обработка данных и отображение карточек котиков на странице
  })
  .catch(error => console.error(error));

  function renderCats(cats) {
    const catsList = document.querySelector('.cats-list');
    catsList.innerHTML = '';
  
    for (let cat of cats) {
      const catCard = document.createElement('div');
      catCard.classList.add('cat-card');
  
      const catName = document.createElement('h3');
      catName.textContent = cat.name;
      catCard.appendChild(catName);
  
      const catAge = document.createElement('p');
      catAge.innerHTML = `<strong>Возраст:</strong> ${cat.age}`;
      catCard.appendChild(catAge);
      
      const catRate = document.createElement('p');
      catRate.innerHTML = `<strong>Рейтинг:</strong> ${cat.rate}`;
      catCard.appendChild(catRate);
  
      const catImage = document.createElement('img');
      catImage.src = cat.image;
      catImage.alt = cat.name;
      catCard.appendChild(catImage);
  
      const catInfoBtn = document.createElement('button');
      catInfoBtn.type = 'button';
      catInfoBtn.textContent = 'Подробнее';
      catInfoBtn.addEventListener('click', () => {
        // Открытие модального окна с подробной информацией и редактированием
        openModal(cat);
      });
  
      catCard.appendChild(catInfoBtn);
      catsList.appendChild(catCard);
    }
  }

  const modal = document.querySelector('.modal');
const body = document.querySelector('body');
const closeBtn = modal.querySelector('.close');
const catForm = modal.querySelector('#cat-form');

// Функция для открытия модального окна с инфомрацией о коте
function openModal(cat) {
  // Заполняем форму информацией о коте
  catForm.querySelector('#cat-id').value = cat.id;
  catForm.querySelector('#cat-name').value = cat.name;
  catForm.querySelector('#cat-age').value = cat.age;
  catForm.querySelector('#cat-rate').value = cat.rate;
  catForm.querySelector('#cat-description').value = cat.description;
  catForm.querySelector('#cat-favorite').checked = cat.favorite;
  catForm.querySelector('#cat-image').value = cat.image;

  // Открываем модальное окно
  modal.style.display = 'block';
  body.classList.add('modal-open');
}

// Функция для закрытия модального окна
function closeModal() {
  modal.style.display = 'none';
  body.classList.remove('modal-open');
}

// Закрытие модального окна при клике на closeBtn
closeBtn.addEventListener('click', closeModal);

// Закрытие модального окна при клике на область вне модального окна
modal.addEventListener('click', event => {
  if (event.target == modal) {
    closeModal();
  }
});

// Обработчик отправки формы на сервер
catForm.addEventListener('submit', event => {
    event.preventDefault();
  
    const id = catForm.querySelector('#cat-id').value;
    const name = catForm.querySelector('#cat-name').value;
    const age = catForm.querySelector('#cat-age').value;
    const rate = catForm.querySelector('#cat-rate').value;
    const description = catForm.querySelector('#cat-description').value;
    const favorite = catForm.querySelector('#cat-favorite').checked;
    const image = catForm.querySelector('#cat-image').value;
  
    const data = { age, rate, description, favorite, image };
  
    // Отправка HTTP-запроса на сервер для обновления информации о коте
    fetch(`https://cats.petiteweb.dev/api/single/{db}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      // Обновление списка карточек котов на странице
      updateCatsList();
      // Закрытие модального окна
      closeModal();
    })
    .catch(error => console.error(error));
  });
  
  // Обработчик кнопки "Удалить кота"
  catForm.querySelector('#delete-cat-btn').addEventListener('click', event => {
    event.preventDefault();
  
    const id = catForm.querySelector('#cat-id').value;
  
    // Отправка HTTP-запроса на сервер для удаления кота
    fetch(`https://cats.petiteweb.dev/api/single/{db}/delete/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      // Обновление списка карточек котов на странице
      updateCatsList();
      // Закрытие модального окна
      closeModal();
    })
    .catch(error => console.error(error));
  });

  function updateCatsList() {
    fetch('https://cats.petiteweb.dev/api/single/{db}/show/')
      .then(response => response.json())
      .then(data => {
        renderCats(data);
      })
      .catch(error => console.error(error));
  }

  const addCatBtn = document.querySelector('.add-cat-btn');

// Обработчик кнопки "Добавить кота"
addCatBtn.addEventListener('click', () => {
  // Открываем модальное окно создания кота
  openModal({id: '', name: '', age: '', rate: '', description: '', favorite: false, image: ''});
});

// Заполнение формы создания кота через LocalStorage
const catFormFields = [
  'cat-name',
  'cat-age',
  'cat-rate',
  'cat-description',
  'cat-favorite',
  'cat-image'
];

for (let field of catFormFields) {
  const value = localStorage.getItem(field);
  if (value != null) {
    catForm.querySelector(`#${field}`).value = value;
  }

  // Обновление значения в LocalStorage при изменении поля
  catForm.querySelector(`#${field}`).addEventListener('input', event => {
    localStorage.setItem(field, event.target.value);
  });
}

