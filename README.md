# Стартер на TypeScript для проекта Stellar Burger

Учебный проект «Космическая бургерная» (проектная работа 2-го спринта): конструктор бургера на React с состоянием в Redux Toolkit, загрузкой данных через RTK Query и перетаскиванием ингредиентов на react-dnd.

## Запуск проекта

1. Установите зависимости: `npm install`
2. Запустите dev-сервер: `npm run dev`
3. Сборка для production: `npm run build`

## Структура проекта

- `src/components` — компоненты приложения: App, AppHeader, BurgerIngredients, IngredientCard, BurgerConstructor, ConstructorIngredient, Modal, ModalOverlay, OrderDetails, IngredientDetails
- `src/services` — Redux-хранилище:
  - `api.ts` — описание эндпоинтов RTK Query (`getIngredients`, `createOrder`),
  - `store.ts` / `root-reducer.ts` — стор и корневой редьюсер, к стору подключён усилитель `api.middleware`,
  - `hooks.ts` — типизированные `useAppDispatch` и `useAppSelector`,
  - `burger-constructor/` — слайс состава бургера (`bun` + `ingredients` с уникальными `uid` от `nanoid`) и мемоизированные селекторы стоимости и счётчиков,
  - `ingredient-details/` — слайс просматриваемого в модальном окне ингредиента,
  - `order/` — слайс номера заказа, наполняется матчерами мутации `createOrder`
- `src/utils` — типы данных и константы (базовый URL API, типы drag-and-drop)
- `src/index.css` — общие стили проекта

Данные приходят с `https://new-stellarburgers.education-services.ru/api`.

## Процедура создания коммита с проверками

При создании коммита автоматически запускаются проверка линтерами `stylelint`, `eslint` и форматирование `prettier`.

Если линтер обнаружит ошибки:

- Коммит создан не будет
- Необходимо исправить все выявленные проблемы
- Добавить исправленные файлы в индекс: `git add .`
- Повторить коммит

**Рекомендация:**  
Для предотвращения ошибок на этапе коммита предварительно выполните:  
`npm run lint`. Это позволит выявить и исправить проблемы до создания коммита.

Есть также команды для запуска проверок по отдельности:

- `npm run eslint` - запускает проверку линтера и исправляет проблемы, которые можно исправить автоматически,
- `npm run stylelint` - запускает проверку литера для файлов стилей и исправляет проблемы, которые можно исправить автоматически,
- `npm run prettier` - исправляет ошибки форматирования кода.

Можно добавить автозапуск этих команд при сохранении файла в вашей IDE.

Для создания коммита рекомендуется запускать команду `npm run commit`. Она позволяет обеспечить соответствие описаний коммитов [общепринятым соглашениям](https://www.conventionalcommits.org/en/v1.0.0/).

В проекте настроены алиасы, которые можно использовать при импорте модулей:

```
	alias: {
		'@': path.resolve(__dirname, './src'),
		'@components': path.resolve(__dirname, './src/components'),
		'@services': path.resolve(__dirname, './src/services'),
		'@pages': path.resolve(__dirname, './src/pages'),
		'@utils': path.resolve(__dirname, './src/utils'),
	},
```
