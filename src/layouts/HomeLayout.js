import NavAndSideBar from "@/components/NavAndSideBar";
import NavBar from "@/components/NavAndSideBar"
const drawerWidth = 240;
export default function HomeLayout({children}) {
  return (
    <div className='flex'>
        <NavAndSideBar></NavAndSideBar>
        <main className= "flex-grow p-4" style={{  width: `calc(100% - ${drawerWidth}px)`  }}>
        <div className='mt-16'>
            {children}
        </div>
      </main>
</div>
  )
}
