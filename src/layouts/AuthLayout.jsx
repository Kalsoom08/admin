import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@maincomponents/components/ui/card"
import cafe from "../assets/cafe.svg"
import logo from "../assets/logo.png"

export default function AuthLayout({ headerText, description, children }) {
  return (
    <div
      className="
        flex flex-col font-Poppins
        min-h-screen            /* mobile: allow page to grow & scroll */
        md:h-screen md:flex-row /* desktop: lock to viewport height, side-by-side */
      "
    >
      {/* Left side */}
      {/* <div
        className="
          w-full md:w-1/2
          bg-white px-6 text-center
          flex flex-col items-center
          pt-6 md:pt-8
        "
      >
      
        <div className="mb-4 flex w-full flex-col items-center">
          <img src={logo} alt="cafe logo" className="mb-2 h-16 w-16" />
          <h1 className="text-2xl font-bold text-black">Ahmad Cafe</h1>
          <p className="mt-1 text-sm text-black">Professional Point of Sale System</p>
        </div>

        <div className="flex w-full items-center justify-center">
          <img
            src={cafe} 
            alt="Illustration"
            className="max-h-[260px] md:max-h-[360px] w-auto object-contain"
          />
        </div>

        <p className="mt-6 max-w-xs pb-8 text-sm text-black">
          Streamline your restaurant operations with our comprehensive management system
        </p>
      </div> */}

      {/* Right side */}
      <div
        className="
          w-full 
         p-6
          flex items-start md:items-center justify-center
        "
      >
        <Card className="w-full max-w-md rounded-2xl shadow-lg my-6 md:my-0">
          <CardHeader>
            <CardTitle className="flex flex-col items-center">
              <img src={logo} alt="cafe logo" className="mb-2 h-16 w-16" />
              <h2 className="text-xl font-semibold">{headerText}</h2>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
