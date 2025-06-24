# RecipeDetails Components

Este directorio contiene una implementación modularizada del componente `RecipeDetails`, responsable de visualizar, editar y calcular el costo de recetas dentro de la aplicación Chokoreto.

## 📁 Estructura

```
components/RecipeDetails/
├── RecipeHeader.tsx        # Encabezado visual: imagen, nombre, rinde, procedimiento
├── ComponentList.tsx       # Lista recursiva de materiales y sub-recetas (con edición y eliminación)
├── AddComponentForm.tsx    # Formulario para agregar nuevos componentes con autocompletado y creación inline
├── CostCalculator.tsx      # Muestra el costo total de la receta en función de la cantidad deseada
├── types.ts                # Tipos TypeScript centralizados para recetas, componentes, materiales, etc.
└── index.ts                # Punto de entrada único para importar todos los subcomponentes
```

## 🚀 Uso

Puedes importar todos los subcomponentes de forma individual o desde el `index.ts`:

```tsx
import {
  RecipeHeader,
  ComponentList,
  AddComponentForm,
  CostCalculator
} from "@/components/RecipeDetails";
```

## ✅ Beneficios del refactor

- 🔄 Reutilización: componentes aislados y fáciles de testear
- 🧠 Legibilidad: más claro para nuevos desarrolladores
- 🚧 Escalabilidad: cada parte puede evolucionar de forma independiente

## ✨ Estética

- Estilo `kawaii`: colores pastel, bordes redondeados, íconos temáticos
- TailwindCSS integrado en cada subcomponente