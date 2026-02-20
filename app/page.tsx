import Link from "next/link";
import { Sparkles, Play, ShoppingBag, Globe } from "lucide-react";
import StarryBackground from "@/components/ui/StarryBackground";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DailyPath from "@/components/dashboard/DailyPath";
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import { getDashboardStats, getDailyPath } from "@/lib/dashboard";
import FocusTimer from "@/components/features/FocusTimer";
import HeroSection from "@/components/landing/HeroSection";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    const dashboardStats = await getDashboardStats();
    const dailyPathNodes = await getDailyPath();

    // Default safe values if stats fail
    const completedLessons = dashboardStats?.completedLessons || 0;
    const totalLessons = dashboardStats?.totalLessons || 1; // Prevent div by zero
    const progressPercent = Math.round((completedLessons / totalLessons) * 100);
    const totalAnswered = dashboardStats?.totalQuestionsAnswered || 0;
    const todayAnswered = dashboardStats?.questionsAnsweredToday || 0;
    const challenges = dashboardStats?.challenges || [];
    const finalNodes = dailyPathNodes;

    // === DASHBOARD VIEW (Logged In) ===
    return (
      <>
        <StarryBackground />

        <div className="grid grid-cols-12 gap-6 lg:gap-8">

          {/* Middle Column (Content) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Hero / Daily Path Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Jalur Belajar Hari Ini
                </h2>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                <DailyPath nodes={finalNodes} />
              </div>
            </section>

            {/* Daily Challenge Card - Dynamic */}
            <section className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 backdrop-blur border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-accent/30 rounded-full blur-3xl group-hover:bg-accent/40 transition-colors"></div>

              <div className="relative z-10 flex flex-col items-start gap-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Tantangan Harian</h3>
                    <p className="text-slate-300">Selesaikan misi untuk bonus XP!</p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  {challenges.map((challenge, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${challenge.completed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${challenge.completed ? 'bg-green-500 border-green-500' : 'border-slate-500'
                          }`}>
                          {challenge.completed && <Play className="w-3 h-3 text-white fill-current" />}
                        </div>
                        <div>
                          <p className={`font-bold ${challenge.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                            {challenge.title}
                          </p>
                          <span className="text-xs text-yellow-400 font-bold">+{challenge.reward}</span>
                        </div>
                      </div>
                      {challenge.completed && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          SELESAI
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Grid - Dynamic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-cosmic-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Materi Selesai</div>
                <div className="text-3xl font-black text-white">
                  {completedLessons} <span className="text-lg text-slate-500 font-medium">/ {totalLessons}</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              <div className="bg-cosmic-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Soal Dikerjakan</div>
                <div className="text-3xl font-black text-white">{totalAnswered}</div>
                <div className="text-xs text-green-400 mt-2 font-bold flex items-center gap-1">
                  +{todayAnswered} hari ini
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar (Community) */}
          <div className="col-span-12 lg:col-span-4 lg:pl-4 lg:border-l border-white/5 space-y-8">

            {/* Focus Timer Widget */}
            <FocusTimer />

            {/* Shop Promo */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border border-yellow-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-yellow-500/30 transition-colors" />
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-yellow-400" /> Edu-Shop
              </h3>
              <p className="text-slate-400 text-sm mb-4">Tukarkan koinmu dengan tema & gelar keren!</p>
              <Link href="/shop" className="block w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-center rounded-xl transition-colors shadow-lg shadow-yellow-500/20">
                Kunjungi Toko
              </Link>
            </div>

            <CommunityFeed />
          </div>

        </div>
      </>
    );
  }

  // === LANDING PAGE (Public) ===
  return <HeroSection />;
}
