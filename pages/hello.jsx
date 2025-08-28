// this page demostrates required endpoint communication

export default function Hello() {
    const handleClick = async () => {
        console.log("clicked");

        // Hardcoded test data
        const body = {
            aim: "Become a rock singer",
            success: "Perform at a local venue",
            startingLevel: "Beginner",
            targetDate: "2025-12-31",
            timePerDay: "1 hour"
        };

        const response = await fetch("http://localhost:3000/api/getplan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("data", data);
    };

    return (
        <button onClick={handleClick}>Generate</button>
    );
}