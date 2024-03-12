import { useCallback } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { RaterMgmtSystem } from "../../../interfaces/dataset.interface";
import { updateConfiguration } from "../../../slices/datasetsSlice";
import ProlificForm from "./ProlificForm";

const RaterMgmtForm = ({
  system,
}: {
  system: RaterMgmtSystem,
}) => {
  const dispatch = useAppDispatch();

  const onChange = useCallback((newValue: any) => {
    dispatch(updateConfiguration({ key: system.toLowerCase(), value: newValue }));
  }, [dispatch, system]);

  if (system === RaterMgmtSystem.PROLIFIC) {
    return <ProlificForm onChange={onChange} />
  };

  return <></>;
};

export default RaterMgmtForm;