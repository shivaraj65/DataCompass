"use client";

import React, { useEffect, useState } from "react";
import { homeConfig } from "@/config.js/compConfig";
import config from "@/config.js/appConfig";
import FullscreenLoader from "@/components/ui/fullscreenLoader";
import ErrorPage from "@/components/ui/errorPage";
import { useRouter } from "next/router";
import type { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { updateUserInfo } from "@/redux/reducers/appSlice";
import { userInfotypes } from "@/utils/types/appTypes";

const Home: React.FC = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const app = useSelector((state: RootState) => state.app);

  const [Component, setComponent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {

    // Handle user profile
    const userProfile = sessionStorage.getItem("userProfile");
    if (!userProfile) {
      router.push("/");
    } else {
      if (!app.userInfo) {
        const userData: userInfotypes = userProfile && JSON.parse(userProfile);
        dispatch(updateUserInfo(userData));
      }
    }

    // Dynamically import the component only once
    const loadComponent = async () => {
      setLoading(true);
      try {
        const { default: LoadedComponent } = await homeConfig[config.home]();
        setComponent(() => LoadedComponent);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (!Component) loadComponent();
  }, [dispatch, router]);

  if (loading) {
    return <FullscreenLoader />;
  }

  if (error) {
    return (
      <ErrorPage
        message={error?.message}
        prefixText="I have bad news for you"
        title={error?.name}
      />
    );
  }

  return (
    <React.Fragment>
      <Component />
    </React.Fragment>
  );
};

export default Home;
