import React, { useState, useCallback } from "react";
import { Stat } from "@/types/stat";

interface StatCardProps {
  stat: Stat;
  onUpdate: (id: number, newValue: number) => Promise<void>;
}

// This component represents a single stat card with editing capabilities
// And alows a user to update the stat value
const StatCard: React.FC<StatCardProps> = ({ stat, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(stat.value);

  const handleSave = useCallback(async () => {
    setLoading(true);
    await onUpdate(stat.id, value);
    setLoading(false)
    setEditing(false);
  }, [onUpdate, stat.id, value]);

  const handleCancel = useCallback(() => {
    setValue(stat.value);
    setEditing(false);
  }, [stat.value]);

  return (
    <div className="flex flex-col gap-2 px-4 py-4 pb-2 bg-[whitesmoke] border border-[#ddd] dark:border-[#333] dark:bg-[#111] rounded-lg shadow-sm">
      <h2 className="text-lg">{stat.name}</h2>
      {!editing ? (
        <p className="text-md my-2 h-[32px]">{stat.value}</p>
      ) : (
        <input
          type="number"
          value={value}
          disabled={loading}
          onChange={(e) => setValue(+e.target.value)}
          className="border p-2 rounded h-[32px] grow-1 text-md outline-none"
        />
      )}
      <div className="my-1 flex space-x-2">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-black cursor-pointer bg-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
      </div>
      <div className="flex flex-col justify-end items-start">
        <p className="text-sm text-gray-400">Version {stat.version}</p>
        <p className="text-sm text-gray-400">
          Last update on {new Date(stat.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
