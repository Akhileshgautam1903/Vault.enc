"use client";

import { useVault } from "@/lib/vaultContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Entry } from "@/model/entry";

const Vault = () => {
  const { entries, setEntries, masterPassword, setMasterPassword } = useVault();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("vault");

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const emptyEntry = { site: "", username: "", password: "", notes: "" };
  const [newEntry, setNewEntry] = useState(emptyEntry);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);

  const filteredEnteries = entries.filter((e) =>
    e.site.toLowerCase().includes(searchText.toLowerCase()),
  );

  //Optimistic saving and rollbacking
  const saveToVault = async (updatedEntries: Entry[]) => {
    const previousEntries = entries; // ← snapshot before change

    setEntries(updatedEntries); // optimistic UI update

    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterPassword, entries: updatedEntries }),
    });

    if (!res.ok) {
      setEntries(previousEntries); // ← rollback if save fails
      setError("Failed to save. Please try again.");
    }
  };

  //Create new Entry
  const handleAddEntry = () => {
    const entry: Entry = {
      id: crypto.randomUUID(),
      ...newEntry,
    };
    saveToVault([...entries, entry]);
    setShowAddModal(false);
    setNewEntry(emptyEntry);
  };

  //Delete an entry
  const handleDeleteEntry = (id: string) => {
    saveToVault(entries.filter((entry) => entry.id !== id));
  };

  //Update an Entry
  const handleEditEntry = () => {
    if (!editEntry) return;
    saveToVault(entries.map((e) => (e.id === editEntry.id ? editEntry : e)));
    setShowEditModal(false);
    setEditEntry(null);
  };

  //Handle export and lock
  const handleExportAndLock = async () => {
    //1. Get encrypted contents from the disk
    const res = await fetch("/api/export");
    const { content } = await res.json();

    //2.Trigger Download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.enc`;
    a.click();
    URL.revokeObjectURL(url);

    //3. Clear context
    setEntries([]);
    setMasterPassword("");

    //4. Go home
    router.push("/");
    
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-4">
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50">
          <div>
            <h2>Add Entry</h2>
            <input
              placeholder="Site"
              value={newEntry.site}
              onChange={(e) =>
                setNewEntry({ ...newEntry, site: e.target.value })
              }
            />
            <input
              placeholder="Username"
              value={newEntry.username}
              onChange={(e) =>
                setNewEntry({ ...newEntry, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={newEntry.password}
              onChange={(e) =>
                setNewEntry({ ...newEntry, password: e.target.value })
              }
            />
            <textarea
              placeholder="Notes (optional)"
              value={newEntry.notes}
              onChange={(e) =>
                setNewEntry({ ...newEntry, notes: e.target.value })
              }
            />
            <button onClick={handleAddEntry}>Save</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50">
          <div>
            <h2>Edit Entry</h2>
            <input
              placeholder="Site"
              value={editEntry?.site ?? ""}
              onChange={(e) =>
                setEditEntry({ ...editEntry!, site: e.target.value })
              }
            />
            <input
              placeholder="Username"
              value={editEntry?.username ?? ""}
              onChange={(e) =>
                setEditEntry({ ...editEntry!, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={editEntry?.password ?? ""}
              onChange={(e) =>
                setEditEntry({ ...editEntry!, password: e.target.value })
              }
            />
            <textarea
              placeholder="Notes (optional)"
              value={editEntry?.notes ?? ""}
              onChange={(e) =>
                setEditEntry({ ...editEntry!, notes: e.target.value })
              }
            />
            <button onClick={handleEditEntry}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showLockModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }}
        >
          <div>
            <h2>Export your vault</h2>
            <p>
              Your session is ending. Export your vault file to keep your data
              safe.
            </p>
            <input
              placeholder="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <button onClick={handleExportAndLock}>Export & Lock</button>
            <button onClick={() => setShowLockModal(false)}>
              Back to editing
            </button>
          </div>
        </div>
      )}
      <div>
        <h1>Vault.enc</h1>
        <button onClick={() => setShowLockModal(true)}>Lock</button>
      </div>
      <input
        type="text"
        placeholder="Enter the site name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div>
        <button onClick={() => setShowAddModal(true)}>Add entry</button>
        {filteredEnteries.map((entry) => (
          <div key={entry.id}>
            <p>{entry.site}</p>
            <p>{entry.username}</p>
            <button onClick={() => navigator.clipboard.writeText(entry.password)}>Copy password</button>
            <button onClick={() => handleDeleteEntry(entry.id)}>Delete</button>
            <button
              onClick={() => {
                setEditEntry(entry);
                setShowEditModal(true);
              }}
            >
              Update
            </button>
          </div>
        ))}
      </div>
      {saving && <p>Saving...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Vault;
