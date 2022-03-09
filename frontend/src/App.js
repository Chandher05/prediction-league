import Routes from "./Providers/Routes";
import { useStoreRehydrated, StoreProvider } from "easy-peasy";
import { store } from './Providers/Store';
import { Center, CircularProgress } from "@chakra-ui/react";

function WaitForStateRehydration({ children }) {
  const isRehydrated = useStoreRehydrated();
  return isRehydrated
    ? children
    : (<Center>
      <CircularProgress isIndeterminate color="green.300" />
    </Center>);
}





function App() {
  return (
    <div >
      <StoreProvider store={store}>
        <WaitForStateRehydration>
          <Routes></Routes>
        </WaitForStateRehydration>
      </StoreProvider>

    </div>
  );
}

export default App;
