import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, RefreshCw } from 'lucide-react';

interface KVItem {
  key: string;
  value: any;
}

const KVStore: React.FC = () => {
  const [items, setItems] = useState<KVItem[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const keys = await puter.kv.list();
      const itemsData = await Promise.all(
        keys.map(async (key) => {
          const value = await puter.kv.get(key);
          return { key, value };
        })
      );
      setItems(itemsData);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to fetch items' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    try {
      // Try to parse JSON if possible, otherwise store as string
      let valToStore = newValue;
      try {
        valToStore = JSON.parse(newValue);
      } catch {}

      await puter.kv.set(newKey, valToStore);
      setMessage({ type: 'success', text: `Saved key "${newKey}"` });
      setNewKey('');
      setNewValue('');
      fetchItems();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save value' });
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await puter.kv.del(key);
      fetchItems();
      setMessage({ type: 'success', text: `Deleted key "${key}"` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete key' });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="text-emerald-500" />
          Key-Value Store
        </h2>
        <button 
          onClick={fetchItems} 
          className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Add New Item</h3>
        <form onSubmit={handleSet} className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Key"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
            />
          </div>
          <div className="flex-[2] space-y-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value (JSON or String)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!newKey || !newValue}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={18} />
            Set
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-medium">Key</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-400 italic">
                  No items in store. Add one above!
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-700">{item.key}</td>
                  <td className="px-6 py-4 font-mono text-slate-600 max-w-xs truncate" title={JSON.stringify(item.value)}>
                    {typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.key)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KVStore;