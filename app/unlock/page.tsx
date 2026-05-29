"use client";

import Silk from "@/components/Silk";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import VaultLogo from "@/components/vault/VaultLogo";
import { useVault } from "@/lib/vaultContext";
import {
  AlertCircleIcon,
  Eye,
  EyeOff,
  File,
  RectangleEllipsis,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const Unlock = () => {
  // using router for navigation
  const router = useRouter();

  // getting updater function from vaultContext
  const { setEntries, setMasterPassword } = useVault();

  const unlockVault = async (masterPassword: string, fileContents: string) => {
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterPassword, fileContents }),
    });

    if (res.ok) {
      //set entries and masterPassword in context
      const { data } = await res.json();

      //Populated the vaultContext
      setEntries(data);
      setMasterPassword(masterPassword);

      //redirect to /vault
      router.push("/vault");
    } else setWrongPwd(true);
  };

  const [error, setError] = useState({
    encFile: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setWrongPwd(false);

    if (!file.name.endsWith(".enc")) {
      setError((prev) => ({
        ...prev,
        encFile: true,
      }));
      return;
    }

    setSelectedFile(file);

    setError((prev) => ({
      ...prev,
      encFile: false,
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/octet-stream": [".enc"],
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // const file = formData.get("enc-file") as File;
    const file = selectedFile;
    const password = formData.get("pwd") as string;

    const errors = {
      encFile: false,
      password: false,
    };

    let hasError = false;

    // if (!file || file.size === 0) {
    //   errors.encFile = true;
    //   hasError = true;
    // } else if (!file.name.endsWith(".enc")) {
    //   errors.encFile = true;
    //   hasError = true;
    // }

    if(!file) {
      errors.encFile = true;
      hasError = true;
    }

    if (!password) {
      errors.password = true;
      hasError = true;
    }

    setError(errors);

    if (hasError) return;

    const validFile = file!;
    try {
      const fileContents = await validFile.text();

      //state update in react is async so it takes the old pwd and file contents and make the request
      // setPassword(password);
      // setFileContents(fileContents);

      await unlockVault(password, fileContents);

      // your decrypt logic here
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      <div className="hidden lg:block lg:w-3/4 relative overflow-hidden m-2 rounded-md">
        <Silk
          speed={5}
          scale={1}
          color="#b96dfa"
          noiseIntensity={1.5}
          rotation={0.5}
        />
      </div>
      <div className="flex w-full items-center justify-center px-4 relative">
        <VaultLogo />
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-4xl font-serif">
                  Access your <span className="accent-text">vault</span>
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Bring your .enc file and your password to unlock.
                </p>
              </div>
              <Field data-invalid={error.encFile}>
                <FieldLabel htmlFor="enc-file" className="font-serif text-xl">
                  Encrypted File <span className="text-destructive">*</span>
                </FieldLabel>
                {/* <InputGroup>
                  <InputGroupInput
                    type="file"
                    accept=".enc"
                    name="enc-file"
                    aria-invalid={error.encFile}
                  />
                  <InputGroupAddon>
                    <File />
                  </InputGroupAddon>
                </InputGroup> */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-md p-6 transition-all duration-200 cursor-pointer 
                    ${isDragActive ? "border-primary bg-primary/10" : "border-muted"}
                    ${error.encFile ? "border-destructive" : ""}
                  `}
                >
                  <input {...getInputProps()} name="enc-file" />

                  <div className="flex flex-col items-center gap-2 text-center">
                    <File className="size-8 text-muted-foreground" />

                    {selectedFile ? (
                      <>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Click or drop another file to replace
                        </p>
                      </>
                    ) : isDragActive ? (
                      <p>Drop your .enc file here...</p>
                    ) : (
                      <>
                        <p className="font-medium">
                          Drag & drop your vault file
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (.enc only)
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {error.encFile && (
                  <FieldError>
                    Encrypted file is required and should be of .enc file
                    extenstion.
                  </FieldError>
                )}
              </Field>
              <Field data-invalid={error.password}>
                <FieldLabel htmlFor="pwd" className="font-serif text-xl">
                  Password <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    placeholder="eg. pwd@123"
                    name="pwd"
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
                  <FieldError>Password is required.</FieldError>
                )}
              </Field>
              {wrongPwd && (
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircleIcon />
                  <AlertTitle>Incorrect Password</AlertTitle>
                  <AlertDescription>
                    Please enter the correct password to decrypt the file.
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
    </div>
  );
};

export default Unlock;
