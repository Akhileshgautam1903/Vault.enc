"use client";

import { Entry } from "@/model/entry";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Check,
  Copy,
  Edit,
  Eye,
  EyeOff,
  RectangleEllipsis,
  Trash,
  User,
} from "lucide-react";
import { useState } from "react";

type VaultEntryProp = {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

const VaultEntryCard = ({ entry, onEdit, onDelete }: VaultEntryProp) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<
    "username" | "password" | null
  >(null);

  const handleCopy = async (text: string, field: "username" | "password") => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedField(field);

      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <Card size="sm">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="truncate">{entry.site}</CardTitle>

        <div className="flex gap-1">
          <Button size="icon" variant="outline" onClick={() => onEdit(entry)}>
            <Edit />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Username */}
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <User className="shrink-0 text-muted-foreground" size={16} />

            <p className="truncate">{entry.username}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(entry.username, "username")}
          >
            {copiedField === "username" ? <Check /> : <Copy />}
          </Button>
        </div>

        {/* Password */}
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <RectangleEllipsis
              size={16}
              className="shrink-0 text-muted-foreground"
            />

            <p className="truncate">
              {showPassword
                ? entry.password
                : "*".repeat(entry.password.length)}
            </p>
          </div>

          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(entry.password, "password")}
            >
              {copiedField === "password" ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VaultEntryCard;
