import { useState, useEffect } from 'react';
import { Button, Input } from '@heroui/react';
import {
  getTodoDB,
  startTodoReplication,
  stopTodoReplication,
  triggerTodoSync,
  getTodoSyncStatus,
  waitForTodoDB,
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleTodoCompleted,
  type Todo,
} from '@/lib/rxdb/todo-setup';
import { useAuthStore } from '@/stores/useAuthStore';

export default function RxDBTest() {
  const [status, setStatus] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const { user, isAuthenticated } = useAuthStore();

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs((prev) => [...prev.slice(-9), logEntry]);
    console.log(logEntry);
  };

  useEffect(() => {
    const checkStatus = () => {
      const syncStatus = getTodoSyncStatus();
      setStatus(
        `DB: ${syncStatus.dbStatus} | Sync: ${syncStatus.syncStatus} | Replication: ${
          syncStatus.hasReplication ? 'Active' : 'Inactive'
        }`
      );
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const testInitDB = async () => {
    setLoading(true);
    try {
      log('🔄 Initializing Todo RxDB...');
      await getTodoDB();
      log('✅ Todo RxDB initialized successfully');
    } catch (error) {
      log(`❌ Todo RxDB init failed: ${error}`);
    }
    setLoading(false);
  };

  const testGetTodos = async () => {
    try {
      log('🔄 Getting todos...');
      const todoList = await getTodos();
      setTodos(todoList);
      log(`✅ Found ${todoList.length} todos`);
    } catch (error) {
      log(`❌ Get todos failed: ${error}`);
    }
  };

  const testCreateTodo = async () => {
    if (!newTodoText.trim()) {
      log('❌ Please enter todo text');
      return;
    }
    
    try {
      log('🔄 Creating new todo...');
      const newTodo = await createTodo({
        text: newTodoText.trim(),
        completed: false,
      });
      log(`✅ Created todo: ${newTodo.text}`);
      setNewTodoText('');
      await testGetTodos();
    } catch (error) {
      log(`❌ Create todo failed: ${error}`);
    }
  };

  const testToggleTodo = async (id: string) => {
    try {
      log(`🔄 Toggling todo: ${id}`);
      const updatedTodo = await toggleTodoCompleted(id);
      log(`✅ Todo toggled: ${updatedTodo.completed ? 'Completed' : 'Incomplete'}`);
      await testGetTodos();
    } catch (error) {
      log(`❌ Toggle todo failed: ${error}`);
    }
  };

  const testDeleteTodo = async (id: string) => {
    try {
      log(`🔄 Deleting todo: ${id}`);
      await deleteTodo(id);
      log('✅ Todo deleted');
      await testGetTodos();
    } catch (error) {
      log(`❌ Delete todo failed: ${error}`);
    }
  };

  const testStartReplication = async () => {
    try {
      log('🔄 Starting todo replication...');
      await startTodoReplication();
      log('✅ Todo replication started');
    } catch (error) {
      log(`❌ Start replication failed: ${error}`);
    }
  };

  const testStopReplication = async () => {
    try {
      log('🔄 Stopping todo replication...');
      await stopTodoReplication();
      log('✅ Todo replication stopped');
    } catch (error) {
      log(`❌ Stop replication failed: ${error}`);
    }
  };

  const testTriggerSync = async () => {
    try {
      log('🔄 Triggering manual sync...');
      await triggerTodoSync();
      log('✅ Manual sync triggered');
    } catch (error) {
      log(`❌ Manual sync failed: ${error}`);
    }
  };

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <h1 className='text-Grey-100 mb-6 text-3xl font-bold'>Todo RxDB Test Page</h1>

      {/* Status */}
      <div className='bg-blur mb-6 rounded-lg border border-white/10 p-4 backdrop-blur-xl'>
        <h2 className='text-Grey-100 mb-2 text-xl font-semibold'>Status</h2>
        <p className='text-Grey-300 font-mono text-sm'>{status}</p>
        <p className='text-Grey-400 mt-2 text-sm'>
          Auth: {isAuthenticated ? `✅ ${user?.email}` : '❌ Not authenticated'}
        </p>
      </div>

      {/* Add New Todo */}
      <div className='bg-blur mb-6 rounded-lg border border-white/10 p-4 backdrop-blur-xl'>
        <h2 className='text-Grey-100 mb-2 text-xl font-semibold'>Add New Todo</h2>
        <div className='flex gap-2'>
          <Input
            placeholder='Enter todo text...'
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && testCreateTodo()}
            className='flex-1'
          />
          <Button color='primary' onPress={testCreateTodo} isDisabled={!newTodoText.trim()}>
            Add Todo
          </Button>
        </div>
      </div>

      {/* Test Buttons */}
      <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
        <Button color='primary' onPress={testInitDB} isLoading={loading}>
          Init DB
        </Button>
        <Button color='secondary' onPress={testGetTodos}>
          Get Todos ({todos.length})
        </Button>
        <Button color='success' onPress={testStartReplication}>
          Start Sync
        </Button>
        <Button color='warning' onPress={testStopReplication}>
          Stop Sync
        </Button>
        <Button color='default' onPress={testTriggerSync}>
          Manual Sync
        </Button>
      </div>

      {/* Todos */}
      {todos.length > 0 && (
        <div className='bg-blur mb-6 rounded-lg border border-white/10 p-4 backdrop-blur-xl'>
          <h2 className='text-Grey-100 mb-2 text-xl font-semibold'>Todos ({todos.length})</h2>
          <div className='space-y-2'>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className='bg-Grey-800/50 flex items-center justify-between rounded p-3'
              >
                <div className='flex items-center gap-3'>
                  <Button
                    size='sm'
                    color={todo.completed ? 'success' : 'default'}
                    variant={todo.completed ? 'solid' : 'bordered'}
                    onPress={() => testToggleTodo(todo.id)}
                  >
                    {todo.completed ? '✓' : '○'}
                  </Button>
                  <span
                    className={`${
                      todo.completed
                        ? 'text-Grey-400 line-through'
                        : 'text-Grey-200'
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <Button
                  size='sm'
                  color='danger'
                  variant='light'
                  onPress={() => testDeleteTodo(todo.id)}
                >
                  🗑️
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      <div className='bg-blur rounded-lg border border-white/10 p-4 backdrop-blur-xl'>
        <h2 className='text-Grey-100 mb-2 text-xl font-semibold'>Logs</h2>
        <div className='h-64 space-y-1 overflow-y-auto'>
          {logs.map((log, index) => (
            <div key={index} className='text-Grey-300 font-mono text-xs'>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
