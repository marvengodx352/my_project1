import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["title", "checkbox"]

  // Toggle task via AJAX
  toggle(event) {
    event.preventDefault()
    const taskId = this.element.dataset.taskId
    const csrfToken = document.querySelector('[name="csrf-token"]').content

    fetch(`/tasks/${taskId}/toggle`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Accept": "application/json"
      }
    }).then(response => {
      if (response.ok) {
        this.element.classList.toggle("done")
        const btn = event.target.closest("button")
        if (btn) {
          const isDone = this.element.classList.contains("done")
          btn.innerHTML = isDone ? "↩️" : "✅"
          btn.title = isDone ? "Отменить" : "Завершить"
        }
      }
    }).catch(error => {
      console.error("Toggle error:", error)
    })
  }

  // Delete task with animation
  destroy(event) {
    event.preventDefault()
    const taskId = this.element.dataset.taskId
    const csrfToken = document.querySelector('[name="csrf-token"]').content

    if (!confirm("Удалить задачу?")) return

    this.element.classList.add("removing")

    fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Accept": "application/json"
      }
    }).then(response => {
      if (response.ok) {
        setTimeout(() => {
          this.element.remove()
          // Show empty state if no tasks left
          if (document.querySelectorAll(".task").length === 0) {
            window.location.reload()
          }
        }, 250)
      } else {
        this.element.classList.remove("removing")
        alert("Ошибка при удалении задачи")
      }
    }).catch(error => {
      this.element.classList.remove("removing")
      console.error("Delete error:", error)
    })
  }
}
