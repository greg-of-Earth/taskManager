import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from "react"; // useState hook -> allows us to dynamically change data on page. works with [variable, setFunction] pair. and a default initial value
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import our data
import { data } from "@/data/todos";
//import fonts
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

// import theme context
import { ThemeContext } from '@/context/ThemeContext';

// add animation
import Animated, { LinearTransition } from 'react-native-reanimated';

// import async storage to persist data on app
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  // useState hook to update/ render changes to list
  const [todos, setTodos] = useState([]);
  // useState hook to update/ render new text
  const [text, setText] = useState('')
  // color scheme state
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext) // destructure from useContext inside of ThemeContext
  // use dynamic routing to navigate
  const router = useRouter()

  // useEffect to load data into app
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('TaskManager')
        const storageTasks = jsonValue != null ? JSON.parse(jsonValue) : null // parse jsonValue we retreived

        if (storageTasks && storageTasks.length) {
          setTodos(storageTasks.sort((a,b) => b.id - a.id)) // sort stored data
        } else {
          setTodos(data.sort((a,b) => b.id - a.id)) // no storage tasks (first time app used)
        }
      }catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])


  // save data to storage
  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TaskManager", jsonValue)
      }catch (e) {
        console.error(e)
      }
    }
    storeData()
  }, [todos])

  // define loaded and error for fonts hook
  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  // make sure we are loaded
  if (!loaded && !error) {
    return null
  }

  // call styles function 
  const styles = createStyles(theme, colorScheme)

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

  // handle dynamic navigation
  const handlePress = (id) => {
    router.push(`/todos/${id}`)
  }

  // render task
  // show completed toggle button
  // delete the task from list
  const renderItem = ( { item }) => (
    <View style={ styles.todoItem }>
      <Pressable 
      onPress={() => handlePress(item.id)}
      onLongPress={() => toggleTodo(item.id)}>
        <Text
          style={[styles.todoText, item.completed && styles.completedText]} 
          > 
          {item.title} 
        </Text>
      </Pressable>
      <Pressable 
        onPress={() => removeTodo(item.id)}> 
      <MaterialCommunityIcons name="delete-circle" size={24} color="red" />
      </Pressable>
    </View>
  )

  //*Text bar on top to add new tasks
  //*Button next to task bar to commit new tasks
  //*Text for button
  //*Button to toggle light/dark mode
  return (
    <SafeAreaProvider style={ styles.container }>
      <SafeAreaView>
      <View style={ styles.inputContainer }>
        
        <TextInput 
          style={ styles.input }
          maxLength={30}
          placeholder="Add a new task"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          />
        
        <Pressable
          onPress={addTodo}
          style={ styles.addButton }>
          
          <Text style={ styles.addButtonText }>Add</Text>
        </Pressable>
        
        <Pressable
          onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          style={{ marginLeft: 10}}>
            {colorScheme === 'dark' ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36}}/>
            : <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36}}/>}
          </Pressable>
      </View>

      {/*Flatlist to show list of tasks*/}
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle = {{ flexGrow: 1}} //if space in parent container, grow to fill as much as possible
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag">
      </Animated.FlatList>
      </SafeAreaView>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
    </SafeAreaProvider>
  );
}


function createStyles(theme, colorScheme) {
  return StyleSheet.create ({
    container: {
      flex: 1, // container fills all available space.. (flex is column (vertical axis by default))
      backgroundColor: theme.background,
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
      fontFamily: 'Inter_500Medium',
      minWidth: 0, // lets text input shrink for mobile
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5, 
      padding: 10,
    },
    addButtonText: {
      fontSize: 18, 
      color: colorScheme === 'dark' ? 'black' : 'white',
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
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  })
}