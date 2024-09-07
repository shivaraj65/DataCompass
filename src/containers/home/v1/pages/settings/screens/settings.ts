import {
    FormatPainterOutlined,
    ThunderboltOutlined,
    UserOutlined,
    ProfileOutlined,
    CommentOutlined,
  } from "@ant-design/icons";
  import Account from './account';
  import Appearance from "./appearance";
  import Integrations from "./integrations";
  import Notifications from "./notifications";
  import Profile from "./profile";  

type SettingsCardItemType = {
  key: string;
  icon: any;
  title: string;
  description: string[];
  isShow: boolean;
  component:any;
};

export const cardItems: SettingsCardItemType[] = [
  {
    key: "Profile",
    icon: UserOutlined,
    title: "Profile",
    description: ["Update Profile Info", "Change Password"],
    isShow: true,
    component:Profile
  },
  {
    key: "Account",
    icon: ProfileOutlined,
    title: "Account",
    description: [" Privacy Settings", "Delete Account"],
    isShow: true,
    component:Account
  },
  {
    key: "Notifications",
    icon: CommentOutlined,
    title: "Notifications",
    description: ["Email Alerts", "Push Notifications"],
    isShow: true,
    component:Notifications
  },
  {
    key: "Appearance",
    icon: FormatPainterOutlined,
    title: "Appearance",
    description: ["Dark Mode / Light Mode Toggle", "Font Size and Style"],
    isShow: true,
    component:Appearance
  },
  {
    key: "Integrations",
    icon: ThunderboltOutlined,
    title: "Integrations & Connected Apps",
    description: ["Connected Apps and Services", "API Keys"],
    isShow: true,
    component:Integrations
  },
];
