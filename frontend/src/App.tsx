import { FormEvent, useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Loading tasks...');

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
      setStatus('Tasks loaded successfully.');
    } catch (error) {
      setStatus('Unable to load tasks right now.');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      setTitle('');
      setDescription('');
      loadTasks();
    }
  };

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Capstone MVP</p>
        <h1>Project Task Board</h1>
        <p>Track your work, add new tasks, and keep momentum going.</p>
      </header>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title"
          required
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Short description"
        />
        <button type="submit">Add task</button>
      </form>

      <section className="task-section">
        <div className="section-heading">
          <h2>Current tasks</h2>
          <span>{status}</span>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'done' : ''}`}>
              <div>
                <h3>{task.title}</h3>
                {task.description ? <p>{task.description}</p> : null}
              </div>
              <span>{task.completed ? 'Completed' : 'In progress'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
