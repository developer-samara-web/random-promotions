.PHONY: menu build up down restart-bot restart-web restart-all logs-bot logs-web db-shell db-backup db-restore

BOT_CONTAINER=telegram-bot
WEB_CONTAINER=webapp
DB_CONTAINER=database
DC=docker compose

# Сборка всех контейнеров
build:
	$(DC) build

# Запуск всех контейнеров
up:
	$(DC) up -d

# Остановка всех контейнеров
down:
	$(DC) down

# Полный перезапуск с пересборкой
restart-all:
	$(DC) down
	$(DC) up -d --build

# Перезапуск только бота
restart-bot:
	$(DC) restart $(BOT_CONTAINER)

# Перезапуск только webapp
restart-web:
	$(DC) restart $(WEB_CONTAINER)

# Просмотр логов бота
logs-bot:
	$(DC) logs -f $(BOT_CONTAINER)

# Просмотр логов webapp
logs-web:
	$(DC) logs -f $(WEB_CONTAINER)

# Открыть shell MongoDB
db-shell:
	$(DC) exec -it $(DB_CONTAINER) mongosh

# Бэкап базы
db-backup:
	$(DC) exec -it $(DB_CONTAINER) sh -c "mongodump --archive=/data/db/backup.gz --gzip"

# Восстановление базы из бэкапа
db-restore:
	$(DC) exec -it $(DB_CONTAINER) sh -c "mongorestore --archive=/data/db/backup.gz --gzip --drop"

# Интерактивное меню
menu:
	@echo "Выберите команду:"
	@echo "[1] build - Сборка всех образов"
	@echo "[2] up - Запуск всех контейнеров"
	@echo "[3] down - Остановка всех контейнеров"
	@echo "[4] restart-all - Полный перезапуск с пересборкой"
	@echo "[5] restart-bot - Перезапуск Telegram-бота"
	@echo "[6] restart-web - Перезапуск webapp"
	@echo "[7] logs-bot - Логи бота"
	@echo "[8] logs-web - Логи веб-приложения"
	@echo "[9] db-shell - Открыть shell MongoDB"
	@echo "[10] db-backup - Сделать бэкап базы"
	@echo "[11] db-restore - Восстановить базу из бэкапа"
	@read -p "Введите номер команды: " choice; \
	case $$choice in \
		1) $(MAKE) build ;; \
		2) $(MAKE) up ;; \
		3) $(MAKE) down ;; \
		4) $(MAKE) restart-all ;; \
		5) $(MAKE) restart-bot ;; \
		6) $(MAKE) restart-web ;; \
		7) $(MAKE) logs-bot ;; \
		8) $(MAKE) logs-web ;; \
		9) $(MAKE) db-shell ;; \
		10) $(MAKE) db-backup ;; \
		11) $(MAKE) db-restore ;; \
		*) echo "Неверный выбор" ;; \
	esac