import MainNav from "@/components/main-nav";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <MainNav />
      <main className="p-4 mt-10">{children}</main>
    </div>
  );
}
