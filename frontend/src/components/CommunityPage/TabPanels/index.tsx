import About from "./About";
import Challenges from "./Challenges";
import Chats from "./Chats";
import Events from "./Events";
import Members from "./Members";

export default function TabPanels({
  activeTab = "",
  spaceIdOrId,
  description,
}: {
  activeTab: string;
  spaceIdOrId: string;
  description: string;
}) {
  switch (activeTab) {
    case "":
      return <About spaceIdOrId={spaceIdOrId} description={description} />;
      break;
    case "members":
      return <Members spaceIdOrId={spaceIdOrId} />;
      break;
    case "events":
      return <Events spaceIdOrId={spaceIdOrId} />;
      break;
    case "challenges":
      return <Challenges spaceIdOrId={spaceIdOrId} />;
      break;
    case "chats":
      return <Chats spaceIdOrId={spaceIdOrId} />;
      break;

    default:
      return <About spaceIdOrId={spaceIdOrId} description={description}/>;
      break;
  }
  return <></>;
}
