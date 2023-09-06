interface Tabprops {
  name: string;
  activeTab?: string;
  className?: string;
  setActiveTab?: (name: string) => void;
}
function Tab({ name, activeTab, setActiveTab, className }: Tabprops) {
  return (
    <div
      className={`${
        activeTab == name
          ? "lg:h-[250px] h-[100%] z-10 border-2"
          : `lg:h-[220px] h-[80%] ${className}`
      }  rounded-[20px] lg:w-[180px] w-[28%] bg-sky-600`}
      onClick={() => setActiveTab && setActiveTab(name)}
    ></div>
  );
}

export default Tab;
