const priorities = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const priorityIcons = {
  high: "bi-exclamation-circle-fill",
  medium: "bi-dash-circle-fill",
  low: "bi-arrow-down-circle-fill",
};

const priorityLabels = {
  high: "Prioritet i Lartë",
  medium: "Prioritet i Mesëm",
  low: "Prioritet i Ulët",
};

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const container = $("#taskList");
  container.empty();

  if (tasks.length === 0) {
    container.html(`
        <div class="empty-tasks">
          <i class="bi bi-clipboard"></i>
          <p>Nuk ka detyra. Shtoni një detyrë të re!</p>
        </div>
      `);
    return;
  }

  tasks.forEach((task, i) => {
    const createdDate = task.created ? new Date(task.created) : new Date();
    const formattedDate = createdDate.toLocaleDateString("sq-AL", {
      day: "numeric",
      month: "short",
    });

    const taskElement = $(`
        <div class="task-card ${priorities[task.priority]}" data-index="${i}">
          <div class="task-header">
            <h4 class="task-title">${task.title}</h4>
            <span class="task-badge">
              <i class="bi ${priorityIcons[task.priority]} priority-icon"></i>
              ${priorityLabels[task.priority]}
            </span>
          </div>
          
          <div class="task-date">
            <small><i class="bi bi-calendar3"></i> ${formattedDate}</small>
          </div>
          
          <div class="task-actions">
            <button class="btn-action btn-edit edit-btn">
              <i class="bi bi-pencil"></i> Ndrysho
            </button>
            <button class="btn-action btn-delete delete-btn">
              <i class="bi bi-trash"></i> Fshi
            </button>
          </div>
        </div>
      `);

    container.append(taskElement);
  });

  $(".task-card").each(function (index) {
    $(this).css("animation-delay", `${index * 0.1}s`);
  });
}

$("#taskForm").on("submit", function (e) {
  e.preventDefault();
  const title = $("#taskTitle").val().trim();
  const priority = $("#taskPriority").val();
  const index = $("#editIndex").val();

  if (index === "") {
    tasks.push({
      title,
      priority,
      created: new Date().toISOString(),
    });
  } else {
    tasks[index].title = title;
    tasks[index].priority = priority;
    $("#submitBtn").html('<i class="bi bi-plus-circle"></i> Shto Detyrë');
    $("#editIndex").val("");
  }

  saveTasks();
  $("#taskForm")[0].reset();
  renderTasks();
});

function showNotification(message, type) {
  $(".notification").remove();

  const icon =
    type === "success"
      ? "bi-check-circle"
      : type === "warning"
      ? "bi-exclamation-circle"
      : "bi-x-circle";

  const notification = $(`
      <div class="notification ${type}">
        <i class="bi ${icon}"></i>
        ${message}
      </div>
    `);

  $("body").append(notification);

  setTimeout(() => {
    notification.fadeOut("slow", function () {
      $(this).remove();
    });
  }, 3000);
}

$(document).on("click", ".delete-btn", function () {
  const taskCard = $(this).closest(".task-card");
  const index = taskCard.data("index");

  taskCard.css({
    opacity: "0",
    transform: "translateX(30px)",
  });

  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 300);
});

$(document).on("click", ".edit-btn", function () {
  const index = $(this).closest(".task-card").data("index");
  const task = tasks[index];

  $("#taskTitle").val(task.title);
  $("#taskPriority").val(task.priority);
  $("#editIndex").val(index);
  $("#submitBtn").html('<i class="bi bi-check-circle"></i> Ruaj Ndryshimet');

  if (window.innerWidth < 992) {
    $("html, body").animate(
      {
        scrollTop: $("#taskForm").offset().top - 20,
      },
      300
    );
  }
});

$(document).ready(function () {
  renderTasks();
});
