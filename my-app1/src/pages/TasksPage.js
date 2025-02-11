import React, { useState, useEffect } from 'react';
import Task from '../Task'; 
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',         
    isComplete: false, 
    editingId: null
  });
  const [loading, setLoading] = useState(true); 
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  //Verifica se usuário está logado e carrega as tarefas
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
    loadTasks();
  }, []);

  // Função para carregar as tasks do Firestore para o usuário logado
  const loadTasks = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const tasksRef = collection(db, "users", user.uid, "tasks");
        const q = query(tasksRef, where("userId", "==", user.uid));//retornar todas as tasks em que userId == user.uid
        const queryDocs = await getDocs(q);
        //para cada documento retornado cria um novo objeto
        const loadedTasks = queryDocs.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setTasks(loadedTasks);//atualiza o estado de tasks
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Função para adicionar uma nova tarefa
  const addTask = async () => {
    if (newTask.title && newTask.description && newTask.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (newTask.deadline < today) {
        alert('Deadline cannot be before today.');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to add tasks.');
        return;
      }

      const newTaskToAdd = {
        ...newTask, //copiar as propriedades
        creationDate: today,
        isComplete: false,
        userId: user.uid,
      };

      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'tasks'), newTaskToAdd);//adicionar tarefa ao firestore
        setTasks([...tasks, { ...newTaskToAdd, id: docRef.id }]); //mantem as tarefas ja criadas e adiciona a nova ao firestore
        setNewTask({ title: '', description: '', deadline: '', isComplete: false, editingId: null });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Função para marcar a tarefa como completa
  const markAsComplete = async (taskId) => {
    try {
      const user = auth.currentUser;
      const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await updateDoc(taskDocRef, { isComplete: true });

      // Atualiza o estado local
      setTasks(tasks.map(task => task.id === taskId ? { ...task, isComplete: true } : task));
    } catch (error) {
      console.error('Error updating task to complete:', error);
    }
  };

  // Função para editar uma tarefa
  const editTask = (task) => {
    setNewTask({ ...task, isComplete: false, editingId: task.id });
  };

  // Função para atualizar uma tarefa existente
  const updateTask = async () => {
    if (newTask.title && newTask.description && newTask.deadline) {
      const today = new Date().toISOString().split('T')[0];
      if (newTask.deadline < today) {
        alert('Deadline cannot be before today.');
        return;
      }

      try {
        const taskDocRef = doc(db, 'users', auth.currentUser.uid, 'tasks', newTask.editingId);
        await updateDoc(taskDocRef, {
          title: newTask.title,
          description: newTask.description,
          deadline: newTask.deadline,
          isComplete: newTask.isComplete
        });
        //estado local
        setTasks(tasks.map(task => (task.id === newTask.editingId ? { ...newTask } : task)));
        setNewTask({ title: '', description: '', deadline: '', isComplete: false, editingId: null });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    } else {
      alert('Please fill in all required fields.');
    }
  };

  // Função para deletar uma tarefa
  const deleteTask = async (id) => {
    try {
      //firestore
      const taskDoc = doc(db, 'users', auth.currentUser.uid, 'tasks', id);
      await deleteDoc(taskDoc);
      //local
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/'); 
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="bg-gray-900 justify-center min-h-screen"> 
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-4 text-center">
            <span className="text-green-500">Task</span> 
            <span className="text-red-500"> Manager</span>
          </h1>

          {userEmail && (
            <div className="flex flex-col items-end">
              <p className="text-white mb-2">{userEmail}</p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl text-white font-semibold mb-8 text-center">Add New Task</h2>
          
          <div className="grid grid-cols-1 gap-5 mb-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Title"
              value={newTask.title} 
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Deadline"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          
          <button
            onClick={newTask.editingId ? updateTask : addTask}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            {newTask.editingId ? 'Update Task' : 'Add Task'}
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task, index) => (
            <Task 
              key={task.id} 
              task={task} 
              taskNumber={index + 1}  
              onEdit={editTask} 
              onDelete={deleteTask}
              onComplete={markAsComplete}  // Adiciona a função markAsComplete
            />
          ))}
        </div>
      </div>
    </div>
  );
}
