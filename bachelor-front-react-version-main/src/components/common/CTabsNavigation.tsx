import CButtonSecondary from "./CButtonSecondary";

interface Props {
  tabs: { selected: boolean; name: string }[];
  onTabSelected: (tab: { selected: boolean; name: string }) => void;
  className?: string;
}

function CTabsNavigation(props: Props) {
  const { tabs, onTabSelected, className = "" } = props;

  return (
    <div className={className + " flex flex-row gap-3 flex-wrap"}>
      {tabs.map((tab, index) => (
        <div key={index}>
          {tab.selected ? (
            <span className="block c-text-12 text-mid-gray cursor-default">{tab.name}</span>
          ) : (
            <CButtonSecondary type="button" onClick={() => onTabSelected(tab)} text={tab.name}></CButtonSecondary>
          )}
        </div>
      ))}
    </div>
  );
}

export default CTabsNavigation;
