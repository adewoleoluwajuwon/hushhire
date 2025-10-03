import {
  Button,
  Dropdown,
  Avatar,
  DropdownItem,
  NavbarToggle,
  NavbarCollapse,
  NavbarBrand,
  Navbar,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../api/supabase";
import { useSession } from "../lib/hooks";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Briefcase,
  Search as SearchIcon,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

// ---- Props ----
type Props = {
  children: React.ReactNode;
};

// ---- Custom Hook: Dark mode toggle ----
function useDarkMode() {
  const toggle = useCallback(() => {
    const el = document.documentElement;
    const isDark = el.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);
  return toggle;
}

// ---- Utility: Active link matcher ----
function useActiveMatcher() {
  const { pathname } = useLocation();
  return useCallback(
    (to: string) => pathname === to || pathname.startsWith(`${to}/`),
    [pathname]
  );
}

export default function AppShell({ children }: Props) {
  const { user } = useSession();
  const nav = useNavigate();
  const toggleDark = useDarkMode();
  const isActive = useActiveMatcher();
  const [q, setQ] = useState("");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    nav("/auth");
  };

  const goSearch = useCallback(() => {
    const query = q.trim();
    if (query) nav(`/jobs?query=${encodeURIComponent(query)}`);
  }, [q, nav]);

  const brand = useMemo(
    () => (
      <Link to="/" className="group inline-flex items-center gap-2">
        <motion.span
          initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ rotate: 360 }}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
        >
          <Rocket className="h-4 w-4" />
        </motion.span>
        <span className="text-xl font-extrabold tracking-tight text-gray-900 transition-colors dark:text-white">
          HushHire
        </span>
      </Link>
    ),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50/60 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Sticky, glassy navbar */}
      <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/60">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <Navbar
            fluid
            rounded
            className="border-b border-gray-200/70 bg-transparent dark:border-gray-800/70"
          >
            {/* ---------- HEADER ROW (Desktop) ---------- */}
            <div className="flex w-full items-center gap-3">
              {/* Left: Brand */}
              <NavbarBrand as="div" className="shrink-0">
                {brand}
              </NavbarBrand>

              {/* Middle: Primary nav (desktop only) */}
              <nav className="ml-2 hidden min-w-0 flex-1 items-center justify-start md:flex">
                <ul className="flex flex-nowrap items-center gap-5">
                  <li>
                    <NavLink to="/jobs" isActive={isActive("/jobs")}>
                      Jobs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/companies" isActive={isActive("/companies")}>
                      Companies
                    </NavLink>
                  </li>
                  {/* Categories */}
                  <li className="relative">
                    <Dropdown
                      inline
                      label={<span className="text-sm">Categories</span>}
                    >
                      {[
                        { label: "Engineering", q: "engineering" },
                        { label: "Product", q: "product" },
                        { label: "Design", q: "design" },
                        { label: "Remote-friendly", q: "remote" },
                      ].map((c) => (
                        <DropdownItem
                          key={c.q}
                          as={Link}
                          to={`/jobs?category=${c.q}`}
                        >
                          {c.label}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </li>
                  {/* Resources */}
                  <li className="relative">
                    <Dropdown
                      inline
                      label={<span className="text-sm">Resources</span>}
                    >
                      <DropdownItem as={Link} to="/resources/interview-prep">
                        Interview Prep
                      </DropdownItem>
                      <DropdownItem as={Link} to="/resources/salary-guide">
                        Salary Guide
                      </DropdownItem>
                      <DropdownItem as={Link} to="/blog">
                        Blog
                      </DropdownItem>
                    </Dropdown>
                  </li>
                </ul>
              </nav>

              {/* Right: Search + actions (never shrink) */}
              <div className="ml-auto flex items-center gap-2 shrink-0">
                {/* Search (desktop) */}
                <div className="relative hidden items-center md:flex">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goSearch()}
                    placeholder="Search roles…"
                    className="w-72 lg:w-80 xl:w-96 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 pr-9 text-sm shadow-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800/80 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                  />
                  <button
                    aria-label="Search"
                    onClick={goSearch}
                    className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SearchIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Theme */}
                <Button
                  color="gray"
                  onClick={toggleDark}
                  className="rounded-xl"
                >
                  <span className="sr-only">Toggle theme</span>
                  <Sun className="hidden h-5 w-5 dark:inline" />
                  <Moon className="h-5 w-5 dark:hidden" />
                </Button>

                {/* User / Auth */}
                {user ? (
                  <Dropdown
                    inline
                    label={
                      <Avatar rounded img={user.user_metadata?.avatar_url} />
                    }
                  >
                    <DropdownItem as={Link} to="/dashboard/employer">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Employer Dashboard
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={handleSignOut}>
                      Sign out
                    </DropdownItem>
                  </Dropdown>
                ) : (
                  <div className="hidden items-center gap-2 sm:flex">
                    <Button
                      color="gray"
                      as={Link}
                      to="/auth"
                      className="rounded-xl"
                    >
                      Sign in
                    </Button>
                    <Button
                      as={Link}
                      to="/auth"
                      className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Briefcase className="mr-2 h-4 w-4" /> Post a job
                    </Button>
                  </div>
                )}

                {/* Mobile toggle */}
                <NavbarToggle className="ml-1 md:hidden" />
              </div>
            </div>

            {/* ---------- MOBILE COLLAPSE ---------- */}
            <NavbarCollapse className="md:hidden space-y-2">
              <MobileNavBlock>
                <NavLink to="/jobs" isActive={isActive("/jobs")}>
                  Jobs
                </NavLink>
                <NavLink to="/companies" isActive={isActive("/companies")}>
                  Companies
                </NavLink>

                {/* Categories */}
                <Dropdown
                  inline
                  label={<span className="text-sm">Categories</span>}
                >
                  {[
                    { label: "Engineering", q: "engineering" },
                    { label: "Product", q: "product" },
                    { label: "Design", q: "design" },
                    { label: "Remote-friendly", q: "remote" },
                  ].map((c) => (
                    <DropdownItem
                      key={c.q}
                      as={Link}
                      to={`/jobs?category=${c.q}`}
                    >
                      {c.label}
                    </DropdownItem>
                  ))}
                </Dropdown>

                {/* Resources */}
                <Dropdown
                  inline
                  label={<span className="text-sm">Resources</span>}
                >
                  <DropdownItem as={Link} to="/resources/interview-prep">
                    Interview Prep
                  </DropdownItem>
                  <DropdownItem as={Link} to="/resources/salary-guide">
                    Salary Guide
                  </DropdownItem>
                  <DropdownItem as={Link} to="/blog">
                    Blog
                  </DropdownItem>
                </Dropdown>
              </MobileNavBlock>

              {/* Mobile search */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goSearch()}
                  placeholder="Search roles…"
                  className="flex-1 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm shadow-sm transition outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800/80 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
                <Button color="light" onClick={goSearch} className="rounded-xl">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile CTAs */}
              <div className="pt-1">
                {user ? (
                  <Button
                    as={Link}
                    to="/dashboard/employer"
                    color="light"
                    className="my-1 w-full rounded-xl"
                  >
                    Employer Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/auth"
                      color="gray"
                      className="my-1 w-full rounded-xl"
                    >
                      Sign in
                    </Button>
                    <Button
                      as={Link}
                      to="/auth"
                      className="my-1 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    >
                      <Briefcase className="mr-2 h-4 w-4" /> Post a job
                    </Button>
                  </>
                )}
              </div>
            </NavbarCollapse>
          </Navbar>
        </div>
      </div>

      {/* ---- Page Content ---- */}
      <main className="mx-auto max-w-7xl p-4 md:p-6">{children}</main>

      {/* ---- Simple footer ---- */}
      <footer className="mx-auto max-w-7xl px-4 pb-10 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 md:flex-row dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
              v1.0
            </span>
            <span>© {new Date().getFullYear()} LaunchHire</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------- PRESENTATIONAL ----------------- */

function MobileNavBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {/* Each child (links + dropdown labels) will look like comfy rows on mobile */}
      {children}
    </div>
  );
}

function NavLink({
  to,
  isActive,
  children,
}: {
  to: string;
  isActive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative md:static">
      <Link
        to={to}
        className={[
          // mobile (collapsed): full-width row with comfy padding
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-base",
          // desktop: inline, smaller, no forced width
          "md:inline-flex md:w-auto md:justify-start md:px-0 md:py-1.5 md:text-sm",
          isActive
            ? "text-blue-700 dark:text-blue-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
          "transition-colors group",
        ].join(" ")}
      >
        <span>{children}</span>
        <ChevronRight
          className={[
            "ml-1 h-4 w-4 shrink-0 transition-transform",
            // show chevron on mobile rows; subtle on desktop hover
            "md:h-3.5 md:w-3.5 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0.5",
          ].join(" ")}
        />
      </Link>

      {/* underline indicator (desktop only) */}
      <span
        className={[
          "pointer-events-none absolute right-0 -bottom-[6px] left-0 h-0.5 rounded-full transition-all",
          "hidden md:block",
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100"
            : "opacity-0 group-hover:opacity-60 dark:from-blue-500 dark:to-indigo-500",
        ].join(" ")}
      />
    </div>
  );
}
