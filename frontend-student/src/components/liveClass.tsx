import Cookies from "js-cookie"



export const LiveClass = ()=>{
    // const token = Cookies.get('token');
    const token = localStorage.getItem("token");
    return(<div>
        <div>
            <h1 className="text-2xl font-medium">Live Class</h1>
            <div>
                // render all live teachers and button to join 
                // data base will check if it's subscribe then join 
            </div>
            <div>
                {token}
            </div>
        </div>
    </div>
   )
}