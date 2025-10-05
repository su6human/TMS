# TMS
1. git checkout -b develop
git push -u origin develop
создаем main
2. добавляем DAO
git checkout develop
git checkout -b feature/add-employee-dao
3. после завершения работы делаем пуш
git add .
git commit -m "feat(employee): add DAO class for managing employees"
git push origin feature/add-employee-dao
4. Добавляем комиты 
Пример: fix(dao): handle null pointer in update method
Все команды
feat	новая функциональность
fix	исправление ошибки
docs	изменение документации
refactor	улучшение кода без изменения логики
style	форматирование (отступы, пробелы, и т.д.)
test	добавление или обновление тестов
chore	мелкие задачи, не влияющие на код (например, .gitignore)
