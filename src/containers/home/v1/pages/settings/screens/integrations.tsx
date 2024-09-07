import { Avatar, Col, Row } from "antd";
import styles from "@/styles/containerThemes/home/pages/settings/screens/integrations.module.scss";

const Integrations = () => {
  return (
    <div className={styles.integrationsContainer}>
      <div className={styles.integrationsHeader}>
        {/* <Avatar
          size="large"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=6"
        /> */}
        <span className={`${styles.userName} light-200`}>
          Integrations & Connected Apps
        </span>
      </div>
      <div className={styles.intagrationsBody}>
        <Row>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <h4 className={styles.title}>Connected API keys</h4>
              <table>
                <tr>
                  <td>Gpt Vision Key</td>
                  <td> ***************</td>
                </tr>
              </table>
            </div>
          </Col>
          <Col span={12}>
            <div className={`${styles.scrollerContent} bg-primary`}>
              <h4 className={styles.title}>Saved Databases</h4>
              <table>
                <tr>
                  <td>Sqlite URL</td>
                  <td>http://localhost:8080//1234</td>
                </tr>
                <tr>
                  <td>Postgres URL</td>
                  <td>http://localhost:8080//1234</td>
                </tr>
              </table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Integrations;
