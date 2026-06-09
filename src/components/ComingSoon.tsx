import { Construction } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-petrol-50 text-petrol-400">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-petrol-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-petrol-500">
        Dieses Modul ist in Vorbereitung. Der Fokus liegt aktuell auf dem
        Recruiting-Bereich – weitere HR-Module bauen auf derselben Grundlage auf.
      </p>
    </div>
  );
}
