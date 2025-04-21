import { useModal } from "./Providers/ModalProvider";
import ListModal from "./Modals/ListModal";
import SettingsModal from "./Modals/SettingsModal";

function Footer() {
  const { openModal } = useModal();

  return (<>
    <div className="footer">
      <BracketButton value="Lists" onClick={() => openModal(<ListModal />, "Lists")} />
      <BracketButton value="Settings" onClick={() => openModal(<SettingsModal />, "Settings")} />
    </div>
  </>)
}

function BracketButton(
  { value,
    onClick
  }: {
    value: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }
) {
  return (
    <span>{"["}<button className="transparent-btn blue mr-1ch ml-1ch" onClick={onClick}>{value}</button>{"]"}</span>
  )
}

export default Footer;