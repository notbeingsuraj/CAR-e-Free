import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.phoneNumber);
  }
});

function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>CAReFREE Auth</h1>
    </div>
  );
}

export default App;
