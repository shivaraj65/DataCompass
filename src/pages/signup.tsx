import React, { lazy, Suspense } from "react";
import { signupConfig } from "@/config.js/compConfig";
import config from "@/config.js/appConfig";
import { Button } from "antd";
import FullscreenLoader from "@/components/ui/fullscreenLoader";

const Signup = () => {
  const Component = lazy(signupConfig[config.signup]);

  return (
    <React.Fragment>
      <Suspense fallback={<FullscreenLoader />}>
        <Component />
      </Suspense>
      
    </React.Fragment>
  );
};

export default Signup;
