import { useState } from "react";

export default function Example() {
  const[user, setUser]=useState("")

  

  return (
    <ul>
        {users.map((e) => (
            <li key={e.id}><p>{e.id} {e.name}</p></li>
        ))}
    </ul>
  );
}
