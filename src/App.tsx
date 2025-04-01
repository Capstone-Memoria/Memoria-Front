import { useRef } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./App.css";
import { routes } from "./routes/routes";

function App() {
  const renderedRoute = useRoutes(routes);
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <SwitchTransition mode={"out-in"}>
      <CSSTransition
        key={location.pathname}
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
