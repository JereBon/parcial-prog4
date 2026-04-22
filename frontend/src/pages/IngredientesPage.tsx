import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Ingrediente } from '../api';
import { Modal } from '../components/Modal';
import { useForm } from '../hooks/useForm';

export default function IngredientesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { values, handleChange, reset, setValues } = useForm({
    nombre: ''
  });

  const { data: ingredientes, isLoading, isError } = useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: () => api.get('/ingredientes').then(res => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (newIngrediente: Omit<Ingrediente, 'id'>) => api.post('/ingredientes', newIngrediente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      cerrarModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, ingrediente: Omit<Ingrediente, 'id'> }) => api.put(`/ingredientes/${data.id}`, data.ingrediente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      cerrarModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/ingredientes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.nombre) {
      if (editingId) {
        updateMutation.mutate({ id: editingId, ingrediente: values });
      } else {
        createMutation.mutate(values);
      }
    }
  };

  const abrirModal = (ing?: Ingrediente) => {
    if (ing) {
      setEditingId(ing.id);
      setValues({ nombre: ing.nombre });
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
  if (isError) return <div className="text-red-500">Error al cargar ingredientes.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ingredientes</h1>
        <button onClick={() => abrirModal()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Nuevo Ingrediente
        </button>
      </div>

      <table className="w-full bg-white rounded shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold">ID</th>
            <th className="p-4 text-left font-semibold">Nombre</th>
            <th className="p-4 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes?.map(ing => (
            <tr key={ing.id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-gray-600">{ing.id}</td>
              <td className="p-4 font-medium">{ing.nombre}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => abrirModal(ing)}
                  className="text-blue-500 hover:text-blue-700 mr-4 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteMutation.mutate(ing.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {ingredientes?.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">No hay ingredientes registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={cerrarModal} 
        title={editingId ? "Editar Ingrediente" : "Nuevo Ingrediente"}
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
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={cerrarModal} className="px-4 py-2 border rounded hover:bg-gray-50 font-medium">
              Cancelar
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium shadow" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
