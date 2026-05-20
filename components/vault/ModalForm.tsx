"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Entry, FormErrors } from "@/model/entry";
import {
  Check,
  Eye,
  EyeOff,
  Globe,
  RectangleEllipsis,
  User,
} from "lucide-react";
import { useState } from "react";

type ModalFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: Omit<Entry, "id">) => void;
  defaultValues?: Omit<Entry, "id">
};

const ModalForm = ({ open, onOpenChange, onSubmit, defaultValues }: ModalFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<FormErrors>({
    site: false,
    username: false,
    password: false,
  });

  // const handleSubmit = (formData: FormData) => {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const site = formData.get("site")?.toString();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const notes = formData.get("notes")?.toString();

    const newErrors: FormErrors = {
      site: false,
      username: false,
      password: false,
    };

    let hasError = false;

    if (!site) {
      newErrors.site = true;
      hasError = true;
    }
    if (!username) {
      newErrors.username = true;
      hasError = true;
    }

    if (!password) {
      newErrors.password = true;
      hasError = true;
    }

    setError(newErrors);

    if (hasError) return;

    onSubmit({site: site!, username: username!, password: password!, notes: notes})

    e.currentTarget.reset();
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Form</DialogTitle>
              <DialogDescription>
                Add the details and password for your account
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              {/* Site input */}
              <Field data-invalid={error.site}>
                <FieldLabel htmlFor="site">
                  Site Name <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    placeholder="Site"
                    name="site"
                    defaultValue={defaultValues?.site ?? ""}
                    aria-invalid={error.site}
                  />
                  <InputGroupAddon>
                    <Globe />
                  </InputGroupAddon>
                </InputGroup>
                {error.site && <FieldError>Site name is required.</FieldError>}
              </Field>

              {/* username input */}
              <Field data-invalid={error.username}>
                <FieldLabel htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    placeholder="Username"
                    name="username"
                    defaultValue={defaultValues?.username ?? ""}
                    aria-invalid={error.username}
                  />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                {error.username && (
                  <FieldError>Username is required.</FieldError>
                )}
              </Field>

              {/* password input with peek feature */}
              <Field data-invalid={error.password}>
                <FieldLabel htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    name="password"
                    defaultValue={defaultValues?.password ?? ""}
                    aria-invalid={error.password}
                  />
                  <InputGroupAddon>
                    <RectangleEllipsis />
                  </InputGroupAddon>
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      variant="ghost"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {error.password && (
                  <FieldError>Password name is required.</FieldError>
                )}
              </Field>

              {/* Optional notes Field */}
              <Field>
                <FieldLabel htmlFor="notes">Notes (Optional)</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    name="notes"
                    placeholder="Any notes..."
                    defaultValue={defaultValues?.notes ?? ""}
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};

export default ModalForm;
