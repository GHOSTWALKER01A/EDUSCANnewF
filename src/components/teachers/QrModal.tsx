
import React from "react";
import QRCode from "react-qr-code";
import type { QRSession } from "../../types/class.types";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

type Props = {
  open: boolean;
  session: { sessionId: string; token: string; classId: string; totpSecret?: string } | null;
  onEnd: () => Promise<void>;
  onClose: () => void;
};

export default function QRCodeModal({ open, session, onEnd, onClose }: Props) {
  const handleEnd = async () => {
    await onEnd();
  };

  return (
    <Modal open={open} onClose={onClose} title="QR Live Session">
      <div className="flex flex-col items-center gap-4">
        {session ? (
          <>
            <div className="bg-white p-4 rounded">
              <QRCode value={JSON.stringify({ qrToken: session.token, lectureId: session.classId })} size={240} />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">Session ID: {session.sessionId}</p>
            {session.totpSecret && (
              <p className="text-sm font-bold text-[var(--accent)] mt-2">
                Use Teacher Attendance Dashboard to display rotating code.
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button className="bg-[var(--accent)] text-[var(--bg-primary)]" onClick={handleEnd}>End QR</Button>
              <Button className="border border-[var(--accent)] text-[var(--accent)]" onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <p className="text-[var(--text-secondary)]">No QR session active.</p>
        )}
      </div>
    </Modal>
  );
}
