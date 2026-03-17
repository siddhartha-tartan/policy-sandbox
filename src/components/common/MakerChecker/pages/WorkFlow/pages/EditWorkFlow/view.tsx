import { useParams } from "react-router-dom";
import AddWorkFlow from "../AddWorkFlow/view";

const EditWorkFlow = () => {
  const { id } = useParams();
  return id ? <AddWorkFlow id={id} /> : null;
};

export default EditWorkFlow;
