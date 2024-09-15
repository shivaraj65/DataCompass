import { Avatar, Button, Col, Input, message, Modal, Row } from "antd";
import styles from "@/styles/containerThemes/home/pages/settings/screens/profile.module.scss";
import { userInfotypes } from "@/utils/types/appTypes";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserApi } from "@/redux/asyncApi/users";
import { AppDispatch, RootState } from "@/redux/store";
import { resetUpdateUser } from "@/redux/reducers/appSlice";

interface props {
  userInfo: userInfotypes;
}

const Profile = ({ userInfo }: props) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateUser = useSelector((state: RootState) => state.app.updateUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");

  useEffect(() => {
    if (updateUser.error) message.error(updateUser.error);    
    dispatch(resetUpdateUser());          
  }, [updateUser.error]);

  useEffect(() => {
    if (updateUser.message === "success") {
      message.open({
        type: "success",
        content: updateUser.message,
      });
      dispatch(resetUpdateUser());      
    }else{
      dispatch(resetUpdateUser());      
    }    
    
  }, [updateUser.message]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onSubmitPassword();
  };

  const handleCancel = () => {
    setNewPassword("");
    setIsModalOpen(false);
  };

  const onSubmitPassword = async() => {
    console.log("new password", newPassword);
    if (isValidPassword(newPassword)) {
      await dispatch(updateUserApi(
        { 
          id: userInfo.id, 
          password: newPassword 
        })
      );

      setIsModalOpen(false);
      setNewPassword("");
    } else {
      message.open({
        type: "warning",
        content: "Password must be atleast 8 characters",
      });
    }
  };

  const isValidPassword = (password: string) => {
    const regex = /^.{8,}$/;
    return regex.test(password);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Avatar
          size="large"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=6"
        />
        <span className={`${styles.userName} light-200`}>{userInfo.name}</span>
      </div>
      <div className={styles.profileBody}>
        <Row>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <table>
                <tr>
                  <td>User ID </td>
                  <td> {userInfo.id}</td>
                  <td>{userInfo.isEditable.id && <EditOutlined />}</td>
                </tr>
                <tr>
                  <td>Email </td>
                  <td>{userInfo.email}</td>
                  <td>{userInfo.isEditable.email && <EditOutlined />}</td>
                </tr>
                <tr>
                  <td>Account Status </td>
                  <td>
                    {userInfo.accountStatus ? "Verified" : "Not Verified"}
                  </td>
                  <td>{userInfo.isEditable.id && <EditOutlined />}</td>
                </tr>
                <tr>
                  <td>Auth Provider</td>
                  <td> {userInfo.authOrigin}</td>
                  <td>{userInfo.isEditable.id && <EditOutlined />}</td>
                </tr>
              </table>
            </div>
          </Col>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <table>
                <tr>
                  <td> 2FA</td>
                  <td> Disabled</td>
                  <td>{userInfo.isEditable.id && <EditOutlined />}</td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td> {userInfo.password ? "************" : ""}</td>
                  <td>
                    {userInfo.isEditable.password && (
                      <Button
                        className={styles.editButton}
                        type={"text"}
                        style={{ padding: "0 8px" }}
                        onClick={showModal}
                      >
                        <EditOutlined />
                      </Button>
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title="Reset Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{ margin: "1.5rem 1rem" }}>
          <label>Enter a new Password:</label>
          <Input.Password
            placeholder=""
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
