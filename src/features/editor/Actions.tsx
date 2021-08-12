import * as React from "react";
import { Button } from "@awsui/components-react";
import { useCallback, useState, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";

interface Props {
  onRun: () => Promise<void>;
  onSave?: () => void;
  onClear: () => void;
}

export function Actions(props: Props): JSX.Element {
  const { onRun, onSave, onClear } = props;
  const [loading, setLoading] = useState(false);
  const [{ ledger }] = useContext(AppStateContext);

  const handleRun = useCallback(async () => {
    setLoading(true);
    try {
      await onRun();
    } finally {
      setLoading(false);
    }
  }, [onRun]);

  return (
    <div className="editor-actions">
      <Button
        loading={loading}
        disabled={!ledger}
        variant="primary"
        iconName="caret-right-filled"
        onClick={handleRun}
      >
        Run
      </Button>
      <Button disabled={!onSave} variant="normal" onClick={onSave}>
        Save
      </Button>
      <Button variant="normal" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
