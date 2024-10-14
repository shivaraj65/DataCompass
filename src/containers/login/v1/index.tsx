import React, { useEffect, useState } from "react";
import { Button, Col, message, Row } from "antd";
import styles from "@/styles/containerThemes/login/v1.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import JWTDecoder from "../googleHelper/jwtDecoder";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { resetLogin, updateUserInfo } from "@/redux/reducers/appSlice";
import { Input } from "antd";
import { useRouter } from "next/router";
import { CloseOutlined } from "@ant-design/icons";
import { loginApi } from "@/redux/asyncApi/users";

const Login = () => {
  const router = useRouter();

  //google login state
  const [user, setUser] = useState<any>(null);

  //normal login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.app.userInfo);
  const appInfo = useSelector((state: RootState) => state.app.appInfo);
  const login = useSelector((state: RootState) => state.app.login);

  const setGoogUserInfo = async () => {
    const userinfo = await JWTDecoder(user);
    console.log("userinfo", userinfo);
  };

  useEffect(() => {
    if (user) {
      setGoogUserInfo();
    }
  }, [user]);

  useEffect(() => {
    cleanUp();
    dispatch(resetLogin());
  }, []);

  useEffect(() => {
    if (login.error) message.error(login.error);
    cleanUp();
    dispatch(resetLogin());
  }, [login.error]);

  useEffect(() => {
    (async()=>{
      if (login.message === "success") {
        await sessionStorage.setItem("userProfile", JSON.stringify(userInfo));
        await dispatch(resetLogin());
        router.push("/home");
      } else {
        dispatch(resetLogin());
        cleanUp();
      }
    })()
    
  }, [login.message]);

  const onsubmit = async() => {
    if (email.length > 0 && password.length > 0) {
      await dispatch(
        loginApi({
          email: email,
          password: password,
        })
      );
    }
  };

  const cleanUp = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className={`${styles.loginContainerV1} bg-primary primaryText`}>
      <div className={styles.closeFloater} onClick={() => router.push("/")}>
        <CloseOutlined />
      </div>
      <div className={styles.formContainerV1}>
        {/* <GoogleLogin
          onSuccess={async (credentialResponse) => {
            console.log(credentialResponse);
            setUser(credentialResponse.credential);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <hr /> */}
        <div className={styles.passwordLoginContV1}>
          <div className={styles.titleContainer}>
            {appInfo && <img src={appInfo?.logo} className={styles.logo} />}
          </div>
          <div className={styles.componentWrapper}>
            <p className={`${styles.label}`}>Email</p>
            <Input
              value={email}
              size="large"
              placeholder=""
              variant="filled"
              disabled={login.loading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className={styles.componentWrapper}>
            <p className={`${styles.label}`}>Password</p>
            <Input.Password
              value={password}
              size="large"
              placeholder=""
              variant="filled"
              disabled={login.loading}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <Button
            type="primary"
            block
            size={"large"}
            disabled={login.loading}
            className={styles.loginButton}
            onClick={onsubmit}
          >
            LOGIN
          </Button>
        </div>
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don&apos;t have an Account
            <span
              className={styles.linkText}
              onClick={() => {
                router.push("/signup");
              }}
            >
              SIGNUP
            </span>
            &nbsp; / &nbsp;
            <span
              className={styles.linkText2}
              onClick={() => {
                router.push("/");
              }}
            >
              BACK
            </span>
          </p>
        </div>
      </div>
      {/* <ThemeToggle /> */}
    </div>
  );
};

export default Login;
