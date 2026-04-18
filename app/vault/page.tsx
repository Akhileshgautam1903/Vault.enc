"use client";

import { useVault } from "@/lib/vaultContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Entry } from "@/model/entry";
import { encryptVault } from "@/lib/clientCrypto";

const Vault = () => {
  const { entries, setEntries, masterPassword, setMasterPassword } = useVault();
  const router = useRouter();

  const emptyEntry = { site: "", username: "", password: "", notes: "" };

  const [searchText, setSearchText] = useState<string>("");
  const [filename, setFilename] = useState<string>("vault");
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [newEntry, setNewEntry] = useState(emptyEntry);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    // push a duplicate history entry
    // so back button just goes to current page again
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setIsLeaving(true);
      setShowLockModal(true); // show export modal instead
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    //check if we have master password is empty
    if (!masterPassword) router.push("/");
  }, [masterPassword, router]);

  useEffect(() => {
    //add listener when component mounts
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    //when component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const filteredEnteries = entries.filter((e) =>
    e.site.toLowerCase().includes(searchText.toLowerCase()),
  );

  //Updating the context on save
  const saveToVault = async (updatedEntries: Entry[]) => {
    setEntries(updatedEntries);
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
    const content = await encryptVault(entries, masterPassword);

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
          onClick={() => {
            setShowLockModal(true);
            setIsLeaving(false);
          }}
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
                onClick={() => {
                  setEntryToDelete(entry.id);
                  setShowDeleteModal(true);
                }}
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

      {/* MODALS */}
      {(showAddModal || showEditModal || showLockModal || showDeleteModal) && (
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
                {isLeaving && "Your are leaving."} Please Export your
                vault file.
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
                  onClick={() => {setShowLockModal(false); setIsLeaving(false)}}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* DELETE MODAL */}
          {showDeleteModal && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
              <h2 className="text-lg font-semibold text-red-500">
                Delete Entry
              </h2>

              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to delete this entry? <br />
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  className="btn bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded-sm"
                  onClick={() => {
                    if (entryToDelete) handleDeleteEntry(entryToDelete);
                    setShowDeleteModal(false);
                    setEntryToDelete(null);
                  }}
                >
                  Delete
                </button>

                <button
                  className="btn-muted"
                  onClick={() => setShowDeleteModal(false)}
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
