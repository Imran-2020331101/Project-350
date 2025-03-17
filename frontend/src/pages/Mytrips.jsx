import { useSelector } from "react-redux"

export default function Mytrips(){
    
    const trips = useSelector((state)=> state.trips.trips)

    const tripList = trips.map((trip)=>{
        return(
            <div key={trip.destination} className="max-w-28 mx-3">
                <img src={trip.coverPhotoLink}/>
                <h1>{trip.destination}</h1>
            </div>
        )  
        });

    return (
        trips.length >=1 && (
        <>
            <h1 className="text-4xl">My trips</h1>
            <div className="flex flex-row w-full px-[10%] my-4 justify-start">
                {tripList}
            </div>
        </>
            )
    )
};