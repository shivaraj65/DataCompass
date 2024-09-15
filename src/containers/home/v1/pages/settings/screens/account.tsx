import ErrorPage from "@/components/ui/errorPage";
import { userInfotypes } from "@/utils/types/appTypes";

interface props {
  userInfo: userInfotypes;
}

const Account = ({userInfo}:props) => {
  return (
    <div>
      <ErrorPage
        title="🚧 Account Page 🚧"
        prefixText="This feature is not live yet"
        message="Stay tuned! Coming soon ⏱️"
      />
    </div>
  );
};

export default Account;
