// ВРЕМОНТЕ | Главный файл приложения

// Конфигурация
const CONFIG = {
  APP_NAME: 'Времонте',
  VERSION: '1.0.0',
  API_URL: 'https://api.vremonte.ru',
  DEBUG: true
};

// Класс приложения
class VremonteApp {
  constructor() {
    this.user = null;
    this.currentView = 'loading';
    this.init();
  }
  
  async init() {
    console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} запускается...`);
    
    // Проверка авторизации
    await this.checkAuth();
    
    // Загрузка интерфейса
    this.loadView();
    
    // Инициализация PWA
    this.initPWA();
    
    // Тестовые данные (позже заменим на реальные)
    this.testData = {
      orders: [
        { id: 1, title: 'Установить смеситель', distance: '0.8 км', time: '15 мин', responses: 0 },
        { id: 2, title: 'Покрасить стену', distance: '1.2 км', time: '2 часа', responses: 3 },
        { id: 3, title: 'Починить розетку', distance: '2.5 км', time: '1 час', responses: 5 }
      ],
      masters: [
        { id: 1, name: 'Иван', rating: 4.8, distance: '0.8 км', specialty: 'Сантехник' },
        { id: 2, name: 'Алексей', rating: 4.5, distance: '1.2 км', specialty: 'Маляр' }
      ]
    };
  }
  
  async checkAuth() {
    // Проверяем сохранённую сессию
    const token = localStorage.getItem('vremonte_token');
    const userData = localStorage.getItem('vremonte_user');
    
    if (token && userData) {
      this.user = JSON.parse(userData);
      this.currentView = 'main';
    } else {
      this.currentView = 'auth';
    }
  }
  
  loadView() {
    const appElement = document.getElementById('app') || document.body;
    
    switch(this.currentView) {
      case 'loading':
        appElement.innerHTML = this.getLoadingScreen();
        break;
        
      case 'auth':
        appElement.innerHTML = this.getAuthScreen();
        break;
        
      case 'main':
        appElement.innerHTML = this.getMainScreen();
        break;
        
      case 'client':
        appElement.innerHTML = this.getClientScreen();
        break;
        
      case 'master':
        appElement.innerHTML = this.getMasterScreen();
        break;
    }
  }
  
  getLoadingScreen() {
    return `
      <div class="container fade-in">
        <div class="logo">
          <div class="logo-icon">🏔️</div>
          <h1>${CONFIG.APP_NAME}</h1>
          <p>Загрузка безопасного сервиса...</p>
        </div>
      </div>
    `;
  }
  
  getAuthScreen() {
    return `
      <div class="container fade-in">
        <div class="logo">
          <div class="logo-icon">🏔️</div>
          <h1>${CONFIG.APP_NAME}</h1>
          <p>Безопасные услуги в Якутии</p>
        </div>
        
        <div class="card">
          <h2>Вход в приложение</h2>
          <p>Для доступа к проверенным мастерам и заказам</p>
          
          <div class="input-group">
            <input type="tel" id="phone" placeholder="+7 (999) 123-45-67" maxlength="16">
          </div>
          
          <button class="btn btn-primary" onclick="app.sendSMS()">
            Получить код по СМС
          </button>
          
          <div class="divider">или</div>
          
          <button class="btn btn-secondary" onclick="app.demoLogin()">
            Демо-вход (для теста)
          </button>
          
          <p class="small-text">
            🔒 Все данные защищены<br>
            📍 Только ваш район (10 км)<br>
            ⭐ Бесплатно для всех
          </p>
        </div>
      </div>
    `;
  }
  
  getMainScreen() {
    return `
      <div class="container fade-in">
        <div class="logo">
          <div class="logo-icon">🏔️</div>
          <h1>${CONFIG.APP_NAME}</h1>
          <p>Добро пожаловать, ${this.user?.name || 'Пользователь'}!</p>
        </div>
        
        <div class="card">
          <h2>Что вам нужно?</h2>
          
          <button class="btn btn-primary" onclick="app.showClientMode()">
            <span style="font-size: 1.3em">🎯</span><br>
            СОЗДАТЬ ЗАКАЗ<br>
            <small>Нужен мастер</small>
          </button>
          
          <div class="divider">или</div>
          
          <button class="btn btn-secondary" onclick="app.showMasterMode()">
            <span style="font-size: 1.3em">👷</span><br>
            СТАТЬ МАСТЕРОМ<br>
            <small>Ищу работу</small>
          </button>
        </div>
        
        <div class="card">
          <h3>Статистика</h3>
          <p>✅ 1,245 проверенных пользователей</p>
          <p>📍 Работает в Якутске, Нюрбе, Мирном</p>
          <p>⭐ 0% комиссия, бесплатно для всех</p>
        </div>
        
        <button class="btn btn-outline" onclick="app.logout()">
          Выйти из аккаунта
        </button>
      </div>
    `;
  }
  
  getClientScreen() {
    return `
      <div class="container fade-in">
        <div class="logo">
          <div class="logo-icon">🎯</div>
          <h1>Режим клиента</h1>
          <p>Создайте заказ и найдите проверенного мастера</p>
        </div>
        
        <div class="card">
          <h3>Мои заказы</h3>
          <p>Здесь будут ваши активные заказы</p>
          <button class="btn btn-primary" onclick="app.createOrder()">
            + Создать новый заказ
          </button>
        </div>
        
        <button class="btn btn-outline" onclick="app.backToMain()">
          ← Назад
        </button>
      </div>
    `;
  }
  
  getMasterScreen() {
    return `
      <div class="container fade-in">
        <div class="logo">
          <div class="logo-icon">👷</div>
          <h1>Режим мастера</h1>
          <p>Найдите заказы в радиусе 10 км</p>
        </div>
        
        <div class="card">
          <h3>Лента заказов</h3>
          ${this.testData.orders.map(order => `
            <div class="card" style="margin: 10px 0; padding: 15px;">
              <h4>${order.title}</h4>
              <p>${order.distance} • ${order.time} • ${order.responses}/5 откликов</p>
              <button class="btn ${order.responses >= 5 ? 'btn-outline' : 'btn-primary'}" 
                      ${order.responses >= 5 ? 'disabled' : ''}
                      onclick="app.respondToOrder(${order.id})">
                ${order.responses >= 5 ? '⛔ НЕДОСТУПНО' : '✅ ОТКЛИКНУТЬСЯ'}
              </button>
            </div>
          `).join('')}
        </div>
        
        <button class="btn btn-outline" onclick="app.backToMain()">
          ← Назад
        </button>
      </div>
    `;
  }
  
  // Методы приложения
  sendSMS() {
    const phone = document.getElementById('phone')?.value;
    if (!phone) {
      alert('Введите номер телефона');
      return;
    }
    alert(`Код отправлен на ${phone}\n(в демо-режиме используйте "Демо-вход")`);
  }
  
  demoLogin() {
    // Демо-авторизация
    this.user = {
      id: 1,
      name: 'Демо Пользователь',
      phone: '+7 (999) 123-45-67',
      role: 'client'
    };
    
    localStorage.setItem('vremonte_token', 'demo-token-123');
    localStorage.setItem('vremonte_user', JSON.stringify(this.user));
    
    this.currentView = 'main';
    this.loadView();
  }
  
  showClientMode() {
    this.currentView = 'client';
    this.loadView();
  }
  
  showMasterMode() {
    this.currentView = 'master';
    this.loadView();
  }
  
  backToMain() {
    this.currentView = 'main';
    this.loadView();
  }
  
  createOrder() {
    alert('Создание заказа будет реализовано в следующем обновлении');
  }
  
  respondToOrder(orderId) {
    alert(`Отклик на заказ #${orderId} отправлен\n(в рабочей версии мастер увидит ваш номер)`);
  }
  
  logout() {
    localStorage.removeItem('vremonte_token');
    localStorage.removeItem('vremonte_user');
    this.user = null;
    this.currentView = 'auth';
    this.loadView();
  }
  
  initPWA() {
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/Вермонте-Якутия/service-worker.js')
        .then(reg => console.log('✅ Service Worker зарегистрирован:', reg.scope))
        .catch(err => console.error('❌ Ошибка Service Worker:', err));
    }
    
    // Определение standalone режима (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 Приложение запущено как PWA');
    }
  }
}

// Создаём глобальный экземпляр
const app = new VremonteApp();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { app, CONFIG };
}
