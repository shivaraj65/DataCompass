import React, {
    useEffect,
    useState,
  } from "react";
  import { homeConfig } from "@/config.js/compConfig";
  import config from "@/config.js/appConfig";
  import FullscreenLoader from "@/components/ui/fullscreenLoader";
  import ErrorPage from "@/components/ui/errorPage";
  
  const Home: React.FC = () => {    
  
    const [Component, setComponent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      // Dynamically import the component based on the configuration
      const loadComponent = async () => {
        setLoading(true);
        try {
          // Ensure the config returns a promise resolving to a module with a default export
          const { default: LoadedComponent } = await homeConfig[config.home]();
          setComponent(() => LoadedComponent);
        } catch (err) {
          setError(err as Error); // Cast the error to the Error type
        } finally {
          setLoading(false);
        }
      };
      loadComponent();
    }, []);
  
    if (loading) {
      return <FullscreenLoader />;
    }
  
    if (error) {      
      return <ErrorPage message={error?.message} prefixText ="I have bad news for you" title={error?.name} />;
    }
  
    return (
      <React.Fragment>
        <Component />
      </React.Fragment>
    );
  };
  
  export default Home;
  