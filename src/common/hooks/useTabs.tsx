import { Icon, Tabs } from "@awsui/components-react";
import * as React from "react";
import { ReactNode, useCallback, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";

interface Tab {
  id: string;
  label: ReactNode;
  content?: string;
  closed?: boolean;
}

interface Tabs {
  [id: string]: Tab;
}

export interface TabState {
  activeTab: string;
  allTabs: Tabs;
}

export function useTabs(): {
  tabsComponent: JSX.Element;
  content: string;
  changeTabContent: (content: string) => void;
  createNewTab: (tab?: Partial<Tab> | undefined) => void;
} {
  const [
    {
      tabs: { activeTab, allTabs },
    },
    setAppState,
  ] = useContext(AppStateContext);

  const setTabs = useCallback(
    (setTabs: (tabs: TabState) => TabState) => {
      setAppState((state) => ({ ...state, tabs: setTabs(state.tabs) }));
    },
    [setAppState]
  );

  const createNewTab = useCallback(
    (tab?: Partial<Tab>) =>
      setTabs(({ allTabs }) => {
        const tabNumber = Object.keys(allTabs).length + 1;
        const newTab: Tab = {
          id: `query${tabNumber}`,
          label: `Query ${tabNumber}`,
          ...tab,
        };

        return {
          activeTab: newTab.id,
          allTabs: { ...allTabs, [newTab.id]: newTab },
        };
      }),
    [setTabs]
  );

  const handleTabChange = useCallback(
    (e) => {
      const tabId = e.detail.activeTabId;

      if (tabId !== "new") {
        setTabs((tabs) => ({
          ...tabs,
          activeTab: tabs.allTabs[tabId].closed ? tabs.activeTab : tabId,
        }));
        return;
      }

      e.preventDefault();

      createNewTab();
    },
    [createNewTab, setTabs]
  );

  const changeTabContent = useCallback(
    (content: string) => {
      setTabs((tabs) => ({
        ...tabs,
        allTabs: {
          ...tabs.allTabs,
          [tabs.activeTab]: {
            ...tabs.allTabs[tabs.activeTab],
            content: content,
          },
        },
      }));
    },
    [setTabs]
  );

  const handleCloseTab = useCallback(
    (tab: Tab) => () => {
      setTabs(({ activeTab, allTabs }) => ({
        activeTab:
          activeTab === tab.id
            ? Object.values(allTabs)
                .reverse()
                .find((t) => !t.closed && t.id !== tab.id)?.id ?? ""
            : activeTab,
        allTabs: {
          ...allTabs,
          [tab.id]: { ...allTabs[tab.id], closed: true },
        },
      }));
    },
    [setTabs]
  );

  const decorateWithCloseButton = useCallback(
    (tabs: Tab[]): Tab[] => {
      const tabWithCloseButton = (tab: Tab): Tab => {
        const label = (
          <div>
            <span>{tab.label}</span>{" "}
            {tabs.filter((t) => !t.closed).length > 1 && (
              <span className="close-btn" onClick={handleCloseTab(tab)}>
                <Icon name="close" />
              </span>
            )}
          </div>
        );

        return { ...tab, label };
      };

      return tabs.filter((tab) => !tab.closed).map(tabWithCloseButton);
    },
    [handleCloseTab]
  );

  const tabsComponent = (
    <Tabs
      className="editor-tabs"
      activeTabId={activeTab}
      onChange={handleTabChange}
      tabs={[
        ...decorateWithCloseButton(Object.values(allTabs)),
        {
          id: "new",
          label: <Icon className="new-tab-button" name="add-plus" />,
        },
      ]}
      variant="container"
    />
  );

  return {
    tabsComponent,
    content: allTabs[activeTab]?.content ?? "",
    changeTabContent,
    createNewTab,
  };
}
