// this page demostrates required endpoint communication

export default function Hello() {
    const handleClick = async () => {
        console.log("clicked");
    
    const response = await fetch("http://localhost:3000/api/getplan");
    console.log("response", response)
    const data = await response.json();
    console.log("data", data);
    }
    return (
    <button onClick={handleClick}> Generate </button>
)};