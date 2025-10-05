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

5. Добавляем комиты 
Пример: fix(dao): handle null pointer in update method
Все команды
feat	новая функциональность
fix	исправление ошибки
docs	изменение документации
refactor	улучшение кода без изменения логики
style	форматирование (отступы, пробелы, и т.д.)
test	добавление или обновление тестов
chore	мелкие задачи, не влияющие на код (например, .gitignore)

5.Когда проект готов к тестированию перед релизом:
git checkout develop
git checkout -b release/v1.0.0
После тестирования:
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
git checkout develop
git merge main

6.Если найден критический баг в продакшене:
git checkout main
git checkout -b hotfix/fix-db-connection
После исправления:
git commit -m "fix(database): resolve connection timeout issue"
git checkout main
git merge hotfix/fix-db-connection
git tag v1.0.1
git checkout develop
git merge main
