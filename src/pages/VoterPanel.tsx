
import { ApprovedVoterInterface } from "@/components/ApprovedVoterInterface";
import { useNavigate } from "react-router-dom";

export const VoterPanel = () => {
  const navigate = useNavigate();

  return (
    <ApprovedVoterInterface onBack={() => navigate('/')} />
  );
};

export default VoterPanel;
