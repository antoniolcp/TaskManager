import React from 'react';

export default function Task({ task, taskNumber, onEdit, onDelete, onComplete }) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg mb-4">
      <h3 className="text-lg font-bold">Task {taskNumber}</h3>
      <h3 className="text-lg font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <p className="text-sm text-green-500">Created on: {task.creationDate}</p>
      <p className="text-sm text-red-500">Deadline: {task.deadline}</p>
      <div className="flex items-center mt-2">
        {task.isComplete ? (
          <> 
          <p className="text-lg font-bold mr-4 text-green-500">Completed</p> 
          <div className="w-4 h-4 bg-green-500"></div> 
          </>
        ) : (
          <>
          <p className="text-lg font-bold mr-4 text-yellow-500">toDo</p>
          <div className="w-4 h-4 bg-yellow-500"></div>
          
          </>
        )}
      </div>
      <div className="mt-2 flex justify-end"> 
        {!task.isComplete && (
          <button className="text-green-600 mr-3" onClick={() => onComplete(task.id)}>Done</button>
        )}
        <button className="text-indigo-600 mr-3" onClick={() => onEdit(task)}>Edit</button>
        <button className="text-red-600 mr-3" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}
