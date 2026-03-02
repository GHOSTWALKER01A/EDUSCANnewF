
import React from "react";
import Modal from "../UI/Modal";
import type { StudentListItem } from "../../types/class.types";

type Props = {
  open: boolean;
  students: StudentListItem[] | null;
  onClose: () => void;
};

export default function StudentsModal({ open, students, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Students">
      <div className="overflow-auto max-h-[60vh]">
        {students && students.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Reg No</th>
                <th className="text-left">Name</th>
                <th className="text-left">Present</th>
                <th className="text-left">Method</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{s.regNo}</td>
                  <td>{s.name}</td>
                  <td>{s.present ? "Yes" : "No"}</td>
                  <td>{s.method || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[var(--text-secondary)]">No students found.</p>
        )}
      </div>
    </Modal>
  );
}
