import NavAndSideBar from "@/components/NavAndSideBar";


export default function HomeLayout({children}) {

  return (
    <div className='flex'>
        <NavAndSideBar />
        <main className="flex-grow w-full" style={{marginTop:"64px"}}>
          <div style={{marginTop:"20px"}} >
            {children}
          </div>
        </main>
    </div>
  )
}