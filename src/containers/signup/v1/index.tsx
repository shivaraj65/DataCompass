import React, { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import styles from "@/styles/containerThemes/signup/v1.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signupApi } from "@/redux/asyncApi/users";
import { resetSignup } from "@/redux/reducers/appSlice";

export default function signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const appInfo = useSelector((state: RootState) => state.app.appInfo);
  const signup = useSelector((state: RootState) => state.app.signup);

  useEffect(() => {
    cleanUp();
    dispatch(resetSignup());
  }, []);

  useEffect(() => {
    if (signup.error) message.error(signup.error);
    cleanUp();
  }, [signup.error]);

  useEffect(() => {
    if (signup.message) message.info(signup.message);
    cleanUp();
  }, [signup.message]);

  const onSubmit = () => {
    dispatch(
      signupApi({
        name: name,
        email: email,
        password: password,
      })
    ); 
  };

  const cleanUp = () => {
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <React.Fragment>
      <div className={`${styles.signupContainerV1} bg-primary primaryText`}>
        <div className={styles.formContainerV1}>
          <div className={styles.titleContainer}>
            {appInfo && <img src={appInfo?.logo} className={styles.logo} />}
          </div>

          <div className={styles.passwordSignupContV1}>
            <div className={styles.componentWrapper}>
              <p className={`${styles.label}`}>Name</p>
              <Input
                value={name}
                size="large"
                placeholder=""
                variant="filled"
                disabled= {signup.loading}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className={styles.componentWrapper}>
              <p className={`${styles.label}`}>Email</p>
              <Input
                value={email}
                size="large"
                placeholder=""
                variant="filled"
                disabled= {signup.loading}
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
                disabled= {signup.loading}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button
              type="primary"
              block
              size={"large"}
              disabled= {signup.loading}
              className={styles.signupButton}
              onClick={onSubmit}
            >
              SIGNUP
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
