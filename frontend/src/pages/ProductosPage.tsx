import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api, type Producto, type Categoria, type Ingrediente } from '../api';
import { Modal } from '../components/Modal';
import { useForm } from '../hooks/useForm';

export default function ProductosPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { values, handleChange, reset, setValues, setFieldValue } = useForm({
    nombre: '',
    precio: 0,
    descripcion: '',
    categorias_ids: [] as number[],
    ingredientes_ids: [] as number[]
  });

  const { data: productos, isLoading, isError } = useQuery<Producto[]>({
    queryKey: ['productos'],
    queryFn: () => api.get('/productos').then(res => res.data),
  });

  const { data: categorias } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias').then(res => res.data),
  });

  const { data: ingredientes } = useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: () => api.get('/ingredientes').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newProducto: any) => api.post('/productos', newProducto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      cerrarModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, producto: any }) => api.put(`/productos/${data.id}`, data.producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      cerrarModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/productos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.nombre && values.precio > 0) {
      if (editingId) {
        updateMutation.mutate({ id: editingId, producto: values });
      } else {
        createMutation.mutate(values);
      }
    }
  };

  const abrirModal = (prod?: Producto) => {
    if (prod) {
      setEditingId(prod.id);
      setValues({
        nombre: prod.nombre,
        precio: prod.precio,
        descripcion: prod.descripcion || '',
        categorias_ids: prod.categorias.map(c => c.id),
        ingredientes_ids: prod.ingredientes.map(i => i.id)
      });
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const handleCatChange = (id: number) => {
    const current = values.categorias_ids;
    setFieldValue('categorias_ids', current.includes(id) ? current.filter(c => c !== id) : [...current, id]);
  };

  const handleIngChange = (id: number) => {
    const current = values.ingredientes_ids;
    setFieldValue('ingredientes_ids', current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div className="text-red-500">Error al cargar productos.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button onClick={() => abrirModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos?.map(prod => (
          <div key={prod.id} className="bg-white p-6 rounded shadow-md relative border border-gray-100 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-1">{prod.nombre}</h2>
            <p className="text-2xl font-bold text-blue-600 mb-2">${prod.precio}</p>
            <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">{prod.descripcion || 'Sin descripción'}</p>
            
            <div className="flex gap-2 flex-wrap mb-4 h-16 content-start overflow-hidden">
              {prod.categorias?.map(c => (
                <span key={c.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {c.nombre}
                </span>
              ))}
              {prod.ingredientes?.map(i => (
                <span key={i.id} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {i.nombre}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <Link to={`/detalle/${prod.id}`} className="text-blue-600 hover:underline font-medium">Ver detalle</Link>
              <div className="flex gap-3">
                <button
                  onClick={() => abrirModal(prod)}
                  className="text-gray-500 hover:text-blue-600 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteMutation.mutate(prod.id)}
                  className="text-gray-500 hover:text-red-600 font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        {productos?.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white rounded shadow text-gray-500">
            No hay productos registrados.
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={cerrarModal} 
        title={editingId ? "Editar Producto" : "Nuevo Producto"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={values.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={values.precio}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
            />
          </div>
          
          <div className="flex gap-4 border-t pt-4">
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Categorías</h3>
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                {categorias?.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500"
                      checked={values.categorias_ids.includes(cat.id)} 
                      onChange={() => handleCatChange(cat.id)} 
                    />
                    {cat.nombre}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex-1 border-l pl-4">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Ingredientes</h3>
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                {ingredientes?.map(ing => (
                  <label key={ing.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input 
                      type="checkbox" 
                      className="rounded text-green-600 focus:ring-green-500"
                      checked={values.ingredientes_ids.includes(ing.id)} 
                      onChange={() => handleIngChange(ing.id)} 
                    />
                    {ing.nombre}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button type="button" onClick={cerrarModal} className="px-4 py-2 border rounded hover:bg-gray-50 font-medium">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
