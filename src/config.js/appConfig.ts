import { loginConfig, signupConfig, homeConfig, landingConfig } from "./compConfig";

type configType = {
  landing: keyof typeof landingConfig;
  login: keyof typeof loginConfig;
  signup: keyof typeof signupConfig;
  home: keyof typeof homeConfig;
};

const config: configType = {
  landing: "landingV1",
  login: "loginV1",
  signup: "signupV1",
  home: "homeV1",
};

export default config;
