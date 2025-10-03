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
import { getUserOrThrow } from "../lib/hooks";

type Props = {
  open: boolean;
  onClose: () => void;
  companyId: string; // ✅ added
};

export default function JobEditorModal({ open, onClose, companyId }: Props) {
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

  const submit = async () => {
    setError(null);
    try {
      const user = await getUserOrThrow();

      const { error: insertError } = await supabase.from("jobs").insert({
        title: form.title,
        description: form.description,
        employment_type: form.employment_type as any,
        location_type: form.location_type as any,
        location_text: form.location_text,
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        min_salary: form.min_salary ? Number(form.min_salary) : null,
        max_salary: form.max_salary ? Number(form.max_salary) : null,
        currency: "NGN",
        is_active: true,
        created_by: user.id,
        company_id: companyId, // ✅ link job to company
      });

      if (insertError) throw insertError;

      onClose(); // ✅ Close on success
    } catch (e: any) {
      setError(e.message);
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
        <Button onClick={submit}>Publish</Button>
        <Button color="light" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
