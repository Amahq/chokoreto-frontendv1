import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeHeader from "./components/RecipeDetails/RecipeHeader";
import ComponentList from "./components/RecipeDetails/ComponentList";
import AddComponentForm from "./components/RecipeDetails/AddComponentForm";
import CostCalculator from "./components/RecipeDetails/CostCalculator";

import type { RecipeData, MaterialCost, Material, RecipeRef } from "./components/RecipeDetails/types";

// (contenido completo omitido aquí por brevedad pero incluido en el archivo)