import useModal from "../lib/hooks/useModal";
import ListModal from "./Modals/ListModal";
import SettingsModal from "./Modals/SettingsModal";

function Footer() {
  const { modal: listModal, setShowModal: showListModal } = useModal(<ListModal />, "Lists");
  const { modal: settingsModal, setShowModal: showSettingsModal } = useModal(<SettingsModal />, "Settings");

  return (<>
    <div className="footer">
      <BracketButton value="Lists" onClick={() => showListModal(true)} />
      <BracketButton value="Settings" onClick={() => showSettingsModal(true)} />
    </div>
    {listModal}
    {settingsModal}
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