import ErrorPage from "@/components/ui/errorPage";
import { userInfotypes } from "@/utils/types/appTypes";

interface props {
  userInfo: userInfotypes;
}

const Notifications = ({userInfo}:props) => {
  return (
    <div>
      <ErrorPage
        title="🚧 Notifications Page 🚧"
        prefixText ="This feature is not live yet"
        message="Stay tuned! Coming soon ⏱️"
      />
    </div>
  );
};

export default Notifications;
