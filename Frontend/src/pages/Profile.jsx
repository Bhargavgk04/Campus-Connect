import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">User Profile {id}</h1>
      </main>
    </div>
  );
} 