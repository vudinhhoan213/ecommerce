import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Card,
  Avatar,
  Descriptions,
  Typography,
  Spin,
  Result,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  HomeOutlined,
  BankOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { RootState } from "../../store/store";
import PageContainer from "../../components/common/PageContainer";
import styles from "./ProfilePage.module.css";

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { userData, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return <Result status="warning" title={t("profile.notLoggedIn")} />;
  }

  const genderIcon =
    userData.gender === "male" ? <ManOutlined /> : <WomanOutlined />;
  const genderColor = userData.gender === "male" ? "blue" : "magenta";

  return (
    <PageContainer title={t("profile.title")}>
      <Card className={styles.headerCard} bordered={false}>
        <div className={styles.headerContent}>
          <Avatar
            size={80}
            src={userData.image || userData.avatar}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <div className={styles.headerText}>
            <Title level={3} style={{ margin: 0 }}>
              {userData.name}
            </Title>
            <Text type="secondary">
              <MailOutlined style={{ marginRight: 6 }} />
              {userData.email}
            </Text>
            {userData.phone && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary">
                  <PhoneOutlined style={{ marginRight: 6 }} />
                  {userData.phone}
                </Text>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card
        title={t("profile.personalInfo")}
        className={styles.infoCard}
        bordered={false}
      >
        <Descriptions column={1} colon={false} layout="horizontal">
          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined style={{ marginRight: 8 }} />
                {t("profile.dateOfBirth")}
              </span>
            }
          >
            {userData.dob || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                {genderIcon}
                <span style={{ marginLeft: 8 }}>{t("profile.gender")}</span>
              </span>
            }
          >
            <Tag color={genderColor}>
              {userData.gender === "male"
                ? t("profile.male")
                : t("profile.female")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <BankOutlined style={{ marginRight: 8 }} />
                {t("profile.companyAddress")}
              </span>
            }
          >
            {userData.companyAddress || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <HomeOutlined style={{ marginRight: 8 }} />
                {t("profile.homeAddress")}
              </span>
            }
          >
            {userData.homeAddress || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default ProfilePage;
