import { Link } from "react-router-dom";
import { listMenuHeader } from "../utils/listMenuHeader";
const HeaderComponent = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-8 w-full">
      <h1>Logo</h1>
      <ul className="flex gap-5">
        {listMenuHeader &&
          listMenuHeader.map((item, index) => {
            return (
              <li key={index} className="capitalize">
                <Link to={item.link}>{item.path}</Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};

export default HeaderComponent;
