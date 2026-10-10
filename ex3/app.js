import {
  STATUS,
  createInitialState,
  fetchFeed
} from "./state-machine.js";

const app = document.getElementById("app");

let state = createInitialState();
let requestId = 0;

function setState(nextState) {
  state = nextState;
  render();
}

async function loadData() {
  if (state.status === STATUS.LOADING) return;

  const currentRequest = ++requestId;

  setState({ status: STATUS.LOADING });

  try {
    const items = await fetchFeed();

    // Chống race condition: bỏ qua nếu request này đã cũ
    if (currentRequest !== requestId) return;

    setState({
      status: STATUS.SUCCESS,
      data: items
    });
  } catch (error) {
    if (currentRequest !== requestId) return;

    setState({
      status: STATUS.ERROR,
      error: "Không thể tải danh sách task. Vui lòng thử lại."
    });

    console.error("Feed loading failed:", error);
  }
}

function renderSkeleton() {
  return `
    <section aria-label="Loading tasks" aria-busy="true">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-row"></div>
      <div class="skeleton skeleton-row"></div>
      <div class="skeleton skeleton-row"></div>
    </section>
  `;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function render() {
  if (state.status === STATUS.IDLE) {
    app.innerHTML = `
      <section>
        <h1>Task Feed</h1>
        <p>Bấm nút bên dưới để tải danh sách công việc.</p>
        <button id="load-btn">Load Tasks</button>
      </section>
    `;
    return;
  }

  if (state.status === STATUS.LOADING) {
    app.innerHTML = `
      <section>
        <h1>Task Feed</h1>
        ${renderSkeleton()}
      </section>
    `;
    return;
  }

  if (state.status === STATUS.SUCCESS) {
    const list = state.data
      .map(
        (item) => `
        <li>
          <span>${escapeHTML(item.title)}</span>
        </li>
      `
      )
      .join("");

    app.innerHTML = `
      <section>
        <h1>Task Feed</h1>
        <p>Đã tải thành công ${state.data.length} công việc.</p>
        <ul>${list}</ul>
        <button id="reload-btn">Reload Tasks</button>
      </section>
    `;
    return;
  }

  if (state.status === STATUS.ERROR) {
    app.innerHTML = `
      <section role="alert">
        <h1>Có lỗi xảy ra</h1>
        <p>${escapeHTML(state.error)}</p>
        <button id="retry-btn">Retry Connection</button>
      </section>
    `;
  }
}

// Root delegation: Một listener duy nhất gắn trên #app
app.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !app.contains(button)) return;

  if (
    button.id === "load-btn" ||
    button.id === "reload-btn" ||
    button.id === "retry-btn"
  ) {
    loadData();
  }
});

render();