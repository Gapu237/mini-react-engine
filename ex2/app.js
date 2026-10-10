
import {
  createElement as h,
  useState,
  renderApp
} from "./reactive-engine.js";

function TaskApp() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review PR", completed: false },
    { id: 2, title: "Verify AST", completed: false }
  ]);

  const [filter, setFilter] = useState("ALL");

  const visibleTasks = tasks.filter((task) => {
    if (filter === "ACTIVE") return !task.completed;
    if (filter === "COMPLETED") return task.completed;
    return true;
  });

  function addTask() {
    const task = {
      id: Date.now(),
      title: `Task ${tasks.length + 1}`,
      completed: false
    };

    setTasks((previous) => [...previous, task]);
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function removeTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  return h(
    "main",
    { className: "app-container" },

    h("header", null,
      h("h1", null, "Reactive Task Manager"),
      h("p", null, `Tasks: ${tasks.length}`)
    ),

    h("button", { onClick: addTask }, "Add Task"),

    h("section", { "aria-label": "Task filters" },
      ...["ALL", "ACTIVE", "COMPLETED"].map((option) =>
        h("button", {
          onClick: () => setFilter(option),
          "aria-pressed": String(filter === option)
        }, option)
      )
    ),

    h("section", { "aria-label": "Task list" },
      h("h2", null, "Your Tasks"),

      ...visibleTasks.map((task) =>
        h("article", { key: task.id },
          h("span", null,
            task.completed ? "✓ " : "",
            task.title
          ),

          h("button", {
            onClick: () => toggleTask(task.id)
          }, task.completed ? "Undo" : "Complete"),

          h("button", {
            onClick: () => removeTask(task.id)
          }, "Delete")
        )
      ),

      visibleTasks.length === 0
        ? h("p", null, "No tasks in this filter.")
        : null
    )
  );
}

renderApp(
  TaskApp,
  document.getElementById("app")
);
