import React, { useCallback, useMemo, useState } from "react";
import {
  Navbar as FBNavbar,
  Button,
  Dropdown,
  Avatar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  DropdownItem,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket,
  Briefcase,
  Search as SearchIcon,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

// If you already have these in your project, keep your originals:
import { supabase } from "../api/supabase";     // <-- adjust path if different
import { useSession } from "../lib/hooks";      // <-- adjust path if different

// ---- Dark mode toggle (JS version)
function useDarkMode() {
  const toggle = useCallback(() => {
    const el = document.documentElement;
    const isDark = el.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);
  return toggle;
}

// ---- Active matcher (JS version)
function useActiveMatcher() {
  const { pathname } = useLocation();
  return useCallback(
    (to) => pathname === to || pathname.startsWith(`${to}/`),
    [pathname]
  );
}

export default function AppNavbar() {
  const { user } = useSession?.() ?? { user: null };
  const nav = useNavigate();
  const toggleDark = useDarkMode();
  const isActive = useActiveMatcher();
  const [q, setQ] = useState("");

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      nav("/auth");
    } catch {
      // swallow for now
    }
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
          LaunchHire
        </span>
      </Link>
    ),
    []
  );

  return (
    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-gray-900/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
      <div className="mx-auto max-w-screen-xl px-3 md:px-4">
        <FBNavbar
          fluid
          rounded
          className="border-b border-gray-200/70 bg-transparent dark:border-gray-800/70"
        >
          {/* Brand (keeps your new minimal visual style) */}
          <NavbarBrand as="div">{brand}</NavbarBrand>

          {/* Right section */}
          <div className="flex items-center gap-2 md:order-2">
            {/* Desktop search */}
            <div className="relative hidden items-center md:flex">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
                placeholder="Search roles…"
                className="w-56 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 pr-9 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800/80 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
              />
              <button
                aria-label="Search"
                onClick={goSearch}
                className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Dark mode toggle */}
            <Button color="gray" onClick={toggleDark} className="rounded-xl">
              <span className="sr-only">Toggle theme</span>
              <Sun className="hidden h-5 w-5 dark:inline" />
              <Moon className="h-5 w-5 dark:hidden" />
            </Button>

            {/* Auth dropdown or CTAs */}
            {user ? (
              <Dropdown inline label={<Avatar rounded img={user.user_metadata?.avatar_url} />}>
                <DropdownItem as={Link} to="/dashboard/employer">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Employer Dashboard
                  </div>
                </DropdownItem>
                <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
              </Dropdown>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button color="gray" as={Link} to="/auth" className="rounded-xl">
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

            <NavbarToggle />
          </div>

          {/* Collapsible nav — mirrors the new Flowbite navbar structure */}
          <NavbarCollapse>
            <NavLink to="/jobs" isActive={isActive("/jobs")}>
              Jobs
            </NavLink>
            <NavLink to="/companies" isActive={isActive("/companies")}>
              Companies
            </NavLink>

            {/* Categories dropdown */}
            <Dropdown inline label={<span className="text-sm">Categories</span>}>
              {[
                { label: "Engineering", q: "engineering" },
                { label: "Product", q: "product" },
                { label: "Design", q: "design" },
                { label: "Remote-friendly", q: "remote" },
              ].map((c) => (
                <DropdownItem key={c.q} as={Link} to={`/jobs?category=${c.q}`}>
                  {c.label}
                </DropdownItem>
              ))}
            </Dropdown>

            {/* Resources dropdown */}
            <Dropdown inline label={<span className="text-sm">Resources</span>}>
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

            {/* Mobile search + CTAs */}
            <div className="md:hidden">
              {user ? (
                <Button as={Link} to="/dashboard/employer" color="light" className="my-1 w-full rounded-xl">
                  Employer Dashboard
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/auth" color="gray" className="my-1 w-full rounded-xl">
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

              <div className="mt-2 flex items-center gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goSearch()}
                  placeholder="Search roles…"
                  className="flex-1 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800/80 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
                <Button color="light" onClick={goSearch} className="rounded-xl">
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </NavbarCollapse>
        </FBNavbar>
      </div>
    </div>
  );
}

// Small presentational helper
function NavLink({ to, isActive, children }) {
  return (
    <div className="relative">
      <Link
        to={to}
        className={`group inline-flex items-center rounded-lg px-2 py-1.5 text-sm transition-colors ${
          isActive
            ? "text-blue-700 dark:text-blue-400"
            : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        }`}
      >
        {children}
        <ChevronRight
          className={`ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        />
      </Link>
      <span
        className={`pointer-events-none absolute right-2 -bottom-[2px] left-2 h-0.5 rounded-full transition-all ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 opacity-100"
            : "opacity-0 group-hover:opacity-60 dark:from-blue-500 dark:to-indigo-500"
        }`}
      />
    </div>
  );
}
