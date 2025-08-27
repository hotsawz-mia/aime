export default function Hello() {
    const handleClick = async () => {
        console.log("clicked");
    // fetch("http://localhost:3000/api/generateposts");
    
    const response = await fetch("http://localhost:3000/api/generateposts");
    console.log("response", response)
    // const data = await response.json();
    }
    return (
    <button onClick={handleClick}> Generate </button>
)};