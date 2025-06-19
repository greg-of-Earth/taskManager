import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react"; // useState hook -> allows us to dynamically change data on page. works with [variable, setFunction] pair. and a default initial value
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import our data
import { data } from "@/data/todods";

export default function Index() {
  // useState hook to update/ render changes to list
  // sort the data so first added is on top of list 
  const [todos, setTodos] = useState(data.sort((a,b) => b.id - a.id));

  // useState hook to update/ render new text
  const [text, setText] = useState('')

  // add new tasks (anonymous - no name function)
  const addTodo = () => {
    // if we have text, trim it
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1; // generate a newId (we reversed list so add to first element id value)
      
      // update todos w/ new todo at top, ...todos (spreading) copies all current todos into new array
      setTodos([ { id: newId, title: text, completed: false}, ...todos ]);
      setText('') // reset input text bar
    }
  }

  // toggle task's completed state
  const toggleTodo = (id) => {
    // change the completed state to opposite of what it currently is 
    // map() will loop through tasks, searching for id, when it is found it copy all its values and will change its completed property and return a new array
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed} : todo
    ))
  }

  // delete task
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id)); // filter() will loop through todos and then return new array without the todo with matching id
  } 

  // render task
  const renderItem = ( { item }) => (
    <View style={ styles.todoItem }>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]} 
        onPress={() => toggleTodo(item.id)}> {/* show completed toggle button */}
        
        {item.title} {/* show the tasks title */}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}> {/* delete the task from list */}
      <MaterialCommunityIcons name="delete-circle" size={24} color="red" />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaProvider style={ styles.container }>
      <View style={ styles.inputContainer }>
        {/*Text bar on top to add new tasks*/}
        <TextInput 
          style={ styles.input }
          placeholder="Add a new task"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          />
        {/*Button next to task bar to commit new tasks*/}
        <Pressable
          onPress={addTodo}
          style={ styles.addButton }>
          {/*Text for button*/}
          <Text style={ styles.addButtonText }>Add</Text>
        </Pressable>
      </View>

      {/*Flatlist to show list of tasks*/}
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle = {{ flexGrow: 1}}> {/*if space in parent container, grow to fill as much as possible*/}
      </FlatList>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create ({
  container: {
    flex: 1, // container fills all available space.. (flex is column (vertical axis by default))
    backgroundColor: 'black',
    // justifyContent: "center", // vertical align
    // alignItems: "center", // horizontal align
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    width: '100%',
    maxWidth: 1024, // ipad pro width
    marginHorizontal: 'auto', // if not ipad pro
    pointerEvents: 'auto', // get rid of error messages
  },
  input: {
    flex: 1, 
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5, 
    padding: 10,
    marginRight: 10, 
    fontSize: 18, 
    minWidth: 0, // lets text input shrink for mobile
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    borderRadius: 5, 
    padding: 10,
  },
  addButtonText: {
    fontSize: 18, 
    color: 'black',
  },
  todoItem: {
    flexDirection: 'row', 
    alignItems: 'center', // since row -> centers top to bottom
    justifyContent: 'space-between', // want children left-> right spaced evenly
    gap: 4, 
    padding: 10,
    borderBottomColor: 'gray',
    borderWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto', 
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
})