const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'hello' })
};
fetch('http://localhost:8000/', requestOptions).then((a)=>{
    a.json()
    console.log(a.json());

}).then(a => console.log(a))
    
