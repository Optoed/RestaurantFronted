#!/bin/bash

# Создаем корневую папку src, если она не существует
mkdir -p src

# Создаем поддиректории
mkdir -p src/assets
mkdir -p src/components
mkdir -p src/ui
mkdir -p src/features/auth
mkdir -p src/features/settings
mkdir -p src/pages
mkdir -p src/utils

# Создаем файлы страниц
touch src/pages/Welcome.tsx
touch src/pages/Login.tsx
touch src/pages/Register.tsx
touch src/pages/Dashboard.tsx
touch src/pages/Profile.tsx
touch src/pages/Orders.tsx

# Создаем файлы для Redux слайсов
touch src/features/auth/authSlice.ts
touch src/features/settings/settingsSlice.ts

# Создаем утилитарные файлы
touch src/utils/helpers.ts

# Создаем UI элементы (заготовки для кнопок и инпутов)
touch src/ui/Button.tsx
touch src/ui/Input.tsx

# Создаем файл для компонентов
touch src/components/Navbar.tsx
touch src/components/Footer.tsx

# Создаем основные файлы приложения
touch src/App.tsx
touch src/index.tsx
touch src/api.ts

# Сообщение об успешном завершении
echo "Папки и файлы успешно созданы!"
