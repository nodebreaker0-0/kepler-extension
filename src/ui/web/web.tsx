import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";

import {
  HashRouter,
  Route,
  RouteComponentProps,
  Redirect
} from "react-router-dom";

import { StoreProvider, useStore } from "./stores";

import "./styles/global.scss";
import { Header } from "./components/header";
import { observer } from "mobx-react";
import { configure } from "mobx";
import {
  NotificationProvider,
  NotificationStoreProvider
} from "../components/notification";

import Modal from "react-modal";

import { SupportedChainWalletUIs } from "./supported-chain";

configure({
  enforceActions: "always" // Make mobx to strict mode.
});

const Wallet: FunctionComponent<RouteComponentProps<{
  chainId: string;
  path?: string;
}>> = observer(props => {
  const { chainStore, walletUIStore } = useStore();
  const { match } = props;
  chainStore.setChain(match.params.chainId);
  walletUIStore.setPath(match.params.path);

  if (!walletUIStore.currentMenu) {
    throw new Error("Invalid url");
  }

  const Section = walletUIStore.currentMenu.sectionRender;

  return (
    <div
      className="columns is-gapless"
      style={{ height: "100%", marginBottom: 0 }}
    >
      {/*<div
        className={classnames(
          "column",
          "is-2-widescreen",
          "is-3",
          style.sidebar
        )}
      >
        <Sidebar>
          {walletUIStore.walletUI.menus.map((menu, i) => {
            const MenuItem = menu.menuItemRender;
            const to = `/${walletUIStore.walletUI.chainId}${
              menu.path ? `/${menu.path}` : ""
            }`;
            return (
              <MenuItem
                active={walletUIStore.path === menu.path}
                to={to}
                key={i.toString()}
              />
            );
          })}
        </Sidebar>
      </div>*/}
      {/* This is just fake column.
       This is needed because `sidebar` has fixed position when not mobile screen.
       So, it can't occupy the width of column.
       This will take the place of the sidebar. */}
      <div className="column is-2-widescreen is-0" />
      <div className="column is-8-widescreen is-12">
        <Header />
        <div>
          <Section />
        </div>
      </div>
    </div>
  );
});

const RedirectRoute: FunctionComponent = () => {
  return <Redirect to={`/${SupportedChainWalletUIs[0].chainId}`} />;
};

const Router: FunctionComponent = () => {
  return (
    <HashRouter>
      <Route path="/:chainId/:path" component={Wallet} />
      <Route path="/:chainId" exact component={Wallet} />
      <Route path="/" exact component={RedirectRoute} />
    </HashRouter>
  );
};

Modal.setAppElement("#app");
Modal.defaultStyles = {
  content: {
    ...Modal.defaultStyles.content,
    minWidth: "300px",
    maxWidth: "600px",
    minHeight: "250px",
    maxHeight: "500px",
    left: "50%",
    right: "auto",
    top: "50%",
    bottom: "auto",
    transform: "translate(-50%, -50%)"
  },
  overlay: {
    ...Modal.defaultStyles.overlay
  }
};

ReactDOM.render(
  <StoreProvider>
    <NotificationStoreProvider>
      <NotificationProvider>
        <Router />
      </NotificationProvider>
    </NotificationStoreProvider>
  </StoreProvider>,
  document.getElementById("app")
);
