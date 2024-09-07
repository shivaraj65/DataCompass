import React, { useState } from "react";
import { Button, Input } from "antd";
import styles from "@/styles/containerThemes/signup/v1.module.scss";

import {} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const appInfo = useSelector((state: RootState) => state.app.appInfo);

  return (
    <React.Fragment>
      <div className={`${styles.signupContainerV1} bg-primary primaryText`}>
        <div className={styles.formContainerV1}>
          <div className={styles.titleContainer}>
            {appInfo && <p className={styles.title}>{appInfo?.name}</p>}
          </div>

          <div className={styles.passwordSignupContV1}>
            <div className={styles.componentWrapper}>
              <p className={`${styles.label}`}>Name</p>
              <Input
                value={name}
                size="large"
                placeholder=""
                variant="filled"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button
              type="primary"
              block
              size={"large"}
              className={styles.signupButton}
            >
              SIGNUP
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
