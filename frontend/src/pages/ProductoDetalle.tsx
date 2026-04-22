import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, type Producto } from '../api';

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();

  const { data: productos, isLoading, isError } = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos').then(res => res.data),
  });

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div className="text-red-500">Error al cargar el producto.</div>;

  const producto = productos?.find(p => p.id === Number(id));

  if (!producto) return <div>Producto no encontrado.</div>;

  return (
    <div className="bg-white p-8 rounded shadow-md max-w-2xl mx-auto">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Volver a Productos</Link>
      <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
      <p className="text-xl text-gray-700 mb-4">${producto.precio}</p>
      {producto.descripcion && <p className="text-gray-600 mb-6">{producto.descripcion}</p>}
      
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Categorías</h3>
        <div className="flex gap-2 flex-wrap">
          {producto.categorias?.length > 0 ? producto.categorias.map(c => (
            <span key={c.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {c.nombre}
            </span>
          )) : <span className="text-gray-500 italic">Sin categorías</span>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">Ingredientes</h3>
        <div className="flex gap-2 flex-wrap">
          {producto.ingredientes?.length > 0 ? producto.ingredientes.map(i => (
            <span key={i.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {i.nombre}
            </span>
          )) : <span className="text-gray-500 italic">Sin ingredientes</span>}
        </div>
      </div>
    </div>
  );
}
