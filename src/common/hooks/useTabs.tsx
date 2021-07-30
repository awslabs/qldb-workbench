import { Button, Tabs } from "@awsui/components-react";
import * as React from "react";
import { ReactNode, useCallback, useState } from "react";

interface Tab {
  id: string;
  label: ReactNode;
  value?: string;
  closed?: boolean;
}

interface Tabs {
  [id: string]: Tab;
}

export function useTabs(): [ReactNode, string, (content: string) => void] {
  const [activeTab, setActiveTab] = useState("query1");
  const [tabs, setTabs] = useState<Tabs>({
    query1: {
      id: "query1",
      label: "Query 1",
    },
  });

  const handleTabChange = useCallback(
    (e) => {
      if (e.detail.activeTabId !== "new") {
        setActiveTab(e.detail.activeTabId);
        return;
      }

      e.preventDefault();

      setTabs((tabs) => {
        const newTab = {
          label: `Query ${Object.keys(tabs).length + 1}`,
          id: `query${Object.keys(tabs).length + 1}`,
        };

        setActiveTab(newTab.id);

        return {
          ...tabs,
          [newTab.id]: newTab,
        };
      });
    },
    [setTabs, setActiveTab]
  );

  const changeTabContent = useCallback(
    (content: string) => {
      setTabs((tabs) => ({
        ...tabs,
        [activeTab]: {
          ...tabs[activeTab],
          value: content,
        },
      }));
    },
    [activeTab]
  );

  const decorateWithCloseButton = useCallback(
    (tabs: Tab[]): Tab[] => {
      const tabWithCloseButton = (tab: Tab): Tab => {
        const label = (
          <div>
            <span style={{ marginRight: "10px" }}>{tab.label}</span>{" "}
            <Button
              iconName="close"
              variant="icon"
              onClick={() =>
                setTabs((tabs) => {
                  const updatedTabs = {
                    ...tabs,
                    [tab.id]: { ...tabs[tab.id], closed: true },
                  };
                  setActiveTab(
                    Object.values(updatedTabs)
                      .reverse()
                      .find((t) => !t.closed)?.id ?? ""
                  );

                  return updatedTabs;
                })
              }
            />
          </div>
        );

        return { ...tab, label };
      };

      return tabs.filter((tab) => !tab.closed).map(tabWithCloseButton);
    },
    [setTabs, setActiveTab]
  );

  const tabsComponent = (
    <Tabs
      className="editor-tabs"
      activeTabId={activeTab}
      onChange={handleTabChange}
      tabs={[
        ...decorateWithCloseButton(Object.values(tabs)),
        {
          id: "new",
          label: <Button className="new-tab-button" iconName="add-plus" />,
        },
      ]}
      variant="container"
    />
  );

  return [tabsComponent, tabs[activeTab]?.value ?? "", changeTabContent];
}
