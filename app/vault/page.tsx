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
    <div className="flex flex-col min-h-screen items-center bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center w-full max-w-4xl px-4 py-6">
        <h1 className="text-3xl font-semibold tracking-tight">Vault.enc</h1>
        <button
          className="px-4 py-1.5 text-sm border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={() => setShowLockModal(true)}
        >
          Lock
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search site..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full max-w-4xl px-4 py-2 mb-4 border rounded-md bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300"
      />

      {/* ADD BUTTON */}
      <div className="w-full max-w-4xl flex justify-end mb-4 px-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black"
        >
          Add Entry
        </button>
      </div>

      {/* ENTRY LIST */}
      <div className="w-full max-w-4xl space-y-3 px-2">
        {filteredEnteries.map((entry) => (
          <div
            key={entry.id}
            className="flex justify-between items-center p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-sm"
          >
            <div>
              <p className="font-medium">{entry.site}</p>
              <p className="text-sm text-zinc-500">{entry.username}</p>
            </div>

            <div className="flex gap-2">
              <button
                className="text-sm px-3 py-1 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => navigator.clipboard.writeText(entry.password)}
              >
                Copy
              </button>
              <button
                className="text-sm px-3 py-1 border rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                onClick={() => handleDeleteEntry(entry.id)}
              >
                Delete
              </button>
              <button
                className="text-sm px-3 py-1 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                onClick={() => {
                  setEditEntry(entry);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STATUS */}
      {saving && <p className="mt-4 text-sm text-zinc-500">Saving...</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {/* MODALS */}
      {(showAddModal || showEditModal || showLockModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          {/* ADD MODAL */}
          {showAddModal && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-lg font-semibold">Add Entry</h2>

              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                placeholder="Site"
                value={newEntry.site}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, site: e.target.value })
                }
              />
              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                placeholder="Username"
                value={newEntry.username}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, username: e.target.value })
                }
              />
              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                type="password"
                placeholder="Password"
                value={newEntry.password}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, password: e.target.value })
                }
              />
              <textarea
                className="input border-b-2 border-zinc-500 outline-none py-1"
                placeholder="Notes (optional)"
                value={newEntry.notes}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, notes: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={handleAddEntry}>
                  Save
                </button>
                <button
                  className="btn-muted"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {showEditModal && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-lg font-semibold">Edit Entry</h2>

              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                value={editEntry?.site ?? ""}
                onChange={(e) =>
                  setEditEntry({ ...editEntry!, site: e.target.value })
                }
              />
              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                value={editEntry?.username ?? ""}
                onChange={(e) =>
                  setEditEntry({ ...editEntry!, username: e.target.value })
                }
              />
              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                type="password"
                value={editEntry?.password ?? ""}
                onChange={(e) =>
                  setEditEntry({ ...editEntry!, password: e.target.value })
                }
              />
              <textarea
                className="input border-b-2 border-zinc-500 outline-none py-1"
                value={editEntry?.notes ?? ""}
                onChange={(e) =>
                  setEditEntry({ ...editEntry!, notes: e.target.value })
                }
              />

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={handleEditEntry}>
                  Save
                </button>
                <button
                  className="btn-muted"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* LOCK MODAL */}
          {showLockModal && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-lg font-semibold">Export Vault</h2>
              <p className="text-sm text-zinc-500">
                Your session is ending. Export your vault file.
              </p>

              <input
                className="input border-b-2 border-zinc-500 outline-none py-1"
                placeholder="Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={handleExportAndLock}>
                  Export & Lock
                </button>
                <button
                  className="btn-muted"
                  onClick={() => setShowLockModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Vault;
