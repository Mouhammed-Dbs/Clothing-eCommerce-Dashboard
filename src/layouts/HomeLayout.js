import NavAndSideBar from "@/components/NavAndSideBar";


export default function HomeLayout({children}) {

  return (
    <div className='flex'>
        <NavAndSideBar />
        <main className="flex-grow w-full" style={{marginTop:"64px"}}>
          <div>
            {children}
          </div>
        </main>
    </div>
  )
}