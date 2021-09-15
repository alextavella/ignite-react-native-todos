import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);

  const handleAddTask = React.useCallback((newTaskTitle: string) => {
    const data: Task = {
      id: new Date(Date.now()).getTime(),
      title: newTaskTitle,
      done: false,
    };
    setTasks(state => [...state, data]);
  }, []);

  const handleToggleTaskDone = React.useCallback(
    (id: number) => {
      const taskIndex = tasks.findIndex(item => item.id === id);
      if (taskIndex >= 0) {
        tasks[taskIndex].done = !tasks[taskIndex].done;
        setTasks([...tasks]);
      }
    },
    [tasks],
  );

  const handleRemoveTask = React.useCallback((id: number) => {
    setTasks(state => state.filter(item => item.id !== id));
  }, []);

  const handleEditTask = React.useCallback(
    (id: number, title: string) => {
      const task = tasks.find(item => item.id === id)!;
      task.title = title;
      setTasks([...tasks]);
    },
    [tasks],
  );

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList
        tasks={tasks}
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        editTask={handleEditTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
});
