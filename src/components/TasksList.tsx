import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ItemWrapper } from './ItemWrapper';

export type Task = {
  id: number;
  title: string;
  done: boolean;
  edit?: boolean;
};

export type TaskItem = Task & {
  edit?: boolean;
};

interface TasksListProps {
  tasks: Task[];
  toggleTaskDone: (id: number) => void;
  removeTask: (id: number) => void;
  editTask: (id: number, title: string) => void;
}

const formatTask = (task: Task) => ({ ...task, edit: false });

export function TasksList({
  tasks,
  toggleTaskDone,
  removeTask,
  editTask,
}: TasksListProps) {
  const [taskItems, setTaskItems] = React.useState<TaskItem[]>([]);

  const handleChangeText = React.useCallback(
    (id: number, text: string) => {
      const taskIndex = taskItems.findIndex(item => item.id === id);
      taskItems[taskIndex].title = text;
      setTaskItems([...taskItems]);
    },
    [taskItems],
  );

  const handleEditTask = React.useCallback(
    (id: number) => {
      const taskIndex = taskItems.findIndex(item => item.id === id);
      taskItems[taskIndex].edit = !taskItems[taskIndex].edit;
      setTaskItems([...taskItems]);
    },
    [taskItems],
  );

  const handleConfirmEditTask = React.useCallback(
    (id: number) => {
      const task = taskItems.find(item => item.id === id)!;
      editTask(task.id, task.title);
    },
    [editTask, taskItems],
  );

  const handleCloseEditTask = React.useCallback(
    (id: number) => {
      const taskIndex = taskItems.findIndex(item => item.id === id)!;
      const oldTask = tasks.find(item => item.id === id)!;
      taskItems[taskIndex].edit = false;
      taskItems[taskIndex].title = oldTask.title;
      setTaskItems([...taskItems]);
    },
    [taskItems, tasks],
  );

  React.useEffect(() => {
    setTaskItems(tasks.map(formatTask));
  }, [tasks]);

  return (
    <FlatList
      data={taskItems}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      style={styles.taskList}
      renderItem={({ item, index }) => {
        return (
          <ItemWrapper index={index}>
            <View style={styles.taskContent}>
              <TouchableOpacity
                testID={`button-${index}`}
                activeOpacity={0.7}
                style={styles.taskButton}
                onPress={() => toggleTaskDone(item.id)}>
                <View
                  testID={`marker-${index}`}
                  style={item.done ? styles.taskMarkerDone : styles.taskMarker}>
                  {item.done && <Icon name="check" size={12} color="#FFF" />}
                </View>
              </TouchableOpacity>

              {!item.edit ? (
                <Text style={item.done ? styles.taskTextDone : styles.taskText}>
                  {item.title}
                </Text>
              ) : (
                <TextInput
                  autoFocus={item.edit}
                  autoCorrect={false}
                  editable
                  style={styles.taskInput}
                  placeholderTextColor="#B2B2B2"
                  selectionColor="#666666"
                  numberOfLines={1}
                  returnKeyType="next"
                  value={item.title}
                  onChangeText={(value: string) =>
                    handleChangeText(item.id, value)
                  }
                  onSubmitEditing={() => handleConfirmEditTask(item.id)}
                />
              )}
            </View>

            <View style={styles.taskControls}>
              {item.edit ? (
                <TouchableOpacity
                  testID={`close-${index}`}
                  style={styles.taskControl}
                  onPress={() => handleCloseEditTask(item.id)}>
                  <Icon name="x-circle" size={18} color="#999" />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    testID={`edit-${index}`}
                    style={styles.taskControl}
                    onPress={() => handleEditTask(item.id)}>
                    <Icon name="edit" size={18} color="#999" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    testID={`trash-${index}`}
                    style={styles.taskControl}
                    onPress={() => removeTask(item.id)}>
                    <Icon name="trash-2" size={18} color="#999" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ItemWrapper>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
    marginTop: 32,
  },
  taskButton: {
    paddingRight: 8,
    paddingVertical: 15,
    borderRadius: 4,
  },
  taskMarker: {
    height: 16,
    width: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  taskMarkerDone: {
    height: 16,
    width: 16,
    borderRadius: 4,
    backgroundColor: '#1DB863',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTextDone: {
    color: '#1DB863',
    textDecorationLine: 'line-through',
    fontFamily: 'Inter-Medium',
  },
  taskContent: {
    flex: 0.75,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  taskInput: {
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  taskControls: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 24,
  },
  taskControl: {
    paddingHorizontal: 10,
  },
});
