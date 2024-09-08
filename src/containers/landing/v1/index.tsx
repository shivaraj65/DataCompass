import styles from "@/styles/containerThemes/landing/v1.module.scss";
import { Button, Card, Col, Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  MailOutlined,
  GithubOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

import HeroImage2 from "@/assets/illustrations/hero-img-2.svg";
import Bro1 from "@/assets/illustrations/bro-4.png";
import Bro2 from "@/assets/illustrations/bro-2.png";
import Bro3 from "@/assets/illustrations/bro-5.png";
import HE from "@/assets/logo/hackearearth.jpg";
import ATMECS from "@/assets/logo/atmecs.jpg";
import Features1 from "@/assets/illustrations/features-1.png";
import Features2 from "@/assets/illustrations/features-2.png";
import Features3 from "@/assets/illustrations/features-3.png";
import Features4 from "@/assets/illustrations/features-4.png";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const { Meta } = Card;

const Landing = () => {
  const router = useRouter();

  const appInfo = useSelector((state: RootState) => state.app.appInfo);

  return (
    <div className={`${styles.landingContainerV1} landingPageV1`}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          {appInfo && (
            <>
              <img src={appInfo?.logo} className={styles.logo} />
              <p className={styles.appDescription}>{appInfo.description}</p>
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.buttons}
                  type={"primary"}
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button
                  className={styles.buttons}
                  onClick={() => router.push("/signup")}
                >
                  {" "}
                  Signup
                </Button>
              </div>
            </>
          )}
        </div>

        <Image
          className={styles.heroImage}
          src={HeroImage2}
          alt="Hero Illustration"
          layout="responsive"
        />
      </header>
      <div className={styles.body}>
        <section className={styles.section1}>
          <p className={styles.title}>Explore Data Like Never Before</p>
          <div className={styles.sectionCards}>
            <Row>
              <Col span={6} className={styles.colStyle}>
                <Card
                  hoverable
                  cover={
                    <Image
                      className={styles.logo}
                      src={Features1}
                      alt="image"
                      height={240}
                      priority
                    />
                  }
                >
                  <Meta
                    title="Intelligent Insights"
                    description="Uncover hidden patterns and trends with our AI-driven analytics, turning complex data into clear, actionable insights."
                  />
                </Card>
              </Col>
              <Col span={6} className={styles.colStyle}>
                <Card
                  hoverable
                  cover={
                    <Image
                      className={styles.logo}
                      src={Features2}
                      alt="image"
                      height={240}
                      priority
                    />
                  }
                >
                  <Meta
                    title="Effortless Connectivity"
                    description="Seamlessly connect and manage your data, simplifying integration and streamlining operations to boost efficiency and effectiveness."
                  />
                </Card>
              </Col>
              <Col span={6} className={styles.colStyle}>
                <Card
                  hoverable
                  cover={
                    <Image
                      className={styles.logo}
                      src={Features3}
                      alt="image"
                      height={240}
                      priority
                    />
                  }
                >
                  <Meta
                    title="Next-Gen AI Insights"
                    description=" Benefit from state-of-the-art AI models that continuously learn and refine, offering you more precise and actionable insights."
                  />
                </Card>
              </Col>
              <Col span={6} className={styles.colStyle}>
                <Card
                  hoverable
                  cover={
                    <Image
                      className={styles.logo}
                      src={Features4}
                      alt="image"
                      height={240}
                      priority
                    />
                  }
                >
                  <Meta
                    title="Advanced Data Discovery"
                    description="Unearth valuable insights with sophisticated algorithms that dive deep into your data, revealing opportunities and patterns."
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </section>

        <section className={styles.section2}>
          <p className={styles.title}>Hackathon Spotlight</p>
          <div>
            <p className={styles.description}>
              Proudly collaborating with innovative minds to push the boundaries
              of data and AI. Our journey is fueled by the expertise and support
              of these amazing partners.
            </p>
            <div className={styles.logoContainer}>
              <Image
                className={styles.logoImage}
                src={ATMECS}
                alt="logo"
                layout="responsive"
              />
              <Image
                className={styles.logoImage}
                src={HE}
                alt="logo"
                layout="responsive"
              />
            </div>
            <div className={styles.hexbaneContainer}>
              <p className={styles.title2}>
                Built using HEXBANE 🐦‍🔥 Architecture
              </p>
              <a
                href="https://github.com/shivaraj65/hexbane"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit HEXBANE
              </a>
              <p className={styles.description2}>--Still under Development--</p>
              <p className={styles.description3}>
                Author : Shivaraj [Team Lead]
              </p>
              <p className={styles.description2}>
                Hexbane is a development accelerator module to spin up a
                application in a very quick duration of time
              </p>
            </div>
          </div>
        </section>
        <section className={styles.section3}>
          <p className={styles.title}>Meet the Minds Behind DataCompass</p>
          <div className={styles.mindsContainer}>
            <div className={styles.authorCard}>
              <Image
                className={styles.broImage}
                src={Bro1}
                alt="Hero Illustration"
                layout="responsive"
              />
              <div className={styles.Content}>
                <p className={styles.title}>Shivaraj - Dev Sorcerer</p>
                <p className={styles.description}>
                  Orchestrates the entire app development, from backend logic to
                  front-end magic.
                </p>
              </div>
            </div>
            <div className={styles.authorCard}>
              <div className={styles.Content}>
                <p className={styles.title}>kishore - Experience Alchemist</p>
                <p className={styles.description}>
                  Crafts engaging user journeys, blending design and
                  functionality seamlessly.
                </p>
              </div>
              <Image
                className={styles.broImage}
                src={Bro2}
                alt="Hero Illustration"
                layout="responsive"
              />
            </div>
            <div className={styles.authorCard}>
              <Image
                className={styles.broImage}
                src={Bro3}
                alt="Hero Illustration"
                layout="responsive"
              />
              <div className={styles.Content}>
                <p className={styles.title}>Uvais - Data Whisperer</p>
                <p className={styles.description}>
                  Tames and integrates data, ensuring it speaks perfectly with
                  the LLM.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section4}>
          <p className={styles.title}>Get Started with DataCompass</p>
          <div className={styles.cta}>
            <div className={styles.text}>
              <p>
                Ready to transform your data journey? Follow these simple steps
                to get started with DataCompass and unlock the full potential of
                your data with our cutting-edge LLM technology.
              </p>
              <p>
                <span className={styles.badge}>Ready to Begin?</span> Sign Up
                Now and start your journey with DataCompass today. Empower your
                data, make smarter decisions, and achieve your goals with ease.
              </p>
            </div>

            <div className={styles.buttonContainer}>
              <Button
                type="primary"
                ghost
                className={styles.buttons}
                onClick={() => router.push("/signup")}
              >
                Signup
              </Button>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.contactsContainer}>
          <img src={appInfo?.logo} className={styles.appLogo} />
          <div className={styles.mediaIconsContainer}>
            <MailOutlined className={styles.mediaIcons} />
            <GithubOutlined className={styles.mediaIcons} />
            <LinkedinOutlined className={styles.mediaIcons} />
          </div>
        </div>
        <p className={styles.madeIn}>
          Made with 💖 in INDIA | Built with HEXBANE 🐦‍🔥
        </p>
        <p className={styles.copyRText}>
          Copyright © Then, Now & Forever - Team CuriosityEngine
        </p>
      </footer>
    </div>
  );
};

export default Landing;
