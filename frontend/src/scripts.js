const connectRoom = async (roomName) => {
    const response = await fetch(`http://localhost:3000/connectRoom`, {
        method: 'POST', 
        body: JSON.stringify({
            roomName: roomName
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseJSON = await response.json();
    console.log(responseJSON);
    return responseJSON;
}

export { connectRoom }