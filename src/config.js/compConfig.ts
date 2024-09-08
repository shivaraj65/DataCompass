//component leve configs for selection of components from appConfig

type LandingConfigKeys = {
  landingV1: () => Promise<typeof import("../containers/landing/v1")>;
  landingV2: () => Promise<typeof import("../containers/landing/v2")>;
};

type LoginConfigKeys = {
  loginV1: () => Promise<typeof import("../containers/login/v1")>;
  loginV2: () => Promise<typeof import("../containers/login/v2")>;
};

type signupConfigKeys = {
  signupV1: () => Promise<typeof import("../containers/signup/v1")>;
  signupV2: () => Promise<typeof import("../containers/signup/v2")>;
};

type homeConfigKeys = {
  homeV1: () => Promise<typeof import("../containers/home/v1")>;
  homeV2: () => Promise<typeof import("../containers/home/v2")>;
};

export const landingConfig: LandingConfigKeys = {
  landingV1: () => import("../containers/landing/v1"),
  landingV2: () => import("../containers/landing/v2"),
};

export const loginConfig: LoginConfigKeys = {
  loginV1: () => import("../containers/login/v1"),
  loginV2: () => import("../containers/login/v2"),
};

export const signupConfig: signupConfigKeys = {
  signupV1: () => import("../containers/signup/v1"),
  signupV2: () => import("../containers/signup/v2"),
};

export const homeConfig: homeConfigKeys = {
  homeV1: () => import("../containers/home/v1"),
  homeV2: () => import("../containers/home/v2"),
};
