"use client";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  text: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Load todos from API
  const loadTodos = async () => {
    const res = await fetch("/api/todos");
    const data: Todo[] = await res.json();
    setTodos(data);
  };

  // Add new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    loadTodos();
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadTodos();
  };

  // Save edited todo
  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: editText }),
    });
    setEditingId(null);
    setEditText("");
    loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todo-container">
      <h1>📝 Todo App</h1>

      <div className="todo-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you need to do?"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {editingId === todo.id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>✔</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <div className="actions">
                  <button
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditText(todo.text);
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>🗑</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
