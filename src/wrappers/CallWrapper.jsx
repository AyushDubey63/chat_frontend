import Call from "../components/Call";
import { useStream } from "../context/StreamContext";
import Modal from "../ui/Modal";

const CallWrapper = () => {
  const { showCall, setShowCall } = useStream();
  return showCall ? (
    <Modal isOpen={showCall} onClose={() => setShowCall(false)}>
      <Call />
    </Modal>
  ) : null;
};

export default CallWrapper;
