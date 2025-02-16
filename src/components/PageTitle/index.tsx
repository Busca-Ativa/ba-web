import UserOriginInfo from "@/components/UserOriginInfo";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="flex flex-col gap-[5px]">
      <h1>{title}</h1>
      <UserOriginInfo />
    </div>
  );
}
