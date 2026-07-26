import { Header } from "@/components/Header";
import { SecretViewer } from "@/components/SecretViewer";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SecretPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="relative min-h-full">
      <div
        className="absolute top-0 w-full z-0 h-[800px] blur-3xl bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            'url("https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/55089b0e-fd30-4b07-881c-69dd9c26979b_3840w.jpg")',
        }}
      />
      <div className="relative">
        <Header />
        <main className="max-w-3xl mx-auto px-6 sm:px-8 pt-14 pb-24 sm:pt-20">
          <SecretViewer id={id} />
        </main>
      </div>
    </div>
  );
}
