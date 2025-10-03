import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Sparkles,
  Rocket,
  Search,
  ShieldCheck,
  ThumbsUp,
  ChevronRight,
  Star,
  Users,
  Building2,
  Globe2,
  Target,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="relative isolate">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10rem] left-1/2 -translate-x-1/2 blur-3xl">
          <div className="h-[28rem] w-[56rem] rounded-full bg-gradient-to-tr from-blue-500/40 via-indigo-500/30 to-cyan-400/30 dark:from-blue-500/30 dark:via-indigo-500/20 dark:to-cyan-400/20" />
        </div>
        <div className="absolute right-[-6rem] bottom-[-12rem] blur-3xl">
          <div className="h-[24rem] w-[48rem] rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/20 to-rose-400/20" />
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles className="h-4 w-4" /> Curated roles, updated daily
          </span>

          <h1 className="mt-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl dark:from-white dark:via-gray-200 dark:to-gray-400">
            Find your next role
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-gray-600 md:text-lg dark:text-gray-300">
            Search hand‑picked opportunities across Engineering, Product, and
            Design. No fluff—just roles worth your time.
          </p>

          {/* Actions */}
          <div className="mx-auto mt-8 flex max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row">
            <Link
              to="/jobs"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-[1.02] hover:bg-blue-700 focus:ring-4 focus:ring-blue-400/40 focus:outline-none dark:shadow-blue-900/30"
            >
              <Search className="h-5 w-5" /> Browse jobs
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-800 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              <Briefcase className="h-5 w-5" /> Post a job
            </Link>
          </div>

          {/* Trust markers */}
          <div className="mx-auto mt-10 grid w-full max-w-3xl grid-cols-3 gap-3 text-sm md:max-w-4xl">
            {[
              { icon: Users, label: "10k+ candidates" },
              { icon: Building2, label: "1k+ companies" },
              { icon: ShieldCheck, label: "Human‑curated" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="rounded-xl border border-gray-200/70 bg-white/70 px-4 py-2 backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/50"
              >
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200">
                  <m.icon className="h-4 w-4" /> {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-left text-2xl font-semibold tracking-tight md:text-3xl dark:text-white">
            Explore categories
          </h2>
          <Link
            to="/jobs"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <c.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold dark:text-white">
                  {c.title}
                </h3>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {c.desc}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                Browse roles <ChevronRight className="h-4 w-4" />
              </div>
              <Link
                to={`/jobs?category=${encodeURIComponent(c.query)}`}
                className="absolute inset-0"
                aria-label={`Browse ${c.title}`}
              />
              <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-blue-100 opacity-0 transition group-hover:opacity-100 dark:bg-blue-900/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured cards */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-left text-2xl font-semibold tracking-tight md:text-3xl dark:text-white">
            Why job‑seekers love us
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.06 * i }}
              className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-900/30">
                  <f.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-semibold dark:text-white">
                  {f.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Logos / social proof */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/60">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Trusted by teams at
          </p>
          <div className="mt-4 grid grid-cols-2 items-center justify-items-center gap-6 opacity-80 sm:grid-cols-4">
            {"Acme,Globex,Initech,Umbrella".split(",").map((n) => (
              <div
                key={n}
                className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr]"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                4.9/5 average rating
              </span>
            </div>
            <p className="mt-4 text-lg leading-relaxed font-medium text-gray-900 dark:text-gray-100">
              “I landed interviews at two great companies within a week. The
              listings feel curated and relevant.”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=120&auto=format&fit=crop"
                alt="User avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Tomi Adeoye
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Product Designer
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-sm dark:border-gray-700">
            <h3 className="text-xl font-semibold">
              Hiring? Reach better candidates
            </h3>
            <p className="mt-2 text-sm text-blue-50/90">
              Post a role in minutes and get in front of top‑tier talent
              exploring new opportunities.
            </p>
            <div className="mt-5">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur transition hover:bg-white/20"
              >
                <Rocket className="h-4 w-4" /> Start hiring
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-10 dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight dark:text-white">
                Ready to make a move?
              </h3>
              <p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">
                Browse fresh, high‑quality roles and set alerts for the titles
                you care about.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700"
              >
                <Search className="h-5 w-5" /> Browse jobs
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-gray-800 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <Briefcase className="h-5 w-5" /> Post a job
              </Link>
            </div>
          </div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 hidden h-60 w-60 rounded-full bg-blue-500/10 blur-2xl md:block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>
    </div>
  );
}

const categories = [
  {
    title: "Engineering",
    desc: "Backend, Frontend, Full‑stack, Mobile, Data, DevOps.",
    query: "engineering",
    icon: Rocket,
  },
  {
    title: "Product",
    desc: "PM, Product Ops, Research, Strategy.",
    query: "product",
    icon: Target,
  },
  {
    title: "Design",
    desc: "Product Design, UI/UX, Motion, Branding.",
    query: "design",
    icon: Sparkles,
  },
  {
    title: "Remote‑friendly",
    desc: "Roles with flexible location policies.",
    query: "remote",
    icon: Globe2,
  },
  {
    title: "Entry‑level",
    desc: "Junior roles and internships.",
    query: "entry",
    icon: Users,
  },
  {
    title: "Senior & Lead",
    desc: "Staff, Principal, Manager tracks.",
    query: "senior",
    icon: Briefcase,
  },
];

const features = [
  {
    title: "Curated by humans",
    desc: "We hand‑review every posting to cut the noise.",
    icon: ShieldCheck,
  },
  {
    title: "Signal over noise",
    desc: "High‑quality filters, tags, and search that respect your time.",
    icon: Search,
  },
  {
    title: "Real companies, real roles",
    desc: "Work with teams doing meaningful work across the globe.",
    icon: ThumbsUp,
  },
];
