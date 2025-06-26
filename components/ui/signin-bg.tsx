
import {

  Plane,
  MapPin,
  Compass,
  Globe,
  Palmtree,

  
} from "lucide-react";
export function SignInBg() {
    const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-15px) rotate(1deg); }
    66% { transform: translateY(-8px) rotate(-0.5deg); }
  }
  

  
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(1); }
  }
  
  .animate-float {
    animation: float 12s ease-in-out infinite;
  }
  .animate-shimmer {
    animation: shimmer 4s infinite;
  }
  .animate-pulse-glow {
    animation: pulse-glow 5s ease-in-out infinite;
  }
  .animate-gradient {
    background-size: 300% 300%;
    animation: gradient-shift 10s ease infinite;
  }
  .animate-sparkle {
    animation: sparkle 3s ease-in-out infinite;
  }
  
  .delay-1000 { animation-delay: 1s; }
  .delay-2000 { animation-delay: 2s; }
  .delay-3000 { animation-delay: 3s; }
  .delay-4000 { animation-delay: 4s; }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .text-shadow-glow {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
    custom-input:-webkit-autofill,
custom-input:-webkit-autofill:hover,
custom-input:-webkit-autofill:focus {
  /* background-color */
  -webkit-box-shadow: 0 0 0 1000px transparent inset;
  /* text colour */
  -webkit-text-fill-color: #fff !important;

  /* optional - keep your border */
  border: 1px solid rgba(255,255,255,.2);
`;
    return (
        <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800">
        {/* Animated geometric shapes */}
        <div className="absolute inset-0">
          {/* Large floating orbs */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/25 to-indigo-400/25 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full blur-2xl animate-float delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-float delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-indigo-400/25 to-blue-400/25 rounded-full blur-lg animate-float delay-3000"></div>
          
          {/* Sparkle effects */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full animate-sparkle"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-indigo-200 rounded-full animate-sparkle delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-300 rounded-full animate-sparkle delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-300 rounded-full animate-sparkle delay-3000"></div>
          <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-blue-200 rounded-full animate-sparkle delay-4000"></div>
          
          {/* Travel icons with enhanced effects */}
          <div className="absolute top-1/4 left-1/4 text-white/20 animate-float">
            <Plane className="w-16 h-16 rotate-45 drop-shadow-2xl" />
          </div>
          <div className="absolute top-1/3 right-1/4 text-white/15 animate-float delay-1000">
            <Globe className="w-12 h-12 drop-shadow-xl" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 text-white/20 animate-float delay-2000">
            <Compass className="w-18 h-18 drop-shadow-2xl" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-white/15 animate-float delay-3000">
            <MapPin className="w-10 h-10 drop-shadow-xl" />
          </div>
          
          {/* Additional decorative elements */}
          <div className="absolute top-16 right-16 text-white/10">
            <Palmtree className="w-14 h-14 animate-float delay-1000" />
          </div>
          <div className="absolute bottom-16 left-16 text-white/10">
            <Palmtree className="w-12 h-12 animate-float delay-2000" />
          </div>
        </div>
      </div>
    )
}