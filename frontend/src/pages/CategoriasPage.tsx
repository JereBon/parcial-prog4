import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Categoria } from '../api';
import { Modal } from '../components/Modal';
import { useForm } from '../hooks/useForm';

export default function CategoriasPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { values, handleChange, reset, setValues } = useForm({
    nombre: '',
    descripcion: ''
  });

  const { data: categorias, isLoading, isError } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: () => api.get('/categorias').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newCategoria: Omit<Categoria, 'id'>) => api.post('/categorias', newCategoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      cerrarModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, categoria: Omit<Categoria, 'id'> }) => api.put(`/categorias/${data.id}`, data.categoria),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      cerrarModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categorias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.nombre) {
      if (editingId) {
        updateMutation.mutate({ id: editingId, categoria: values });
      } else {
        createMutation.mutate(values);
      }
    }
  };

  const abrirModal = (cat?: Categoria) => {
    if (cat) {
      setEditingId(cat.id);
      setValues({ nombre: cat.nombre, descripcion: cat.descripcion || '' });
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

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div className="text-red-500">Error al cargar categorías.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button onClick={() => abrirModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
          Nueva Categoría
        </button>
      </div>

      <table className="w-full bg-white rounded shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold">ID</th>
            <th className="p-4 text-left font-semibold">Nombre</th>
            <th className="p-4 text-left font-semibold">Descripción</th>
            <th className="p-4 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias?.map(cat => (
            <tr key={cat.id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-gray-600">{cat.id}</td>
              <td className="p-4 font-medium">{cat.nombre}</td>
              <td className="p-4 text-gray-600">{cat.descripcion}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => abrirModal(cat)}
                  className="text-blue-500 hover:text-blue-700 mr-4 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteMutation.mutate(cat.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {categorias?.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">No hay categorías registradas.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={cerrarModal} 
        title={editingId ? "Editar Categoría" : "Nueva Categoría"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={values.descripcion}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={cerrarModal} className="px-4 py-2 border rounded hover:bg-gray-50 font-medium">
              Cancelar
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
