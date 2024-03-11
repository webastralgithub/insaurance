import "./Show.css"


const Show=()=>{


    return(
<div className="show">
        <span className="show_text">Show</span>
        <select name="role" >
       <option value="10">10</option>
       <option value="20">20</option>
       <option value="30">30</option>
       <option value="40">40</option>
         
        </select>
        <span className="entriex_text">entries</span>
        </div>
    )
}
export default Show