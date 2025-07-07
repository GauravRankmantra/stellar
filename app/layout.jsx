import "./globals.css";
import MouseTracker from "../components/MouseTracker";

export const metadata = {
  title: "Stellar Designe Lab - Innovative Architecture & Design",
  description:
    "STELLARDESIGNLAB offers innovative architectural design, interior design, and master planning services in Dehradun and beyond. Crafting visionary spaces for living and working.",
  keywords:
    "architecture, architectural design, interior design, master planning, building design, modern architecture, sustainable architecture, Dehradun, STELLARDESIGNLAB",
  // icons: {
  //   // Standard favicon.ico (assuming you'll update this file in your public directory)
  //   icon: "/favicon.ico", // Directly points to public/favicon.ico

  //   other: [
  //     {
  //       rel: "mask-icon",
  //       url: "/images/logo.svg", // Assuming your new logo is also named logo.svg in the images folder
  //       color: "#000000", // Adjust this color to a primary brand color for STELLARDESIGNLAB if applicable
  //     },
  //     {
  //       rel: "icon", // Using 'icon' again for the SVG
  //       type: "image/svg+xml",
  //       url: "/images/logo.svg", // Assuming your new logo is also named logo.svg in the images folder
  //     },
  //   ],
  // },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative bg-[#b4aea7] h-screen w-screen overflow-hidden">
        <MouseTracker />

        <div className="h-full w-full p-4 md:p-6">
          {/* Centered content with equal margin on all sides */}
          <main className="h-full w-full bg-white overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
