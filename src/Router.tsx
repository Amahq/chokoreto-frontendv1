// src/Router.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateRecipe from "./pages/CreateRecipe";
import RecipeList from "./pages/RecipeList";
import RecipeDetails from "./pages/RecipeDetails";
import Materials from "./pages/Materials";
import Prices from "./pages/Prices";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<RecipeList />} />
      <Route path="/create" element={<CreateRecipe />} />
	  <Route path="/recipes/:id" element={<RecipeDetails />} />
	  <Route path="/materials" element={<Materials  />} />
	  <Route path="/prices" element={<Prices  />} />
    </Routes>
  );
}
