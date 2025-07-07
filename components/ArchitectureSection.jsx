import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const architectureCards = [
  {
    title: "Eco Works Business Center",
    image:
      "https://img.freepik.com/free-photo/architect-man-showing-something-project-his-colleague-foreman_496169-959.jpg", // Replace with actual path
    link: "#",
  },
  {
    title: "ARCDG CPM",
    description:
      "We transform your vision, schedule, and budget into economical, efficient, and quality design and construction solutions, from feasibility to tender and beyond.",
    icon: "🌟",
  },
  {
    title: "Modern Villa",
    image: "/images/hero.jpg",
    rating: "4.9",
    customers: "980+ Customers",
  },
  {
    title: "Wanna know more about us",
    description:
      "Architectural design can support safety and infection control measures, which are crucial in healthcare environments.",
    image:
      "https://img.freepik.com/free-photo/construction-silhouette_1150-8335.jpg",
  },
];

const ArchitectureSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <h2 className="hidden md:block leading-[10rem] text-3xl md:text-4xl font-semibold  text-gray-900">
            PAE Construction India offers efficient, client-focused
            architectural and structural engineering solutions, backed by{" "}
            <span className="bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              7{" "}
            </span>
            years of experience.
          </h2>
          <h2 className="block md:hidden text-4xl font-semibold leading-tight text-gray-900">
            Client-Centric Commitment
          </h2>

          <p className="text-gray-600 text-lg">
            PAE Construction India Pvt. Ltd. is a Dehradun-based Architectural
            and Structural Engineering consultancy, founded by Mr. Dhirendra
            Pratap Singh 7 years ago, leveraging his extensive experience in
            projects across India. The firm provides comprehensive design,
            execution, and construction services to a diverse client base,
            including government bodies, corporate giants, and real estate
            developers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 ">
          {/* Card 1 */}
          <div className="inverted-radius bg-gray-900 overflow-hidden shadow-md text-white">
            <img
              src={architectureCards[0].image}
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold">
                {architectureCards[0].title}
              </h4>
              <div className="mt-2 flex py-1 border border-gray-500 cursor-pointer justify-end">
                <h1>Contact Us</h1>
                <Link
                  href={"/contact"}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <ArrowUpRight size={24} /> {/* Adjust size if needed */}
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col justify-end">
            {" "}
            {/* Added flex-col and justify-end */}
            <div className="bg-gray-800 rounded-2xl p-5 shadow-md text-white w-full">
              {" "}
              {/* Removed h-min, bottom-0 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">ARCDG CPM</span>
                  <span className="text-2xl">{architectureCards[1].icon}</span>
                </div>
                <p className="text-sm">{architectureCards[1].description}</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <img
              src={architectureCards[2].image}
              alt=""
              className="w-full h-52 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <div className="border p-2 rounded-xl border-gray-500">
                  <h1 className="font-light">Average rating</h1>
                  <h1 className="font-bold text-xl text-center">
                    {architectureCards[2].rating}
                  </h1>
                  <h1 className="font-light">
                    {architectureCards[2].customers}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-md">
            <button className="mb-2 bg-gray-800 text-xs px-3 py-1 rounded-full">
              Wanna know more about us
            </button>
            <img
              src={architectureCards[3].image}
              alt=""
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
            <p className="text-sm">{architectureCards[3].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
