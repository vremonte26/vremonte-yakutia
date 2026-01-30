// ВРЕМОНТЕ | Упрощённая рабочая версия
class App {
    constructor() {
        this.user = null;
        this.init();
    }
    
    init() {
        console.log('🚀 Времонте запущен!');
        this.showMainScreen();
    }
    
    showMainScreen() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div class="logo">
                    <div class="logo-icon">🏔️</div>
                    <h1>Времонте</h1>
                    <p>Безопасные услуги в Якутии</p>
                </div>
                
                <div class="card">
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
                    <h3>Демо-режим</h3>
                    <p>🔒 Все мастера проверены</p>
                    <p>📍 Только ваш район (10 км)</p>
                    <p>⭐ Бесплатно для всех</p>
                    <p>📞 Прямой контакт после выбора</p>
                    
                    <button class="btn" onclick="app.demoLogin()" 
                            style="background: #4CAF50; color: white; margin-top: 15px;">
                        🔓 ДЕМО-ВХОД (тестовый режим)
                    </button>
                </div>
            </div>
        `;
    }
    
    showClientMode() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div style="text-align: left;">
                    <button class="btn" onclick="app.showMainScreen()" 
                            style="background: transparent; color: #1a2980; padding: 10px;">
                        ← Назад
                    </button>
                </div>
                
                <div class="logo">
                    <div class="logo-icon">🎯</div>
                    <h1>Режим клиента</h1>
                </div>
                
                <div class="card">
                    <h3>Создать заказ</h3>
                    
                    <div class="input-group">
                        <input type="text" placeholder="Что нужно сделать?" id="orderTitle">
                    </div>
                    
                    <div class="input-group">
                        <input type="text" placeholder="Ваш адрес (для мастера)" id="orderAddress">
                    </div>
                    
                    <button class="btn btn-primary" onclick="app.createOrder()">
                        📝 ОПУБЛИКОВАТЬ ЗАКАЗ
                    </button>
                </div>
                
                <div class="card">
                    <h3>Как это работает?</h3>
                    <p>1. Вы создаёте заказ</p>
                    <p>2. Мастера в радиусе 10 км видят его</p>
                    <p>3. Первые 5 откликнувшихся попадают к вам</p>
                    <p>4. Вы выбираете одного, видите его телефон</p>
                    <p>5. Договариваетесь и работа выполняется</p>
                </div>
            </div>
        `;
    }
    
    showMasterMode() {
        const orders = [
            { id: 1, title: 'Установить смеситель', distance: '0.8 км', time: '15 мин', responses: 0 },
            { id: 2, title: 'Покрасить стену', distance: '1.2 км', time: '2 часа', responses: 3 },
            { id: 3, title: 'Починить розетку', distance: '2.5 км', time: '1 час', responses: 5 }
        ];
        
        document.getElementById('app').innerHTML = `
            <div class="container">
                <div style="text-align: left;">
                    <button class="btn" onclick="app.showMainScreen()" 
                            style="background: transparent; color: #1a2980; padding: 10px;">
                        ← Назад
                    </button>
                </div>
                
                <div class="logo">
                    <div class="logo-icon">👷</div>
                    <h1>Режим мастера</h1>
                    <p>Лента заказов в радиусе 10 км</p>
                </div>
                
                ${orders.map(order => `
                    <div class="card" style="margin: 15px 0;">
                        <h4>${order.title}</h4>
                        <p>📍 ${order.distance} • ⏰ ${order.time}</p>
                        <p>👥 ${order.responses}/5 откликов</p>
                        
                        <button class="btn ${order.responses >= 5 ? 'btn-outline' : 'btn-primary'}" 
                                ${order.responses >= 5 ? 'disabled' : ''}
                                onclick="app.respondToOrder(${order.id})"
                                style="margin-top: 10px;">
                            ${order.responses >= 5 ? '⛔ НЕДОСТУПНО' : '✅ ОТКЛИКНУТЬСЯ'}
                        </button>
                    </div>
                `).join('')}
                
                <div class="card">
                    <h3>Правила для мастеров</h3>
                    <p>✅ Откликаться можно на 5 заказов одновременно</p>
                    <p>📍 Видны только заказы в радиусе 10 км</p>
                    <p>📞 Телефон клиента виден только после выбора</p>
                    <p>⭐ Рейтинг растёт после выполненных работ</p>
                </div>
            </div>
        `;
    }
    
    demoLogin() {
        alert('✅ Демо-вход выполнен!\n\nТеперь вы можете:\n🎯 Создавать заказы (режим клиента)\n👷 Откликаться на заказы (режим мастера)\n\nЭто тестовая версия. В рабочей будет:\n- Telegram-авторизация\n- Настоящие заказы\n- Геолокация\n- Уведомления');
        
        this.user = { name: 'Демо Пользователь', role: 'client' };
        this.showMainScreen();
    }
    
    createOrder() {
        const title = document.getElementById('orderTitle').value;
        const address = document.getElementById('orderAddress').value;
        
        if (!title || !address) {
            alert('Заполните все поля');
            return;
        }
        
        alert(`✅ Заказ создан!\n\n"${title}"\n\nАдрес: ${address}\n\nТеперь мастера в радиусе 10 км увидят ваш заказ. Первые 5 откликнувшихся появятся у вас в списке.`);
        
        this.showMainScreen();
    }
    
    respondToOrder(orderId) {
        alert(`✅ Вы откликнулись на заказ #${orderId}\n\nКлиент увидит вас в списке из 5 мастеров. Если он выберет вас — увидите его телефон и адрес.\n\nСтарайтесь откликаться быстро — только первые 5 мастеров попадают к клиенту!`);
    }
}

// Создаём глобальный экземпляр
const app = new App();
