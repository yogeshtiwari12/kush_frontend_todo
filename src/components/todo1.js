import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.post('http://localhost:3000/kushtodo/fetchalltodo');
        setTodos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch todos');
        setLoading(false);
      }
    };

    fetchTodos();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().slice(0, 10));
    }, 60000); 

    return () => clearInterval(timer);
  }, []);



  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/kushtodo/delete/${id}`);
      setTodos(todos.filter(todo => todo._id !== id)); 
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const sortedTodos = todos.map(todo => ({
    ...todo,
    expired: todo.endDate < currentTime
  }));

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="container mx-auto w-1/2">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Todo List</h1>
        <div className="flex flex-col space-y-6">
          {sortedTodos.map((todo,index) => (
            <div
              key={index}
              className={`bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 ease-in-out hover:scale-105 ${
                todo.expired ? 'border-2 border-red-500' : 'border-2 border-gray-300'
              } hover:border-green-500 hover:bg-green-50`}
            >
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ease-in-out ${
                todo.expired ? 'text-red-500' : 'text-green-500 hover:text-green-600'
              }`}>
                {todo.title}
              </h2>
              <p className="text-gray-700 mb-4">{todo.description}</p>
              <p className="text-gray-500 text-sm">
                Start Date: {new Date(todo.startDate).toLocaleDateString()} <br />
                End Date: {new Date(todo.endDate).toLocaleDateString()}
              </p>
              {todo.expired && (
                <>
                  <p className="text-red-500 font-semibold mt-2">This todo has expired</p>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
          {sortedTodos.length === 0 && (
            <p className="text-center text-gray-600">No todos available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
