/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Alert,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";
import { supabase } from "../api/supabase";
import { useAuth } from "../lib/AuthProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  companyId: string;
};

// Utility: detect RLS/permission-ish errors without relying on .status
function isRlsOrPermissionError(err: any) {
  const code = String(err?.code ?? "").toUpperCase(); // e.g., "42501", "PGRST301"
  const blob = `${err?.message ?? ""} ${err?.details ?? ""} ${
    err?.hint ?? ""
  }`.toLowerCase();
  return (
    code === "42501" || // insufficient_privilege (PG)
    code === "PGRST301" || // typical PostgREST RLS code
    /row[- ]level security|rls|policy|permission denied|insufficient privilege|not allowed/.test(
      blob
    )
  );
}

export default function JobEditorModal({ open, onClose, companyId }: Props) {
  const { session } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    employment_type: "full-time",
    location_type: "onsite",
    location_text: "",
    min_salary: "",
    max_salary: "",
    tags: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);

    if (!session?.user) {
      setError("You must be signed in to post a job.");
      return;
    }

    setBusy(true);
    try {
      const tags = form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const min_salary = form.min_salary ? Number(form.min_salary) : null;
      const max_salary = form.max_salary ? Number(form.max_salary) : null;

      const { data, error } = await supabase
        .from("jobs")
        .insert([
          {
            company_id: companyId,
            title: form.title,
            description: form.description,
            employment_type: form.employment_type as any,
            location_type: form.location_type as any,
            location_text: form.location_text,
            min_salary,
            max_salary,
            currency: "NGN",
            tags,
            is_active: true,
            created_by: session.user.id, // per instruction
          },
        ])
        .select()
        .single();

      if (error) {
        if (isRlsOrPermissionError(error)) {
          setError("You’re not allowed to post for this company.");
        } else {
          setError(error.message ?? "Failed to post job.");
        }
        return;
      }

      // success
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to post job.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal show={open} size="lg" onClose={onClose}>
      <ModalHeader>Post a job</ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          {/* ---- Title ---- */}
          <div>
            <Label>Title</Label>
            <TextInput
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* ---- Description ---- */}
          <div>
            <Label>Description</Label>
            <Textarea
              rows={6}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          {/* ---- Job details ---- */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <Label>Employment type</Label>
              <Select
                value={form.employment_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, employment_type: e.target.value }))
                }
              >
                <option>full-time</option>
                <option>part-time</option>
                <option>contract</option>
                <option>internship</option>
              </Select>
            </div>

            <div>
              <Label>Location type</Label>
              <Select
                value={form.location_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_type: e.target.value }))
                }
              >
                <option>onsite</option>
                <option>hybrid</option>
                <option>remote</option>
              </Select>
            </div>

            <div>
              <Label>City / Country</Label>
              <TextInput
                value={form.location_text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location_text: e.target.value }))
                }
              />
            </div>
          </div>

          {/* ---- Salary + Tags ---- */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <Label>Min Salary</Label>
              <TextInput
                type="number"
                value={form.min_salary}
                onChange={(e) =>
                  setForm((f) => ({ ...f, min_salary: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Max Salary</Label>
              <TextInput
                type="number"
                value={form.max_salary}
                onChange={(e) =>
                  setForm((f) => ({ ...f, max_salary: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <TextInput
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="react, typescript, node"
              />
            </div>
          </div>

          {/* ---- Error ---- */}
          {error && <Alert color="failure">{error}</Alert>}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button onClick={submit} disabled={busy}>
          {busy ? "Publishing..." : "Publish"}
        </Button>
        <Button color="light" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
