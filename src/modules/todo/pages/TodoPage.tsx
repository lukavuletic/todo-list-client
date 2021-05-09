import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { cloneDeep } from 'lodash';

import { Category } from 'modules/category/components';
import { TodoItem, TodoCreate } from 'modules/todo/components';

import { ITodo } from 'interfaces/todo';

import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from 'graphqlapi';

export const TodoPage: React.FC = () => {
    const { error, loading, data } = useQuery(GET_TODOS);
    const [deleteTodo] = useMutation(DELETE_TODO);
    const [updateTodo] = useMutation(UPDATE_TODO);
    const [isCreateFormShown, setStateToggleCreateFormShown] = useState<boolean>(false);
    const [todos, setStateTodos] = useState<ITodo[]>([]);
    const [categories, setStateCategories] = useState<ITodo['category'][]>([]);
    const [selectedCategories, setStateSelectedCategories] = useState<ITodo['category'][]>([]);

    useEffect(() => {
        if (data) {
            setStateTodos(data.todos);
            const categories: ITodo["category"][] = data.todos.map(({ category }: { category: ITodo["category"] }) => category);
            const uniqueCategories: ITodo['category'][] = [...new Set(categories)];

            setStateCategories([...new Set(categories)]);
            setStateCategories(uniqueCategories);
            setStateSelectedCategories(uniqueCategories);
        }
    }, [data]);

    useEffect(() => {
        const onTodosChange = (): void => {
            const categories: ITodo["category"][] = todos.map(({ category }: { category: ITodo["category"] }) => category);
            const uniqueCategories: ITodo['category'][] = [...new Set(categories)]
            setStateCategories(uniqueCategories);
        }

        onTodosChange();
    }, [todos]);

    const removeTodo = async (id: ITodo['todoID']): Promise<void> => {
        try {
            await deleteTodo({
                variables: {
                    id,
                },
            });
            setStateTodos(todos.filter(({ todoID }) => todoID !== id));
        } catch (err) {
            throw new Error('Item could not be deleted')
        }
    };

    const onTodoItemTaskInputChange = (todoID: number, value: ITodo["task"]): void => {
        const todoItemIdx: number = todos.findIndex((todo: ITodo) => todo.todoID === todoID);
        const todosClone: ITodo[] = cloneDeep(todos);
        todosClone[todoItemIdx].task = value;

        setStateTodos(todosClone);
    };

    const onTodoItemTaskInputSave = async (id: ITodo["todoID"]): Promise<void> => {
        try {
            const todoItem: ITodo = todos.find((todo: ITodo) => todo.todoID === id)!;
            updateTodo({
                variables: {
                    id: todoItem.todoID,
                    task: todoItem.task,
                    category: todoItem.category,
                },
            });
        } catch (err) {
            throw new Error('Failed to update the todo');
        }
    };

    const setSelectedCategory = (category: ITodo["category"]): void => {
        const ctgIdxInSelCtgs: number = selectedCategories.findIndex((c: ITodo["category"]) => category === c);
        if (ctgIdxInSelCtgs === -1) {
            setStateSelectedCategories([...selectedCategories, category]);
        } else {
            setStateSelectedCategories(selectedCategories.filter((c: ITodo["category"]) => c !== category));
        }
    };

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        <div>Oops... something went wrong, please contact the support team</div>
    }

    return (
        <React.Fragment>
            <header>Todo list</header>
            <button type="button" onClick={() => setStateToggleCreateFormShown(!isCreateFormShown)}>
                {isCreateFormShown ? '-' : '+'}
            </button>
            {isCreateFormShown &&
                <TodoCreate
                    state={{ categories, selectedCategories, todos }}
                    actions={{ setStateTodos, setStateSelectedCategories }}
                />
            }
            <br />
            <div className="categories-wrapper">
                {categories.length > 0 && categories.sort((a, b) => a.localeCompare(b))
                    .map((category: string, idx: number) => {
                        return (
                            <div key={idx} className={`category${selectedCategories.includes(category) ? '-selected' : ''}`}>
                                <Category
                                    category={category}
                                    onSelect={setSelectedCategory}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <br />
            <div className="todo-wrapper">
                {todos.length > 0 ? todos.filter((todo: ITodo) => selectedCategories.includes(todo.category))
                    .sort((a, b) => a.category.localeCompare(b.category))
                    .map((todo: ITodo) => {
                        return (
                            <div key={todo.todoID}>
                                <TodoItem
                                    todo={todo}
                                    onDelete={removeTodo}
                                    onTodoItemTaskInputChange={onTodoItemTaskInputChange}
                                    onSave={onTodoItemTaskInputSave}
                                />
                            </div>
                        )
                    })
                    :
                    'No tasks yet created, create one by pressing + button above'
                }
            </div>
        </React.Fragment>
    )
}