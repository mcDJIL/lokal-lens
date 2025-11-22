import MainLayout from "@/components/layout/MainLayout";

export default function WithLayoutGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
