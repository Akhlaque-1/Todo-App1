import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "todos.json");

const readTodos = () =>
  fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

const writeTodos = (todos) =>
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));

export async function GET() {
  return Response.json(readTodos());
}

export async function POST(req) {
  const todos = readTodos();
  const { text } = await req.json();
  todos.push({ id: Date.now(), text });
  writeTodos(todos);
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const todos = readTodos();
  const { id } = await req.json();
  writeTodos(todos.filter((t) => t.id !== id));
  return Response.json({ success: true });
}

export async function PUT(req) {
  const todos = readTodos();
  const { id, text } = await req.json();
  const updated = todos.map((t) =>
    t.id === id ? { ...t, text } : t
  );
  writeTodos(updated);
  return Response.json({ success: true });
}
