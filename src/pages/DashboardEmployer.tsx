/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSession } from "../lib/hooks";
import { supabase } from "../api/supabase";
import { Card, Label, TextInput, Button, Alert } from "flowbite-react";
import JobEditorModal from "../components/JobEditorModal";

export default function DashboardEmployer() {
  const { user } = useSession();

  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  // Load company if exists
  useEffect(() => {
    if (!user) return;

    (async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
        .eq("created_by", user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setCompanyId(data.id);
        setCompanyName(data.name);
      }
    })();
  }, [user]);

  // Create company
  const createCompany = async () => {
    setError(null);

    try {
      if (!companyName.trim()) throw new Error("Enter company name");

      const {
        data: { user: u },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!u) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("companies")
        .insert({ name: companyName, created_by: u.id })
        .select("*")
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCompanyId(data.id);
        setCompanyName(data.name);
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Guard: user not signed in
  if (!user)
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Sign in to access Employer Dashboard.
      </p>
    );

  return (
    <div className="space-y-4">
      {/* My Company Card */}
      <Card>
        <h2 className="text-xl font-semibold dark:text-white">My Company</h2>

        {!companyId ? (
          <div className="grid items-end gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label>Company name</Label>
              <TextInput
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <Button onClick={createCompany}>Create</Button>
            {error && (
              <div className="md:col-span-3">
                <Alert color="failure">{error}</Alert>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{companyName}</p>
        )}
      </Card>

      {/* Jobs Card */}
      {companyId && (
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-white">Jobs</h3>
            <Button onClick={() => setModal(true)}>Post a job</Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your job postings.
          </p>
        </Card>
      )}

      {/* Job Editor Modal */}
      <JobEditorModal
        open={modal}
        onClose={() => setModal(false)}
        companyId={companyId}
      />
    </div>
  );
}
