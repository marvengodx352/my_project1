"# Скрипт для создания вьюх
views_dir = 'app/views/tasks'

# index.html.erb
File.write(\"#{views_dir}/index.html.erb\", <<~ERB)
<h1>📋 Мои задачи</h1>

<%= link_to '+ Новая задача', new_task_path, class: 'btn' %>

<div class=\"tasks\">
  <% if @tasks.any? %>
    <% @tasks.each do |task| %>
      <div class=\"task <%= task.completed? ? 'done' : '' %>\">
        <span><%= task.title %></span>
        <span><%= task.completed? ? '✅' : '⬜' %></span>
        <span><%= link_to '👁️', task %></span>
        <span><%= link_to '✏️', edit_task_path(task) %></span>
        <span><%= button_to '🔄', toggle_task_path(task), method: :post %></span>
        <span><%= button_to '🗑️', task, method: :delete, data: { confirm: 'Удалить?' } %></span>
      </div>
    <% end %>
  <% else %>
    <p>Пока нет задач. <%= link_to 'Создать первую!', new_task_path %></p>
  <% end %>
</div>
ERB

puts 'index created'"