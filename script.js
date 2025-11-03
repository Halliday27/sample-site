// script.js — all client side functionality

// ---------- Utilities ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ---------- Theme (dark/light) ----------
const THEME_KEY = 'sampleSiteTheme';
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme){
  if(theme === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
}

// read persisted theme, default to system preference
let currentTheme = localStorage.getItem(THEME_KEY);
if(!currentTheme){
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  currentTheme = prefersDark ? 'dark' : 'light';
}
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();
// ---------- Todo app ----------
const TODO_KEY = 'sampleSiteTodos';
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function loadTodos(){
  const raw = localStorage.getItem(TODO_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}
function saveTodos(todos){
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}
function renderTodos(){
  const todos = loadTodos();
  todoList.innerHTML = '';
  if(todos.length === 0){
    const li = document.createElement('li');
    li.textContent = 'No tasks yet — add one!';
    li.className = 'muted';
    todoList.appendChild(li);
    return;
  }
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    const left = document.createElement('span');
    left.textContent = t.text;
    left.style.flex = '1';
    left.style.marginRight = '8px';
    if(t.done){
      left.style.textDecoration = 'line-through';
      left.style.opacity = '0.8';
    }
    const btns = document.createElement('div');

    const toggle = document.createElement('button');
    toggle.textContent = t.done ? '↺' : '✓';
    toggle.title = 'Toggle done';
    toggle.addEventListener('click', () => {
      const todos = loadTodos();
      todos[i].done = !todos[i].done;
      saveTodos(todos);
      renderTodos();
    });

    const remove = document.createElement('button');
    remove.textContent = '✕';
    remove.title = 'Remove';
    remove.addEventListener('click', () => {
      const todos = loadTodos();
      todos.splice(i, 1);
      saveTodos(todos);
      renderTodos();
    });

    btns.appendChild(toggle);
    btns.appendChild(remove);

    li.appendChild(left);
    li.appendChild(btns);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if(!text) return;
  const todos = loadTodos();
  todos.push({ text, done: false });
  saveTodos(todos);
  todoInput.value = '';
  renderTodos();
});
renderTodos();

// ---------- Fetch demo (public API) ----------
const jokeBtn = document.getElementById('fetch-joke');
const jokeOutput = document.getElementById('joke-output');

async function fetchJoke(){
  jokeOutput.textContent = 'Loading...';
  try {
    // public API: official-joke-api.appspot.com has CORS, but if it fails, handle gracefully
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    if(!res.ok) throw new Error('Network response not OK');
    const json = await res.json();
    jokeOutput.textContent = json.setup + ' — ' + json.punchline;
  } catch(err){
    console.warn('Fetch joke failed:', err);
    jokeOutput.textContent = 'Could not load joke. Try again or check your network.';
  }
}
jokeBtn.addEventListener('click', fetchJoke);

// === Copy to clipboard logic ===
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.getAttribute('data-copy');
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = '✅';
      setTimeout(() => btn.textContent = original, 1200);
    });
  });
});
 
