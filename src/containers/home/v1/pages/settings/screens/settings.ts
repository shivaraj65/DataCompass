import {
  FormatPainterOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ProfileOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Account from "./account";
import Appearance from "./appearance";
import Integrations from "./integrations";
import Notifications from "./notifications";
import Profile from "./profile";

import ProfileIcon from "@/assets/illustrations/profile.png";
import AccountIcon from "@/assets/illustrations/account.png";
import NotificationIcon from "@/assets/illustrations/notifications.png";
import AppearanceIcon from "@/assets/illustrations/appearance.png";
import IntegrationsIcon from "@/assets/illustrations/integrations.png";

type SettingsCardItemType = {
  key: string;
  icon: any;
  title: string;
  description: string[];
  isShow: boolean;
  component: any;
};

export const cardItems: SettingsCardItemType[] = [
  {
    key: "Profile",
    icon: ProfileIcon,
    title: "Profile",
    description: ["Update Profile Info", "Change Password"],
    isShow: true,
    component: Profile,
  },
  {
    key: "Account",
    icon: AccountIcon,
    title: "Account",
    description: [" Privacy Settings", "Delete Account"],
    isShow: true,
    component: Account,
  },
  {
    key: "Notifications",
    icon: NotificationIcon,
    title: "Notifications",
    description: ["Email Alerts", "Push Notifications"],
    isShow: true,
    component: Notifications,
  },
  {
    key: "Appearance",
    icon: AppearanceIcon,
    title: "Appearance",
    description: ["Dark Mode / Light Mode Toggle", "Font Size and Style"],
    isShow: true,
    component: Appearance,
  },
  {
    key: "Integrations",
    icon: IntegrationsIcon,
    title: "Integrations & Connected Apps",
    description: ["Connected Apps and Services", "API Keys"],
    isShow: true,
    component: Integrations,
  },
];
