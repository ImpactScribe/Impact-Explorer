interface Tabprops {
  name: string;
  activeTab?: string;
  className?: string;
  image?: string;
  setActiveTab?: (name: string) => void;
}
function Tab({ name, activeTab, setActiveTab, className, image }: Tabprops) {
  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={`${
        activeTab == name
          ? "lg:h-[250px] md:h-[220px] h-[100%] z-10 border-2 bg-sky-600 shadow"
          : `lg:h-[200px] md:h-[170px] h-[80%] ${className} bg-gray-500 opacity-75 backdrop-blur`
      }  rounded-[20px] lg:w-[170px] w-[28%] md:w-[150px] bg-cover`}
      onClick={() => setActiveTab && setActiveTab(name)}
    ></div>
  );
}

export default Tab;
