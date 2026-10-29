import { listMenuSidebar } from "../../utils/listMenuSidebar";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className="max-w-2/12 w-full bg-blue-500 min-h-screen  py-10 px-5 text-slate-50">
      <div>
        <h1 className=" text-md">Admin Dashboard</h1>
      </div>
      <ul className="mt-8">
        {listMenuSidebar.map((item, index) => {
          return (
            <div className="py-4 cursor-pointer" key={index}>
              <li>
                <Link to={item.link}>{item.title}</Link>
              </li>
            </div>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
