import React, { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import styles from "@/styles/containerThemes/signup/v1.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signupApi } from "@/redux/asyncApi/users";
import { resetSignup } from "@/redux/reducers/appSlice";
import { useRouter } from "next/router";
import { CloseOutlined } from "@ant-design/icons";

const Signup = () => {
  const router = useRouter();

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
    dispatch(resetSignup());
  }, [signup.error]);

  useEffect(() => {
    if (signup.message === "success") {
      message.open({
        type: "success",
        content: signup.message,
      });
      dispatch(resetSignup());
      router.push("/");
    }else{
      dispatch(resetSignup());
      cleanUp();
    }    
    
  }, [signup.message]);

  const onSubmit = async () => {
    if (name !== "" && isValidEmail(email) && isValidPassword(password)) {
      await dispatch(
        signupApi({
          name: name,
          email: email,
          password: password,
        })
      );
    } else {
      if (name === "") {
        message.open({
          type: "warning",
          content: "Name field cannot be empty",
        });
      } else if (!isValidEmail(email)) {
        message.open({
          type: "warning",
          content: "Entered EMAIL is not valid",
        });
      } else if (!isValidPassword(password)) {
        message.open({
          type: "warning",
          content: "Password must be atleast 8 characters",
        });
      }
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const regex = /^.{8,}$/;
    return regex.test(password);
  };

  const cleanUp = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <React.Fragment>
      <div className={`${styles.signupContainerV1} bg-primary primaryText`}>
        <div className={styles.closeFloater} onClick={() => router.push("/")}>
          <CloseOutlined />
        </div>
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
                disabled={signup.loading}
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
                disabled={signup.loading}
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
                disabled={signup.loading}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <Button
              type="primary"
              block
              size={"large"}
              disabled={signup.loading}
              className={styles.signupButton}
              onClick={onSubmit}
            >
              SIGNUP
            </Button>
          </div>
          <div className={styles.footer}>
            <p className={styles.footerText}>
              Already have a Account{" "}
              <span
                className={styles.linkText}
                onClick={() => {
                  router.push("/login");
                }}
              >
                LOGIN
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
      </div>
    </React.Fragment>
  );
}


export default Signup;