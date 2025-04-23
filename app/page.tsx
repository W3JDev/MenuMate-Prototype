import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Clock, MapPin, Phone, Calendar, X } from "lucide-react"
import { ActionButton } from "@/components/action-button"
import { MenuButton } from "@/components/menu-button"
import { VoiceChatAssistant } from "@/components/ai/voice-chat-assistant"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section with improved visibility */}
        <section className="relative w-full h-[70vh]">
          <Image
            src="/placeholder.svg?height=800&width=1200"
            alt="Restaurant banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/90 backdrop-blur-md mb-4 flex items-center justify-center shadow-ios">
              <span className="text-4xl font-bold">&amp;</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Table &amp; Apron</h1>

            {/* Status Pill */}
            <div className="flex items-center gap-2 mb-6">
              <div className="ios-status-pill bg-black/50 text-white">
                <X className="h-3 w-3 mr-1" />
                <span>Closed</span>
              </div>
              <div className="ios-status-pill bg-black/50 text-white">Closed Today</div>
            </div>

            <p className="text-white/90 max-w-md mx-auto mb-6">
              Experience the perfect blend of international flavors and local ingredients at our award-winning
              restaurant.
            </p>
          </div>
        </section>

        {/* Info Cards - Centered and 3D-styled on mobile */}
        <section className="container py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 -mt-16 relative z-10">
            <ActionButton
              icon={<Phone className="h-6 w-6 text-ios-blue" />}
              title="Call Us"
              subtitle="+60 0377334000"
            />

            <ActionButton
              icon={
                <svg
                  className="h-6 w-6 text-ios-green"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 21L5 19C7.4 16.6 9 15.4 12 15.4C15 15.4 16.6 16.6 19 19L21 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title="WhatsApp"
              subtitle="Send a message"
              subtitleColor="text-ios-blue"
            />

            <ActionButton
              icon={<Calendar className="h-6 w-6 text-ios-purple" />}
              title="Reservations"
              subtitle="Book a table"
              subtitleColor="text-ios-blue"
            />

            <ActionButton
              icon={<MapPin className="h-6 w-6 text-ios-red" />}
              title="Directions"
              subtitle="23, Jalan SS 20/11, Damansara Kim"
            />
          </div>
        </section>

        {/* View Menu Button - Highlighted and centered */}
        <section className="container py-6">
          <MenuButton href="/menu" />
        </section>

        {/* Operating Hours - Improved visibility */}
        <section className="container py-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-ios-blue mr-2" />
            <h2 className="text-xl font-semibold">Operating Hours</h2>
          </div>

          <div className="bg-white rounded-ios overflow-hidden shadow-ios">
            <div className="flex border-b border-ios-gray-5">
              <button className="flex-1 py-2 px-4 text-ios-blue font-medium border-b-2 border-ios-blue">
                All Hours
              </button>
              <button className="flex-1 py-2 px-4 text-ios-gray-1">Breakfast</button>
              <button className="flex-1 py-2 px-4 text-ios-gray-1">Lunch</button>
              <button className="flex-1 py-2 px-4 text-ios-gray-1">Dinner</button>
            </div>

            {/* Improved day text visibility */}
            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Monday</span>
              <span className="text-ios-red font-medium">Closed</span>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Tuesday</span>
              <span className="text-ios-gray-1 font-medium">05:30 - 22:30</span>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Wednesday</span>
              <span className="text-ios-gray-1 font-medium">05:30 - 22:00</span>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Thursday</span>
              <span className="text-ios-gray-1 font-medium">05:30 - 22:30</span>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Friday</span>
              <div className="flex flex-col items-end">
                <div className="text-ios-gray-1 font-medium">Lunch 11:30 - 15:00</div>
                <div className="text-ios-gray-1 font-medium">Dinner 17:30 - 22:30</div>
              </div>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Saturday</span>
              <div className="flex flex-col items-end">
                <div className="text-ios-gray-1 font-medium">Lunch 11:30 - 15:00</div>
                <div className="text-ios-gray-1 font-medium">Dinner 17:30 - 22:30</div>
              </div>
            </div>

            <div className="ios-list-item">
              <span className="flex-1 font-medium text-foreground">Sunday</span>
              <div className="flex flex-col items-end">
                <div className="text-ios-gray-1 font-medium">Lunch 11:30 - 15:00</div>
                <div className="text-ios-gray-1 font-medium">Dinner 17:30 - 22:30</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Voice Chat Assistant */}
      <VoiceChatAssistant />

      {/* Footer */}
      <footer className="border-t border-ios-gray-5 py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-ios-gray-1">© 2025 MenuMate. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/menu" className="text-sm text-ios-gray-1 hover:text-ios-blue">
              Menu
            </Link>
            <Link href="/admin" className="text-sm text-ios-gray-1 hover:text-ios-blue">
              Admin
            </Link>
            <Link href="/admin/settings" className="text-sm text-ios-gray-1 hover:text-ios-blue">
              Settings
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

