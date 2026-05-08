export type Entry = {
  id: string;
  site: string;
  username: string;
  password: string;
  notes?: string;
};

export type Vault = {
  entries: Entry[];
};

export type FormErrors = {
  site?: string;
  username?: string;
  password?: string;
};
