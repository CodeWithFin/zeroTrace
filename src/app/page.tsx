import { CreateSecretForm } from "@/components/CreateSecretForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EyeOff, Lock, Trash2 } from "lucide-react";

const steps = [
  {
    icon: Lock,
    title: "Encrypt in memory",
    body: "Your text is sealed with AES-256-GCM before anything is written. Plaintext never hits the database.",
  },
  {
    icon: EyeOff,
    title: "Share a single link",
    body: "Send the URL over Slack, email, or chat. No accounts, no tracking, no leftover history in ZeroTrace.",
  },
  {
    icon: Trash2,
    title: "Burn on read",
    body: "The first successful open decrypts the payload and deletes the row in the same atomic query.",
  },
];

export default function Home() {
  return (
    <div className="relative">
      <div
        className="absolute top-0 w-full z-0 h-[1000px] blur-3xl bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            'url("https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/55089b0e-fd30-4b07-881c-69dd9c26979b_3840w.jpg")',
        }}
      />

      <div className="relative">
        <Header />

        <section className="max-w-7xl mx-auto px-6 sm:px-8" id="create">
          <div className="pt-14 pb-10 sm:py-20 lg:py-24">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-black tracking-tighter font-medium max-w-5xl">
              Share secrets that vanish
              <span className="block text-black/40 tracking-tighter font-medium">
                after a single read — encrypted, disposable, and account-free
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-black/60 max-w-2xl leading-relaxed tracking-tight">
              Stop pasting API keys into Slack forever. ZeroTrace creates
              burn-on-read links so sensitive text leaves no durable trace.
            </p>
          </div>

          <div className="pb-16 sm:pb-20">
            <CreateSecretForm />
          </div>
        </section>

        <section
          id="how"
          className="max-w-7xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24"
        >
          <div className="mb-8 sm:mb-12">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl text-black mb-4 tracking-tighter font-medium">
              How it works
            </h2>
            <p className="text-xl sm:text-2xl text-black/60 leading-relaxed max-w-3xl tracking-tighter font-medium">
              Three quiet steps between a sensitive string and a link that
              destroys itself.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/70 border border-white/20 p-6 hover:bg-white/80 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 text-black mb-4">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-black/50 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="security"
          className="max-w-7xl mx-auto px-6 sm:px-8"
        >
          <div className="py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="md:col-span-3">
                <h2 className="text-lg font-semibold text-black">Security</h2>
              </div>
              <div className="md:col-span-9">
                <p className="text-2xl sm:text-3xl lg:text-4xl leading-tight text-black tracking-tighter font-medium">
                  ZeroTrace is built around a zero-knowledge data layer: ciphertext
                  only in Postgres, decryption only on authorized fetch, and
                  atomic destruction so race conditions cannot leak a second read.
                </p>
                <p className="leading-relaxed text-lg text-black/60 mt-8">
                  Unread secrets older than seven days are pruned automatically.
                  You can self-host with your own encryption key for full control
                  over the trust boundary.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
