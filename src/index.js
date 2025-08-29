require('./index.css');
const moviesData = require('./data.json');

class MovieTable {
  constructor(data) {
    this.data = data;
    this.sortStates = [
      { key: 'id', direction: 'asc' },
      { key: 'id', direction: 'desc' },
      { key: 'title', direction: 'asc' },
      { key: 'title', direction: 'desc' },
      { key: 'year', direction: 'asc' },
      { key: 'year', direction: 'desc' },
      { key: 'imdb', direction: 'asc' },
      { key: 'imdb', direction: 'desc' },
    ];
    this.currentSortIndex = 0;
    this.init();
  }

  init() {
    this.createTable();
    this.renderTable();
    this.startAutoSort();
  }

  createTable() {
    this.container = document.createElement('div');
    this.container.className = 'table-container';
    
    this.table = document.createElement('table');
    this.table.className = 'movie-table';
    
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    
    const headerRow = document.createElement('tr');
    ['id', 'title', 'year', 'imdb'].forEach(key => {
      const th = document.createElement('th');
      th.textContent = this.getHeaderText(key);
      headerRow.appendChild(th);
    });
    
    this.thead.appendChild(headerRow);
    this.table.appendChild(this.thead);
    this.table.appendChild(this.tbody);
    this.container.appendChild(this.table);
    
    document.body.appendChild(this.container);
  }

  getHeaderText(key) {
    const texts = {
      id: '#',
      title: 'Название',
      year: 'Год',
      imdb: 'IMDb'
    };
    return texts[key] || key;
  }

  renderTable() {
    this.tbody.innerHTML = '';
    
    this.data.forEach(movie => {
      const row = document.createElement('tr');
      
      // Добавляем data-атрибуты
      row.dataset.id = movie.id;
      row.dataset.title = movie.title;
      row.dataset.year = movie.year;
      row.dataset.imdb = movie.imdb;
      
      // Создаем ячейки
      const idCell = document.createElement('td');
      idCell.textContent = `#${movie.id}`;
      
      const titleCell = document.createElement('td');
      titleCell.textContent = movie.title;
      
      const yearCell = document.createElement('td');
      yearCell.textContent = `(${movie.year})`;
      
      const imdbCell = document.createElement('td');
      imdbCell.textContent = `imdb: ${movie.imdb.toFixed(2)}`;
      
      row.appendChild(idCell);
      row.appendChild(titleCell);
      row.appendChild(yearCell);
      row.appendChild(imdbCell);
      
      this.tbody.appendChild(row);
    });
  }

  sortTable() {
    const sortState = this.sortStates[this.currentSortIndex];
    const { key, direction } = sortState;
    
    // Получаем все строки таблицы
    const rows = Array.from(this.tbody.querySelectorAll('tr'));
    
    // Сортируем строки на основе data-атрибутов
    rows.sort((a, b) => {
      let valueA, valueB;
      
      // Получаем значения из data-атрибутов
      if (key === 'id' || key === 'year') {
        valueA = parseInt(a.dataset[key]);
        valueB = parseInt(b.dataset[key]);
      } else if (key === 'imdb') {
        valueA = parseFloat(a.dataset[key]);
        valueB = parseFloat(b.dataset[key]);
      } else {
        valueA = a.dataset[key].toLowerCase();
        valueB = b.dataset[key].toLowerCase();
      }
      
      // Сравниваем значения
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    // Очищаем таблицу и добавляем отсортированные строки
    this.tbody.innerHTML = '';
    rows.forEach(row => this.tbody.appendChild(row));
    
    // Обновляем заголовки таблицы
    this.updateHeaderArrow(key, direction);
    
    // Переходим к следующему состоянию сортировки
    this.currentSortIndex = (this.currentSortIndex + 1) % this.sortStates.length;
  }

  updateHeaderArrow(key, direction) {
    // Убираем все классы стрелок
    const headers = this.thead.querySelectorAll('th');
    headers.forEach(header => {
      header.classList.remove('asc', 'desc');
    });
    
    // Добавляем класс стрелки к активному заголовку
    const headerIndex = ['id', 'title', 'year', 'imdb'].indexOf(key);
    if (headerIndex !== -1) {
      headers[headerIndex].classList.add(direction);
    }
  }

  startAutoSort() {
    // Первая сортировка при загрузке
    this.sortTable();
    
    // Автоматическая сортировка каждые 2 секунды
    setInterval(() => {
      this.sortTable();
    }, 2000);
  }
}

// Загрузка данных и инициализация таблицы
new MovieTable(moviesData);