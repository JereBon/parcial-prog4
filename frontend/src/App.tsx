import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriasPage from './pages/CategoriasPage';
import ProductosPage from './pages/ProductosPage';
import IngredientesPage from './pages/IngredientesPage';
import ProductoDetalle from './pages/ProductoDetalle';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blue-600 p-4 text-white shadow-md">
          <div className="container mx-auto flex gap-6 font-semibold">
            <Link to="/" className="hover:text-blue-200">Productos</Link>
            <Link to="/categorias" className="hover:text-blue-200">Categorías</Link>
            <Link to="/ingredientes" className="hover:text-blue-200">Ingredientes</Link>
          </div>
        </nav>
        <main className="flex-1 container mx-auto p-6">
          <Routes>
            <Route path="/" element={<ProductosPage />} />
            <Route path="/detalle/:id" element={<ProductoDetalle />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
