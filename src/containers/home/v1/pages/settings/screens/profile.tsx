import { Avatar, Col, Row } from "antd";
import styles from "@/styles/containerThemes/home/pages/settings/screens/profile.module.scss";

const Profile = () => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <Avatar
          size="large"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=6"
        />
        <span className={`${styles.userName} light-200`}>John Doe</span>
      </div>
      <div className={styles.profileBody}>
        <Row>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <table>
                <tr>
                  <td>User ID </td>
                  <td> John Doe</td>
                </tr>
                <tr>
                  <td>Email </td>
                  <td>johndoe@xyz.com</td>
                </tr>
                <tr>
                  <td>Account Status </td>
                  <td> Active</td>
                </tr>
                <tr>
                  <td>Auth Provider</td>
                  <td> Hexbane</td>
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
                </tr>
                <tr>
                  <td>Password</td>
                  <td> *********</td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
