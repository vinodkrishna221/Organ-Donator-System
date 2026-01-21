import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Organ Donation Platform
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#about"
              >
                About
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#process"
              >
                Process
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#contact"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">

            </div>
            <nav className="flex items-center text-sm font-medium">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/login">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Link
              href="/login"
              className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            >
              <Badge variant="secondary">New</Badge> Digital Organ Donation Registry
            </Link>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Connect Hope, Share Life
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A centralized platform connecting donors, recipients, and hospitals to streamline the organ donation process and save lives.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="#learn-more">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
        </section>
        <section
          id="stats"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Real-time Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant automated matching based on medical compatibility.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Transparent Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete tracking of donation status and transplant scheduling.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="space-y-2">
                  <h3 className="font-bold">Secure Data</h3>
                  <p className="text-sm text-muted-foreground">
                    HIPAA compliant security for all patient and donor information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by <span className="font-medium underline underline-offset-4">Team Antigravity</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
