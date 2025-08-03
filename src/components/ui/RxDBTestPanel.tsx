import { useState } from 'react';
import { Button } from '@heroui/react';
import { getLibraries, createLibrary } from '@/lib/rxdb/db/library';
import { triggerSync, getSyncStatus } from '@/lib/rxdb';
import type { Library } from '@/lib/rxdb/schema';

export const RxDBTestPanel = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGetLibraries = async () => {
    setLoading(true);
    try {
      const result = await getLibraries();
      setLibraries(result);
      addLog(`✅ Found ${result.length} libraries`);
    } catch (error) {
      addLog(`❌ Error getting libraries: ${error}`);
    }
    setLoading(false);
  };

  const testCreateLibrary = async () => {
    setLoading(true);
    try {
      const newLibrary = await createLibrary({
        averageRating: Math.random() * 10,
      });
      addLog(`✅ Created library: ${newLibrary.id}`);
      await testGetLibraries(); // Refresh list
    } catch (error) {
      addLog(`❌ Error creating library: ${error}`);
    }
    setLoading(false);
  };

  const testSync = async () => {
    setLoading(true);
    try {
      await triggerSync();
      addLog('✅ Manual sync triggered');
    } catch (error) {
      addLog(`❌ Sync error: ${error}`);
    }
    setLoading(false);
  };

  const checkStatus = () => {
    const status = getSyncStatus();
    addLog(
      `📊 Status - DB: ${status.dbStatus}, Sync: ${status.syncStatus}, Replications: ${status.activeReplications}`
    );
  };

  return (
    <div className='bg-blur fixed right-4 bottom-20 z-50 w-80 rounded-lg border border-white/10 p-4 backdrop-blur-xl'>
      <h3 className='text-Grey-100 mb-3 text-lg font-semibold'>RxDB Test Panel</h3>

      <div className='mb-4 space-y-2'>
        <Button size='sm' color='primary' onPress={testGetLibraries} isLoading={loading} className='w-full'>
          Get Libraries ({libraries.length})
        </Button>

        <Button size='sm' color='secondary' onPress={testCreateLibrary} isLoading={loading} className='w-full'>
          Create Test Library
        </Button>

        <Button size='sm' color='warning' onPress={testSync} isLoading={loading} className='w-full'>
          Trigger Sync
        </Button>

        <Button size='sm' variant='bordered' onPress={checkStatus} className='w-full'>
          Check Status
        </Button>
      </div>

      <div className='text-Grey-300 max-h-32 overflow-y-auto text-xs'>
        <div className='mb-1 font-medium'>Recent Logs:</div>
        {logs.map((log, i) => (
          <div key={i} className='mb-1'>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
