import { closeSSE, connectSSE } from "@/services/sse-service";
import { useAuthStore } from "@/stores/AuthenticationStore";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import NotificationPopup from "./components/notification/NotificationPopup";
import { routes } from "./routes/routes";

function App() {
  const authStore = useAuthStore();

  const isLogined = useMemo(() => authStore.isAuthenticated(), [authStore]);
  const currentRouting = useMemo(() => {
    return isLogined ? "logined" : "unlogined";
  }, [isLogined]);

  const renderedRoute = useRoutes(routes[currentRouting]);

  const location = useLocation();
  const nodeRef = useRef(null);

  useEffect(() => {
    if (isLogined) {
      console.log("Attempting to connect SSE...");
      connectSSE();
    }

    // 컴포넌트 언마운트 시 또는 로그아웃 시 SSE 연결 종료
    return () => {
      console.log("Closing SSE connection from App cleanup...");
      closeSSE();
    };
  }, [isLogined]);

  return (
    <>
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
      <NotificationPopup />
    </>
  );
}

export default App;
