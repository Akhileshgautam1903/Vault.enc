"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/lib/vaultContext";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AlertCircleIcon, Eye, EyeOff, RectangleEllipsis } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Silk from "@/components/Silk";
import VaultLogo from "@/components/VaultLogo";

export default function page() {
  const { setMasterPassword } = useVault();
  const router = useRouter();

  const [error, setError] = useState({
    masterPwd: false,
    confirmPwd: false,
    equal: true,
  });

  const [showMasterPassword, setMasterShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const masterPassword = formData.get("master-pwd") as string;
    const confirmPassword = formData.get("confirm-pwd") as string;

    const errors = {
      masterPwd: false,
      confirmPwd: false,
      equal: true,
    };

    let hasError = false;

    if (!masterPassword) {
      errors.masterPwd = true;
      hasError = true;
    }

    if (!confirmPassword) {
      errors.confirmPwd = true;
      hasError = true;
    }

    if (masterPassword !== confirmPassword) {
      errors.equal = false;
      hasError = true;
    }

    setError(errors);

    if (hasError) return;

    setMasterPassword(masterPassword);
    router.push("/vault");
  };

  return (
    <div className="flex min-h-screen relative">
      <VaultLogo />
      <div className="flex w-full items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-3xl font-serif">
                  Set a master password for your <span className="accent-text">vault</span>
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Set a password you can remember — this cannot be recovered if lost.
                </p>
              </div>
              <Field data-invalid={error.masterPwd}>
                <FieldLabel htmlFor="master-pwd" className="font-serif text-xl">
                  Master Password <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showMasterPassword ? "text" : "password"}
                    placeholder="eg. pwd@123"
                    name="master-pwd"
                    aria-invalid={error.masterPwd}
                  />
                  <InputGroupAddon>
                    <RectangleEllipsis />
                  </InputGroupAddon>
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      variant="ghost"
                      onClick={() => setMasterShowPassword((prev) => !prev)}
                    >
                      {showMasterPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {error.masterPwd && (
                  <FieldError>Master password is required.</FieldError>
                )}
              </Field>
              <Field data-invalid={error.confirmPwd}>
                <FieldLabel htmlFor="confirm-pwd" className="font-serif text-xl">
                  Confirm Password <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="eg. pwd@123"
                    name="confirm-pwd"
                    aria-invalid={error.confirmPwd}
                  />
                  <InputGroupAddon>
                    <RectangleEllipsis />
                  </InputGroupAddon>
                  <InputGroupAddon align={"inline-end"}>
                    <InputGroupButton
                      variant="ghost"
                      onClick={() => setConfirmShowPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {error.confirmPwd && (
                  <FieldError>Confirm password is required.</FieldError>
                )}
              </Field>
              {!error.equal && (
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircleIcon />
                  <AlertTitle>Passwords do not match</AlertTitle>
                  <AlertDescription>
                    Master password and confirm password should be the same.
                  </AlertDescription>
                </Alert>
              )}
            </FieldGroup>
            <Button type="submit" className="mt-4 w-full font-serif text-xl">
              Continue
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block lg:w-3/4 relative overflow-hidden m-2 rounded-md">
        <Silk
          speed={5}
          scale={1}
          color="#b96dfa"
          noiseIntensity={1.5}
          rotation={0.5}
        />
      </div>
    </div>
  );
}
