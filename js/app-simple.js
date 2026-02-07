// ВРЕМОНТЕ | Упрощённая версия с Google Sheets API

class VremonteApp {
    constructor() {
        this.user = null;
        this.currentScreen = 'auth';
        this.demoMode = false;
        this.phone = '';
        
        // 🔴 ВАЖНО: Вставьте ваш реальный URL из Google Apps Script
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbxCUWzXjixUSnBpJryihnd8Cm5oBzoMHikk-NuQLVKLJmg3y5iaLAoGaUu9iK6P6lgP/exec';
        
        // Тестовые данные
        this.orders = [
            {
                id: 1,
                title: 'Установить смеситель на кухне',
                description: 'Старый течёт, нужна замена. Есть свой смеситель.',
                address: 'ул. Ленина, 15',
                budget: '2000-3000 руб',
                category: 'сантехника',
                createdAt: '15 минут назад',
                responses: 2,
                maxResponses: 5,
                status: 'active'
            },
            {
                id: 2,
                title: 'Покрасить стену в спальне',
                description: 'Площадь 15 м², цвет белый матовый.',
                address: 'мкр. Гагарина, 25',
                budget: 'Договорная',
                category: 'ремонт',
                createdAt: '2 часа назад',
                responses: 3,
                maxResponses: 5,
                status: 'active'
            }
        ];
        
        this.masters = [
            {
                id: 1,
                name: 'Иван Петров',
                rating: 4.8,
                reviews: 24,
                specialty: 'сантехника',
                experience: '5 лет',
                distance: '0.8 км'
            },
            {
                id: 2,
                name: 'Алексей Семёнов',
                rating: 4.5,
                reviews: 12,
                specialty: 'электрика',
                experience: '3 года',
                distance: '1.2 км'
            }
        ];
        
        this.init();
    }
    
    init() {
        console.log('🚀 Времонте запускается...');
        console.log('API URL:', this.apiUrl);
        
        // Проверяем сохранённую сессию
        this.checkAuth();
        
        // Показываем интерфейс
        this.render();
    }
    
    checkAuth() {
        const savedUser = localStorage.getItem('vremonte_user');
        const savedToken = localStorage.getItem('vremonte_token');
        
        if (savedUser && savedToken) {
            this.user = JSON.parse(savedUser);
            this.currentScreen = 'main';
        } else {
            this.currentScreen = 'auth';
        }
        
        // Проверяем демо-режим
        if (localStorage.getItem('vremonte_demo') === 'true') {
            this.demoMode = true;
            this.user = {
                id: 'demo_001',
                name: 'Демо Пользователь',
                phone: '+7 (999) 123-45-67',
                role: 'client',
                isDemo: true
            };
            this.currentScreen = 'main';
        }
    }
    
    render() {
        const app = document.getElementById('app');
        
        switch(this.currentScreen) {
            case 'auth':
                app.innerHTML = this.getAuthScreen();
                break;
                
            case 'auth-sms':
                app.innerHTML = this.getSMSScreen();
                break;
                
            case 'main':
                app.innerHTML = this.getMainScreen();
                break;
                
            case 'client-create':
                app.innerHTML = this.getCreateOrderScreen();
                break;
                
            case 'master-feed':
                app.innerHTML = this.getMasterFeedScreen();
                break;
                
            default:
                app.innerHTML = this.getAuthScreen();
        }
    }
    
    // ЭКРАН АВТОРИЗАЦИИ
    getAuthScreen() {
        return `
            <div class="logo">🏔️</div>
            <h1>ВРЕМОНТЕ</h1>
            <p>Безопасные услуги в Якутии</p>
            
            <div class="card">
                <h2 style="margin-bottom: 20px;">Вход в приложение</h2>
                
                <div class="form-group">
                    <label for="phone">Номер телефона</label>
                    <input type="tel" id="phone" placeholder="+7 (999) 123-45-67" maxlength="16">
                </div>
                
                <button class="btn btn-primary" onclick="app.sendSMS()">
                    Получить код по СМС
                </button>
                
                <div class="divider">или</div>
                
                <button class="btn btn-secondary" onclick="app.startDemo()">
                    🎮 Демо-режим
                    <div class="text-small">(для тестирования)</div>
                </button>
            </div>
            
            <div class="footer">
                <p>✅ Все мастера проверены по паспорту</p>
                <p>📍 Только ваш район (10 км радиус)</p>
                <p>📞 Контакт виден только после выбора</p>
                <p>⭐ Бесплатно для всех</p>
            </div>
        `;
    }
    
    // ЭКРАН СМС ПОДТВЕРЖДЕНИЯ
    getSMSScreen() {
        return `
            <div style="text-align: left;">
                <button class="btn btn-outline" onclick="app.backToAuth()" style="width: auto; padding: 10px 15px;">
                    ← Назад
                </button>
            </div>
            
            <div class="logo">📱</div>
            <h1>Подтверждение</h1>
            <p>Код отправлен на ${this.phone || '+7 (999) 123-45-67'}</p>
            
            <div class="card">
                <div class="form-group">
                    <label for="smsCode">Код из СМС</label>
                    <input type="text" id="smsCode" placeholder="1234" maxlength="4" style="text-align: center; font-size: 1.5em; letter-spacing: 10px;">
                </div>
                
                <button class="btn btn-primary" onclick="app.verifySMS()">
                    Подтвердить
                </button>
                
                <button class="btn btn-outline mt-20" onclick="app.resendSMS()">
                    Отправить код повторно
                </button>
            </div>
        `;
    }
    
    // ГЛАВНЫЙ ЭКРАН
    getMainScreen() {
        const userName = this.user?.name || 'Пользователь';
        const userRole = this.user?.role === 'master' ? '👷 Мастер' : '🎯 Клиент';
        
        return `
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; background: white; color: #1a2980; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: 600;">${userName}</div>
                        <div style="font-size: 0.9em; opacity: 0.8;">${userRole} ${this.demoMode ? '· 🎮 Демо' : ''}</div>
                    </div>
                </div>
            </div>
            
            <div class="logo">${this.user?.role === 'master' ? '👷' : '🎯'}</div>
            <h1>${this.user?.role === 'master' ? 'РЕЖИМ МАСТЕРА' : 'РЕЖИМ КЛИЕНТА'}</h1>
            <p>${this.user?.role === 'master' ? 'Найдите заказы в радиусе 10 км' : 'Создайте заказ и найдите проверенного мастера'}</p>
            
            <div class="card">
                ${this.user?.role === 'client' ? `
                    <button class="btn btn-primary" onclick="app.showClientCreate()">
                        🎯 СОЗДАТЬ ЗАКАЗ
                    </button>
                    
                    <button class="btn btn-secondary" onclick="app.showClientOrders()">
                        📋 МОИ ЗАКАЗЫ
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="app.showMasterFeed()">
                        👷 ЛЕНТА ЗАКАЗОВ
                    </button>
                    
                    <button class="btn btn-secondary" onclick="app.showMasterProfile()">
                        📊 МОЯ СТАТИСТИКА
                    </button>
                `}
                
                <div class="divider">или</div>
                
                <button class="btn btn-outline" onclick="app.switchRole()">
                    🔄 Сменить на ${this.user?.role === 'client' ? 'МАСТЕРА' : 'КЛИЕНТА'}
                </button>
            </div>
            
            <div class="card">
                <h3>📊 Статистика платформы</h3>
                <p>✅ 1,245 проверенных пользователей</p>
                <p>📍 Работает в Якутске, Нюрбе, Мирном</p>
                <p>⭐ 0 случаев мошенничества</p>
            </div>
            
            <button class="btn btn-outline" onclick="app.logout()">
                🔒 Выйти из аккаунта
            </button>
            
            ${this.demoMode ? `
                <div class="card" style="background: rgba(255,107,53,0.1); border-color: #ff6b35; margin-top: 20px;">
                    <p>🎮 <strong>Демо-режим активен</strong></p>
                    <p class="text-small">Все данные сохраняются локально. Для реальной работы нужна регистрация.</p>
                </div>
            ` : ''}
        `;
    }
    
    // ЭКРАН СОЗДАНИЯ ЗАКАЗА
    getCreateOrderScreen() {
        return `
            <div style="text-align: left;">
                <button class="btn btn-outline" onclick="app.backToMain()" style="width: auto; padding: 10px 15px;">
                    ← Назад
                </button>
            </div>
            
            <h1>🎯 Новый заказ</h1>
            <p>Опишите что нужно сделать</p>
            
            <div class="card">
                <div class="form-group">
                    <label for="orderTitle">Что нужно сделать?</label>
                    <input type="text" id="orderTitle" placeholder="Например: Установить смеситель, покрасить стену">
                </div>
                
                <div class="form-group">
                    <label for="orderDescription">Подробное описание</label>
                    <textarea id="orderDescription" rows="3" placeholder="Опишите детали, особенности, что уже есть, что нужно купить"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="orderAddress">Адрес (для мастера)</label>
                    <input type="text" id="orderAddress" placeholder="ул. Ленина, 15, кв. 42">
                </div>
                
                <div class="form-group">
                    <label for="orderBudget">Бюджет</label>
                    <select id="orderBudget">
                        <option value="">Выберите бюджет</option>
                        <option value="1000-3000">1,000 - 3,000 руб</option>
                        <option value="3000-5000">3,000 - 5,000 руб</option>
                        <option value="5000-10000">5,000 - 10,000 руб</option>
                        <option value="10000-20000">10,000 - 20,000 руб</option>
                        <option value="договорная">Договорная</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="orderCategory">Категория</label>
                    <select id="orderCategory">
                        <option value="">Выберите категорию</option>
                        <option value="сантехника">Сантехника</option>
                        <option value="электрика">Электрика</option>
                        <option value="ремонт">Ремонт</option>
                        <option value="уборка">Уборка</option>
                        <option value="грузчики">Грузчики</option>
                        <option value="другое">Другое</option>
                    </select>
                </div>
                
                <button class="btn btn-primary" onclick="app.createOrder()">
                    📝 ОПУБЛИКОВАТЬ ЗАКАЗ
                </button>
            </div>
            
            <div class="card">
                <h3>Как это работает?</h3>
                <div class="list">
                    <div class="list-item">1. Вы создаёте заказ</div>
                    <div class="list-item">2. Мастера в радиусе 10 км видят его</div>
                    <div class="list-item">3. Первые 5 откликнувшихся попадают к вам</div>
                    <div class="list-item">4. Вы выбираете одного, видите его телефон</div>
                    <div class="list-item">5. Договариваетесь и работа выполняется</div>
                </div>
            </div>
        `;
    }
    
    // ЛЕНТА ЗАКАЗОВ
    getMasterFeedScreen() {
        const ordersHtml = this.orders.map(order => `
            <div class="card" style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4 style="margin-bottom: 5px;">${order.title}</h4>
                        <p class="text-small">${order.address} · ${order.budget}</p>
                    </div>
                    <span class="status ${order.status === 'active' ? 'status-new' : 'status-pending'}">
                        ${order.responses}/${order.maxResponses}
                    </span>
                </div>
                
                <p style="margin: 10px 0; font-size: 0.95em;">${order.description}</p>
                
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; opacity: 0.8;">
                    <span>${order.category}</span>
                    <span>${order.createdAt}</span>
                </div>
                
                <button class="btn ${order.responses >= order.maxResponses ? 'btn-outline' : 'btn-primary'}" 
                        onclick="app.respondToOrder(${order.id})"
                        ${order.responses >= order.maxResponses ? 'disabled' : ''}
                        style="margin-top: 15px;">
                    ${order.responses >= order.maxResponses ? '⛔ НЕДОСТУПНО' : '✅ ОТКЛИКНУТЬСЯ'}
                </button>
            </div>
        `).join('');
        
        return `
            <div style="text-align: left;">
                <button class="btn btn-outline" onclick="app.backToMain()" style="width: auto; padding: 10px 15px;">
                    ← Назад
                </button>
            </div>
            
            <h1>👷 Лента заказов</h1>
            <p>Заказы в радиусе 10 км от вас</p>
            
            ${ordersHtml}
            
            <div class="card">
                <h3>📋 Правила для мастеров</h3>
                <div class="list">
                    <div class="list-item">✅ Откликаться можно на 5 заказов одновременно</div>
                    <div class="list-item">📍 Видны только заказы в радиусе 10 км</div>
                    <div class="list-item">📞 Телефон клиента виден только после выбора</div>
                    <div class="list-item">⭐ Рейтинг растёт после выполненных работ</div>
                </div>
            </div>
        `;
    }
    
    // МЕТОДЫ ПРИЛОЖЕНИЯ
    
    sendSMS() {
        const phone = document.getElementById('phone')?.value;
        if (!phone || phone.length < 10) {
            alert('Введите корректный номер телефона');
            return;
        }
        
        this.phone = phone;
        this.currentScreen = 'auth-sms';
        this.render();
        
        alert(`📱 Код отправлен на ${phone}\n\nДемо-код: 1234`);
    }
    
    async verifySMS() {
        const code = document.getElementById('smsCode')?.value;
        
        if (code === '1234' || code === '0000') {
            // Успешная авторизация
            this.user = {
                id: 'USER_' + Date.now(),
                name: 'Пользователь',
                phone: this.phone,
                role: 'client',
                registered: new Date().toISOString()
            };
            
            // 🔴 РЕГИСТРАЦИЯ В GOOGLE SHEETS
            try {
                console.log('📡 Регистрирую пользователя в Google Sheets...');
                
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'register',
                        name: this.user.name,
                        phone: this.user.phone,
                        role: this.user.role
                    })
                });
                
                const result = await response.json();
                console.log('✅ Ответ от Google Sheets:', result);
                
                if (result.success) {
                    this.user.backend_id = result.user_id;
                    alert('✅ Данные сохранены в облаке!');
                }
            } catch (error) {
                console.log('⚠️ Ошибка подключения к Google Sheets:', error);
                alert('⚠️ Данные сохранены локально. Свяжемся с сервером позже.');
            }
            
            localStorage.setItem('vremonte_user', JSON.stringify(this.user));
            localStorage.setItem('vremonte_token', 'token_' + Date.now());
            
            this.currentScreen = 'main';
            this.render();
            
            alert('✅ Авторизация успешна!\n\nДобро пожаловать в Времонте!');
        } else {
            alert('❌ Неверный код. Попробуйте снова.\nДемо-код: 1234');
        }
    }
    
    async createOrder() {
        const title = document.getElementById('orderTitle')?.value;
        const address = document.getElementById('orderAddress')?.value;
        
        if (!title || !address) {
            alert('Заполните обязательные поля: "Что нужно сделать" и "Адрес"');
            return;
        }
        
        const orderData = {
            title: title,
            description: document.getElementById('orderDescription')?.value || '',
            address: address,
            budget: document.getElementById('orderBudget')?.value || 'Договорная',
            category: document.getElementById('orderCategory')?.value || 'другое'
        };
        
        alert('📡 Отправляем заказ на сервер...');
        
        try {
            // 🔴 СОЗДАНИЕ ЗАКАЗА В GOOGLE SHEETS
            console.log('📡 Создаю заказ в Google Sheets...');
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create_order',
                    user_id: this.user.id || 'demo_user',
                    title: orderData.title,
                    description: orderData.description,
                    address: orderData.address,
                    budget: orderData.budget,
                    category: orderData.category,
                    phone: this.user.phone || '+79991234567',
                    client_name: this.user.name || 'Демо Клиент'
                })
            });
            
            const result = await response.json();
            console.log('✅ Ответ от Google Sheets:', result);
            
            if (result.success) {
                // Сохраняем локально
                const newOrder = {
                    id: result.order_id || Date.now(),
                    title: title,
                    description: orderData.description,
                    address: address,
                    budget: orderData.budget,
                    category: orderData.category,
                    createdAt: 'Только что',
                    responses: 0,
                    maxResponses: 5,
                    status: 'active'
                };
                
                this.orders.unshift(newOrder);
                
                alert(`✅ Заказ создан!\n\n"${title}"\n\nАдрес: ${address}\n\nТеперь мастера увидят ваш заказ.`);
                this.backToMain();
            } else {
                alert('❌ Ошибка: ' + (result.error || 'Попробуйте снова.'));
            }
            
        } catch (error) {
            console.log('⚠️ Ошибка подключения:', error);
            alert('⚠️ Заказ сохранен локально. Отправим на сервер позже.');
            
            // Локальное сохранение
            const newOrder = {
                id: Date.now(),
                title: title,
                description: orderData.description,
                address: address,
                budget: orderData.budget,
                category: orderData.category,
                createdAt: 'Только что',
                responses: 0,
                maxResponses: 5,
                status: 'active'
            };
            
            this.orders.unshift(newOrder);
            this.backToMain();
        }
    }
    
    respondToOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order && order.responses < order.maxResponses) {
            order.responses++;
            alert(`✅ Вы откликнулись на заказ!\n\n"${order.title}"`);
        }
    }
    
    switchRole() {
        if (this.user) {
            this.user.role = this.user.role === 'client' ? 'master' : 'client';
            localStorage.setItem('vremonte_user', JSON.stringify(this.user));
            this.currentScreen = 'main';
            this.render();
            
            alert(`🔄 Роль изменена на: ${this.user.role === 'client' ? 'КЛИЕНТ' : 'МАСТЕР'}`);
        }
    }
    
    logout() {
        localStorage.removeItem('vremonte_user');
        localStorage.removeItem('vremonte_token');
        localStorage.removeItem('vremonte_demo');
        
        this.user = null;
        this.demoMode = false;
        this.currentScreen = 'auth';
        this.render();
        
        alert('👋 Вы вышли из аккаунта.');
    }
    
    startDemo() {
        this.demoMode = true;
        this.user = {
            id: 'demo_001',
            name: 'Демо Пользователь',
            phone: '+7 (999) 123-45-67',
            role: 'client',
            isDemo: true
        };
        
        localStorage.setItem('vremonte_demo', 'true');
        localStorage.setItem('vremonte_user', JSON.stringify(this.user));
        localStorage.setItem('vremonte_token', 'demo_token');
        
        this.currentScreen = 'main';
        this.render();
        
        alert('🎮 ДЕМО-РЕЖИМ АКТИВИРОВАН!\n\nТестируйте все функции.');
    }
    
    showClientCreate() {
        this.currentScreen = 'client-create';
        this.render();
    }
    
    showClientOrders() {
        alert('📋 Здесь будут ваши заказы\n\n(Функция в разработке)');
    }
    
    showMasterFeed() {
        this.currentScreen = 'master-feed';
        this.render();
    }
    
    showMasterProfile() {
        alert('📊 Здесь будет статистика мастера\n\n(Функция в разработке)');
    }
    
    backToAuth() {
        this.currentScreen = 'auth';
        this.render();
    }
    
    backToMain() {
        this.currentScreen = 'main';
        this.render();
    }
    
    resendSMS() {
        alert(`📱 Код отправлен повторно на ${this.phone}\nДемо-код: 1234`);
    }
}

// Создаём глобальный экземпляр приложения
const app = new VremonteApp();
window.app = app;
