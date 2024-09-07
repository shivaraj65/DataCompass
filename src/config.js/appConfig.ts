import { loginConfig, signupConfig, homeConfig } from "./compConfig";

type configType = {
  login: keyof typeof loginConfig;
  signup: keyof typeof signupConfig;
  home: keyof typeof homeConfig;
};

const config: configType = {
  login: "loginV1",
  signup: "signupV1",
  home: "homeV1",
};

export default config;
