import {
    Check,
    ChevronDown,
    EllipsisVertical,
    Pencil,
    Plus,
    Trash,
    X,
} from 'lucide-react';
import './App.css';
import { FormEvent, useRef, useState } from 'react';

function App() {
    type List = {
        id: string;
        check: boolean;
        isEdit: boolean;
        name: string;
        date: string;
    };

    const [filter, setFilter] = useState('all');
    const [name, setName] = useState('');
    const [todolist, setTodolist] = useState<List[]>([]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddTask();
    };

    const onAddTask = () => {
        if (name) {
            const obj = {
                id: crypto.randomUUID(),
                check: false,
                isEdit: false,
                name,
                date: formatDate(new Date()),
            };
            setTodolist((prev) => [...prev, obj]);
            setName('');
        }
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);

        const hours = String(d.getHours()).padStart(2, '0'); // Get hours (00-23)
        const minutes = String(d.getMinutes()).padStart(2, '0'); // Get minutes (00-59)
        const day = String(d.getDate()).padStart(2, '0'); // Get day (01-31)
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month (01-12)
        const year = d.getFullYear(); // Get year

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const handleCheckboxChange = (id: string) => {
        const updatedList = todolist.map((item) =>
            item.id === id ? { ...item, check: !item.check } : item
        );
        setTodolist(updatedList);
    };

    // const handleTaskNameChange = (id: string, value: string) => {
    //     const updatedList = todolist.map((item) =>
    //         item.id === id ? { ...item, name: value } : item
    //     );
    //     setTodolist(updatedList);
    // };

    const handleTaskNameChange = (e: FormEvent, id: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const inputValue = (form.elements[1] as HTMLInputElement).value;

        const updatedList = todolist.map((item) =>
            item.id === id
                ? { ...item, name: inputValue, isEdit: !item.isEdit }
                : item
        );
        setTodolist(updatedList);
    };

    const filteredList = todolist.filter((item: List) => {
        if (filter == 'complete') return item.check;
        if (filter == 'incomplete') return !item.check;
        return true;
    });

    // Explicitly type the ref as HTMLDialogElement
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [selectedTask, setSelectedTask] = useState('');
    const openDialog = (id: string) => {
        setSelectedTask(id);
        dialogRef.current?.showModal(); // Open the dialog
    };

    const closeDialog = () => {
        dialogRef.current?.close(); // Close the dialog
    };

    const onEdit = (id: string) => {
        const updatedList = todolist.map((item) =>
            item.id === id ? { ...item, isEdit: !item.isEdit } : item
        );
        setTodolist(updatedList);
    };
    const onDelete = () => {
        const updatedList = todolist.filter((task) => task.id !== selectedTask);

        setTodolist(updatedList);
        dialogRef.current?.close(); // Close the dialog
    };

    return (
        <>
            <div className='sticky top-0 pt-20 backdrop-blur'>
                <h1>TODOLIST</h1>

                <div className='flex my-4'>
                    <div className='relative flex items-center'>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className='rounded-l-lg w-36'
                        >
                            <option value='all'>All</option>
                            <option value='complete'>Complete</option>
                            <option value='incomplete'>Incomplete</option>
                        </select>
                        <ChevronDown className='w-4 h-4 absolute right-4 pointer-events-none' />
                    </div>
                    <form
                        className='relative flex items-center'
                        onSubmit={onSubmit}
                    >
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type='text'
                            placeholder='Add your task'
                            name='name'
                            className='w-[30rem] pr-8'
                        />
                        {/* <Search
                        className='w-4 h-4 absolute right-4 cursor-pointer'
                        onClick={onSearch}
                    /> */}
                        <button
                            type='submit'
                            className='rounded-r-lg flex items-center'
                        >
                            <Plus className='w-4 h-4 mr-1' /> Add Task
                        </button>
                    </form>
                </div>
            </div>
            <div className='flex flex-col  gap-2 items-center'>
                {filteredList.map((item, index) => (
                    <form
                        onSubmit={(e) => handleTaskNameChange(e, item.id)}
                        key={index}
                        className='flex items-center w-[90%] gap-4 bg-[#2f2f2f] p-5 rounded-lg'
                    >
                        <input
                            type='checkbox'
                            id={`todoItem${index}`}
                            name={`todoItem${index}`}
                            checked={item.check}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        {item.isEdit ? (
                            <input
                                defaultValue={item.name}
                                type='text'
                                placeholder='Add your task'
                                name='name'
                                className='rounded-lg mr-auto'
                            />
                        ) : (
                            <label
                                className={`mr-auto transition-all cursor-pointer ${
                                    item.check ? 'line-through' : ''
                                }`}
                                htmlFor={`todoItem${index}`}
                            >
                                {item.name}
                            </label>
                        )}
                        <div className='flex items-center gap-4'>
                            <small>{item.date}</small>

                            <div className='relative dropdown'>
                                {item.isEdit ? (
                                    <>
                                        <button
                                            type='submit'
                                            color='ghost'
                                            className='text-green-500 p-2 rounded-lg'
                                            // onClick={() =>
                                            //     handleTaskNameChange(item.id)
                                            // }
                                        >
                                            <Check className='w-4 h-4' />
                                        </button>
                                        <button
                                            color='ghost'
                                            className='text-red-500 p-2 rounded-lg'
                                            onClick={() => onEdit(item.id)}
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        color='ghost'
                                        className='dropdown-button'
                                        type='button'
                                    >
                                        <EllipsisVertical className='w-4 h-4' />
                                    </button>
                                )}

                                <ul className='dropdown-menu text-left grid bg-[#1a1a1a] p-3 z-50 rounded-lg gap-2 w-44'>
                                    <li onClick={() => onEdit(item.id)}>
                                        <Pencil className='w-4 h-4 mr-2' />
                                        Edit
                                    </li>
                                    <li
                                        onClick={() => openDialog(item.id)}
                                        className='text-red-500'
                                    >
                                        <Trash className='w-4 h-4 mr-2' />
                                        Delete
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </form>
                ))}
                <dialog
                    ref={dialogRef}
                    className='backdrop:backdrop-blur-xs rounded-xl'
                >
                    <div className='grid gap-6'>
                        <h2 className='text-2xl'>Delete</h2>
                        <p>Do you to delete this task?</p>
                        <div className='flex gap-2 justify-end'>
                            <button
                                onClick={() => closeDialog()}
                                color='ghost'
                                className='p-3 rounded-lg'
                            >
                                Close
                            </button>
                            <button
                                onClick={() => onDelete()}
                                color='danger'
                                className='rounded-lg'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}

export default App;
