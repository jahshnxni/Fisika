"use client";
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'

// Lazy-load all simulations for better performance
const HydrostaticSim = dynamic(() => import('@/components/simulations/HydrostaticSim'), { ssr: false })
const RealisticHydrostatic = dynamic(() => import('@/components/simulations/RealisticHydrostatic'), { ssr: false })
const BernoulliSim = dynamic(() => import('@/components/simulations/BernoulliSim'), { ssr: false })
const PascalSim = dynamic(() => import('@/components/simulations/PascalSim'), { ssr: false })
const ArchimedesSim = dynamic(() => import('@/components/simulations/ArchimedesSim'), { ssr: false })
const ContinuitySim = dynamic(() => import('@/components/simulations/ContinuitySim'), { ssr: false })
const ToricelliSim = dynamic(() => import('@/components/simulations/ToricelliSim'), { ssr: false })
const WaveSim = dynamic(() => import('@/components/simulations/WaveSim'), { ssr: false })
const SoundSim = dynamic(() => import('@/components/simulations/SoundSim'), { ssr: false })
const LightSim = dynamic(() => import('@/components/simulations/LightSim'), { ssr: false })
const ThermometerSim = dynamic(() => import('@/components/simulations/ThermometerSim'), { ssr: false })
const ExpansionSim = dynamic(() => import('@/components/simulations/ExpansionSim'), { ssr: false })
const HeatTransferSim = dynamic(() => import('@/components/simulations/HeatTransferSim'), { ssr: false })
const PVDiagramSim = dynamic(() => import('@/components/simulations/PVDiagramSim'), { ssr: false })
const CarnotSim = dynamic(() => import('@/components/simulations/CarnotSim'), { ssr: false })
const GasPistonSim = dynamic(() => import('@/components/simulations/GasPistonSim'), { ssr: false })

const RealBernoulli = BernoulliSim // alias

const components = {
    // Custom component to handle our specific "sim" tags passed from MDX
    // Usage in MDX: <InteractiveComponent type="RealisticHydrostatic" />
    InteractiveComponent: ({ node, ...props }: any) => {
        const simMap: Record<string, React.ComponentType> = {
            HydrostaticSim, RealisticHydrostatic, BernoulliSim, RealBernoulli,
            PascalSim, ArchimedesSim, ContinuitySim, ToricelliSim,
            WaveSim, SoundSim, LightSim,
            ThermometerSim, ExpansionSim, HeatTransferSim, PVDiagramSim, CarnotSim, GasPistonSim,
        }
        const Comp = simMap[props.type]
        if (Comp) return <Comp />
        return <div className="p-4 border border-red-500 text-red-500">Unknown Component: {props.type}</div>
    },
    interactivecomponent: ({ node, ...props }: any) => {
        const simMap: Record<string, React.ComponentType> = {
            HydrostaticSim, RealisticHydrostatic, BernoulliSim, RealBernoulli,
            PascalSim, ArchimedesSim, ContinuitySim, ToricelliSim,
            WaveSim, SoundSim, LightSim,
            ThermometerSim, ExpansionSim, HeatTransferSim, PVDiagramSim, CarnotSim, GasPistonSim,
        }
        const Comp = simMap[props.type]
        if (Comp) return <Comp />
        return <div className="p-4 border border-red-500 text-red-500">Unknown Component: {props.type}</div>
    },
    // Map standard HTML elements to Tailwind styled components if needed
    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold text-accent mb-4 mt-8" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold text-primary mb-3 mt-6" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-4 leading-relaxed text-slate-300" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-4 space-y-2 text-slate-300 ml-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-300 ml-4" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-primary pl-4 italic text-slate-400 my-4 bg-cosmic-800/30 p-4 rounded-r-lg" {...props} />,
    code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '')
        return !inline ? (
            <pre className="bg-cosmic-950 p-4 rounded-lg overflow-x-auto my-4 border border-cosmic-700">
                <code className={className} {...props}>
                    {children}
                </code>
            </pre>
        ) : (
            <code className="bg-cosmic-800 text-primary px-1.5 py-0.5 rounded text-sm font-mono border border-cosmic-700" {...props}>
                {children}
            </code>
        )
    },
    table: ({ node, ...props }: any) => <table className="w-full border-collapse my-4 text-sm text-slate-300" {...props} />,
    th: ({ node, ...props }: any) => <th className="border border-cosmic-700 bg-cosmic-800 px-3 py-2 text-left font-bold text-white" {...props} />,
    td: ({ node, ...props }: any) => <td className="border border-cosmic-700 px-3 py-2" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="text-white font-bold" {...props} />,
    em: ({ node, ...props }: any) => <em className="text-blue-300 italic" {...props} />,
    hr: ({ node, ...props }: any) => <hr className="border-cosmic-700 my-6" {...props} />,
}

export default function MDXContent({ source }: { source: string }) { // Changed prop name 'content' to 'source' to match usage
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={components as any}
            >
                {source}
            </ReactMarkdown>
        </div>
    )
}
