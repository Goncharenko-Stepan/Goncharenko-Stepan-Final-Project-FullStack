import home from "../../assets/navIcons/homeIcons/home.svg";
import homeFill from "../../assets/navIcons/homeIcons/home_fill.svg";
import search from "../../assets/navIcons/searchIcons/search.svg";
import searchFill from "../../assets/navIcons/searchIcons/search_fill.svg";
import explore from "../../assets/navIcons/exploreIcons/explore.svg";
import exploreFill from "../../assets/navIcons/exploreIcons/explore_fill.svg";
import messages from "../../assets/navIcons/messageIcons/messages.svg";
import messagesFill from "../../assets/navIcons/messageIcons/messages_fill.svg";
import notifications from "../../assets/navIcons/notificationIcons/notifications.svg";
import notificationsFill from "../../assets/navIcons/notificationIcons/notifications_fill.png";
import create from "../../assets/navIcons/createIcons/create.svg";
import createFill from "../../assets/navIcons/createIcons/create_fill.svg";

const links = [
  {
    name: "Home",
    href: "/",
    logo: home,
    logoFill: homeFill,
  },
  ,
  { name: "Search", href: "/search", logo: search, logoFill: searchFill },

  { name: "Explore", href: "/explore", logo: explore, logoFill: exploreFill },

  {
    name: "Messages",
    href: "/messages",
    logo: messages,
    logoFill: messagesFill,
  },

  {
    name: "Notifications",
    href: "/notifications",
    logo: notifications,
    logoFill: notificationsFill,
  },

  {
    name: "Create",
    href: "/create",
    logo: create,
    logoFill: createFill,
  },
];

export default links;
