"use client";

import { useVault } from "@/lib/vaultContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Entry } from "@/model/entry";
import { encryptVault } from "@/lib/clientCrypto";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import VaultSearch from "@/components/vault/VaultSearch";
import { CirclePlus, Lock } from "lucide-react";
import VaultEntryCard from "@/components/vault/VaultEntryCard";
import ModalForm from "@/components/vault/ModalForm";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const Vault = () => {
  const { entries, setEntries, masterPassword, setMasterPassword } = useVault();
  const router = useRouter();

  const [searchText, setSearchText] = useState<string>("");
  const [filename, setFilename] = useState<string>("vault");
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  const [showLockModal, setShowLockModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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
  const handleAddEntry = (newFormEntry: Omit<Entry, "id">) => {
    const entry: Entry = {
      id: crypto.randomUUID(),
      // ...newEntry,
      ...newFormEntry,
    };

    saveToVault([...entries, entry]);
    toast.success("Entry saved.", { position: "bottom-center" });
  };

  //Delete an entry
  const handleDeleteEntry = (id: string) => {
    saveToVault(entries.filter((entry) => entry.id !== id));
    toast.success("Entry Deleted.", { position: "bottom-center" });
  };

  //Update an Entry
  const handleEditEntry = (editFormEntry: Omit<Entry, "id">) => {
    if (!editEntry) return;

    const updatedEntry: Entry = {
      id: editEntry.id,
      ...editFormEntry,
    };

    saveToVault(
      entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e)),
    );
    toast.success("Entry Updated.", { position: "bottom-center" });
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
    <div className="w-full max-w-4xl px-4 mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-semibold tracking-tight">Vault.enc</h1>
        <Button
          variant="default"
          onClick={() => {
            setShowLockModal(true);
            setIsLeaving(false);
          }}
        >
          <Lock />
          Lock & Export
        </Button>
      </div>

      {/* SEARCH & ADD BUTTON */}
      <div className="flex mb-4 gap-2">
        <VaultSearch value={searchText} onchange={setSearchText} />
        <Button variant="default" onClick={() => setShowAddModal(true)}>
          <CirclePlus />
          Add Entry
        </Button>
      </div>

      {/* ENTRY LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredEnteries.map((entry) => (
          <VaultEntryCard
            key={entry.id}
            entry={entry}
            onEdit={(entry) => {
              setEditEntry(entry);
              setShowEditModal(true);
            }}
            onDelete={(id) => {
              setEntryToDelete(id);
              setShowDeleteModal(true);
            }}
          />
        ))}
      </div>

      {/* MODAL COMPONENTS */}
      {/* ADD MODAL */}
      <ModalForm
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSubmit={handleAddEntry}
      />

      {/* EDIT MODAL */}
      <ModalForm
        key={editEntry?.id}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onSubmit={handleEditEntry}
        defaultValues={editEntry ?? undefined}
      />

      {/* LOCK MODAL */}
      <Dialog
        open={showLockModal}
        onOpenChange={(open) => setShowLockModal(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Vault</DialogTitle>
            <DialogDescription>
              This will encrypt and export your file (in .enc extension)
            </DialogDescription>
          </DialogHeader>
          {isLeaving && "You are leaving."} Please Export your vault file.
          <InputGroup>
            <InputGroupInput
              placeholder="Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.enc</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <DialogFooter>
            <Button variant="default" onClick={handleExportAndLock}>
              Export & Lock
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowLockModal(false);
                setIsLeaving(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              This action will permanently delete the entry
            </DialogDescription>
          </DialogHeader>
          <p>
            Are you sure you want to delete this entry? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                if (entryToDelete) handleDeleteEntry(entryToDelete);
                setShowDeleteModal(false);
                setEntryToDelete(null);
              }}
            >
              Delete
            </Button>

            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vault;
