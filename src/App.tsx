import { useMemo, useRef } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./App.css";
import { routes } from "./routes/routes";
import { useAuthStore } from "./stores/AuthenticationStore";

function App() {
  const authStore = useAuthStore();

  const isLogined = useMemo(() => authStore.isAuthenticated(), [authStore]);
  const currentRouting = useMemo(() => {
    return isLogined ? "logined" : "unlogined";
  }, [isLogined]);

  const renderedRoute = useRoutes(routes[currentRouting]);

  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode={"out-in"}>
      <CSSTransition
        key={`${location.pathname}-${currentRouting}`}
        classNames={"scale"}
        timeout={300}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div className={"h-full"} ref={nodeRef}>
          {renderedRoute}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default App;
