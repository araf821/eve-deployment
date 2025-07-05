type Props = {
  title: string;
  subtitle?: string;
};
export const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="space-y-1 md:space-y-2">
      <h1 className="font-heading text-3xl font-bold">{title}</h1>
      <p className="font-heading text-xl italic">{subtitle}</p>
    </div>
  );
};
