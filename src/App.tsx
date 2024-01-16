import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { StacApiProvider } from "@developmentseed/stac-react";
import theme from "./theme";
import StacAdmin from "./StacAdmin";
import SignIn from "./components/SignIn";


export const App = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const signInComp = <SignIn setIsLoggedIn={setIsLoggedIn} />;

  return (
    <ChakraProvider theme={theme}>
      <StacApiProvider apiUrl={process.env.REACT_APP_STAC_API!}> {/* eslint-disable-line @typescript-eslint/no-non-null-assertion */}
        <StacAdmin isLoggedIn={isLoggedIn} SignIn={signInComp} logout={() => setIsLoggedIn(false)} />
      </StacApiProvider>
    </ChakraProvider>
  );
};
