# Проект с gulp

**Использовать NodeJS 14 версии**

<table>
  <thead>
    <tr>
      <th>Команда</th>
      <th>Результат</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td width="22%"><code>npm i</code></td>
      <td>Установить зависимости</td>
    </tr>
    <tr>
      <td><code>npm start</code></td>
      <td>Запустить сборку, сервер и слежение за файлами</td>
    </tr>
    <tr>
      <td><code>npm start ЗАДАЧА</code></td>
      <td>Запустить задачу с названием ЗАДАЧА (список задач в <code>./gulpfile.js</code>)</td>
    </tr>
    <tr>
      <td><code>folder=src/img npm start img:opt</code></td>
      <td>Оптимизация изображений из папки <code>./src/img</code> (или любой другой)</td>
    </tr>
    <tr>
      <td><code>npm run build</code></td>
      <td>Сборка проекта без карт кода (сжатый вид, как результат работы)</td>
    </tr>
    <tr>
      <td><code>npm run deploy</code></td>
      <td>Сборка проекта без карт кода и отправка содержимого папки сборки на github-pages</td>
    </tr>
    <tr>
      <td><code>npm run test:style</code></td>
      <td>Проверка стилевой составляющей проекта <a href="https://stylelint.io/">stylelint</a></td>
    </tr>
  </tbody>
</table>

Предполагается, что все команды вы выполняете в bash (для OSX и Linux это самый обычный встроенный терминал, для Windows это, к примеру, Git Bash). В Windows установку пакетов (`npm i`) нужно выполять в терминале, запущенном от имени администратора.
