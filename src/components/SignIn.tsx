import { Button } from "@chakra-ui/react";

type SignInProps = {
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

function SignIn({ setIsLoggedIn }: SignInProps) {
  return (
    <>
      <h1>Sign in</h1>
      <Button type="button" onClick={() => setIsLoggedIn(true)}>Sign in</Button>
    </>
  );
}

export default SignIn;
