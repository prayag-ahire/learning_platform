export const Materials = ()=>{

    const fileHandler = ()=>{
        document.getElementById("myfile")?.click()
    }
    
    return(<div className="w-full h-full scroll-auto">
            <div className=" grid   border-black m-2 ">
                <div className="font-bold p-2 text-2xl"><p>Upload New Matrial</p></div>
                <input type="file" hidden id="myfile"></input>
                <div className=" rounded-2xl m-2 bg-amber-400 h-90  flex flex-col items-center justify-center " onClick={fileHandler}>
                         <div className="flex space-x-2  bg-white text-black   font-bold p-3  rounded-sm">
                             <div>
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                 </svg>
                             </div>
                             <p>CHOOSE FILES</p>
                             </div>
                             <p className="text-white pt-2">or drop files here</p>
                </div>
                
            <div>
            
                </div>
            </div>
        <div>
            <div className="font-bold p-2 text-2xl">Uploaded Matrial</div>
            <div></div>
        </div>
    </div>)
}