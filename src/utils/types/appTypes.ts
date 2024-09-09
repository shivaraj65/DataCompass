export interface appInfotypes {
  name: string;
  logo: string;
  description: string;
}

export interface userInfotypes {
  id: string;
  name: string;
  email: string;
  password?: string;
  authOrigin: string;
  isEditable: {
    id: boolean;
    name: boolean;
    email: boolean;
    password: boolean;
    llmApiKeys: boolean;
    databases: boolean;
  };
  createdAt: string;
  llmApiKeys?: any;
  databases?: any;
  accountStatus: boolean;
}

export interface signupTypes {
  message: string | null;
  loading: boolean;
  error: string | null;
}

export interface loginTypes {
  message: string | null;
  loading: boolean;
  error: string | null;
}
