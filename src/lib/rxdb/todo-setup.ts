import { createRxDatabase, addRxPlugin } from 'rxdb/plugins/core';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateAppwrite } from 'rxdb/plugins/replication-appwrite';
import type { RxAppwriteReplicationState } from 'rxdb/plugins/replication-appwrite';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import type { RxJsonSchema } from 'rxdb';
import { ID } from 'appwrite';
import client from '../appwrite';

// Add dev mode plugin for better error messages
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Todo interface
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Todo schema with proper RxJsonSchema type
const todoSchema: RxJsonSchema<Todo> = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    text: {
      type: 'string',
      maxLength: 500
    },
    completed: {
      type: 'boolean'
    }
  },
  required: ['id', 'text', 'completed']
};

// Database state
let dbPromise: any = null;
let dbStatus = 'initializing';
let syncStatus = 'offline';
let replicationState: RxAppwriteReplicationState<any> | null = null;

// Hardcoded values
const DATABASE_ID = '68505e9b003074668c0c';
const COLLECTION_ID = '688e69e4000349b85ec6';

export const getTodoDB = async () => {
  if (dbPromise) return dbPromise;

  dbStatus = 'creating';

  try {
    // Create the database with validation
    dbPromise = createRxDatabase({
      name: 'todo-test',
      storage: wrappedValidateAjvStorage({
        storage: getRxStorageDexie()
      }),
      multiInstance: true,
      ignoreDuplicate: true
    });

    const db = await dbPromise;

    // Add collections
    await db.addCollections({
      todos: {
        schema: todoSchema
      }
    });

    dbStatus = 'ready';
    console.log('🗄️ Todo RxDB initialized successfully');

    return db;
  } catch (error) {
    console.error('Database creation error:', error);
    dbStatus = 'error';
    throw error;
  }
};

// Start replication
export const startTodoReplication = async () => {
  try {
    if (replicationState) {
      console.log('🔄 Replication already started');
      return;
    }

    const db = await getTodoDB();
    syncStatus = 'connecting';

    // Start replication
    replicationState = replicateAppwrite({
      replicationIdentifier: 'todo-replication',
      client,
      databaseId: DATABASE_ID,
      collectionId: COLLECTION_ID,
      deletedField: 'deleted',
      collection: db.todos,
      pull: {
        batchSize: 25
      },
      push: {
        batchSize: 25
      }
    });

    // Handle replication events
    replicationState.error$.subscribe((error) => {
      console.error('Replication error:', error);
      syncStatus = 'error';
    });

    replicationState.active$.subscribe((active) => {
      console.log(`🔄 Replication ${active ? 'active' : 'inactive'}`);
      syncStatus = active ? 'syncing' : 'online';
    });

    syncStatus = 'online';
    console.log('✅ Todo replication started');
  } catch (error) {
    console.error('Replication setup error:', error);
    syncStatus = 'error';
    throw error;
  }
};

// Stop replication
export const stopTodoReplication = async () => {
  try {
    if (replicationState) {
      await replicationState.cancel();
      replicationState = null;
      console.log('🛑 Todo replication stopped');
    }
    syncStatus = 'offline';
  } catch (error) {
    console.error('Stop replication error:', error);
    throw error;
  }
};

// Manual sync
export const triggerTodoSync = async () => {
  if (!replicationState) {
    throw new Error('Replication not initialized');
  }

  try {
    syncStatus = 'syncing';
    await replicationState.reSync();
    syncStatus = 'online';
    console.log('✅ Manual sync completed');
  } catch (error) {
    console.error('Manual sync error:', error);
    syncStatus = 'error';
    throw error;
  }
};

// Get sync status
export const getTodoSyncStatus = () => ({
  dbStatus,
  syncStatus,
  hasReplication: !!replicationState
});

// Wait for DB
export const waitForTodoDB = async (timeout = 10000): Promise<void> => {
  const start = Date.now();
  while (dbStatus !== 'ready' && Date.now() - start < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (dbStatus !== 'ready') {
    throw new Error('Database initialization timeout');
  }
};

// Clear/destroy database
export const clearTodoDB = async () => {
  try {
    if (replicationState) {
      await stopTodoReplication();
    }
    
    if (dbPromise) {
      const db = await dbPromise;
      await db.destroy();
      dbPromise = null;
    }
    
    dbStatus = 'initializing';
    syncStatus = 'offline';
    console.log('✅ Todo database cleared');
  } catch (error) {
    console.error('Clear database error:', error);
    throw error;
  }
};

// CRUD operations
export const getTodos = async (): Promise<Todo[]> => {
  const db = await getTodoDB();
  return db.todos.find().exec();
};

export const getTodo = async (id: string): Promise<Todo | null> => {
  const db = await getTodoDB();
  return db.todos.findOne({ selector: { id } }).exec();
};

export const createTodo = async (todoData: Omit<Todo, 'id'>): Promise<Todo> => {
  const db = await getTodoDB();
  return db.todos.insert({
    id: ID.unique(),
    ...todoData
  });
};

export const updateTodo = async (id: string, todoData: Partial<Todo>): Promise<Todo> => {
  const todo = await getTodo(id);
  if (!todo) throw new Error('Todo not found');
  
  return todo.update({
    $set: todoData
  });
};

export const deleteTodo = async (id: string): Promise<void> => {
  const todo = await getTodo(id);
  if (!todo) throw new Error('Todo not found');
  
  return todo.remove();
};

export const toggleTodoCompleted = async (id: string): Promise<Todo> => {
  const todo = await getTodo(id);
  if (!todo) throw new Error('Todo not found');
  
  return todo.update({
    $set: {
      completed: !todo.completed
    }
  });
};