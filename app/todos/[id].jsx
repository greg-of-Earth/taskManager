import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";

import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from 'react';

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext) 
    const router = useRouter()

    // define loaded and error for fonts hook
    const [loaded, error] = useFonts({
        Inter_500Medium,
    })

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TaskManager")
                const storageTasks = jsonValue != null ? JSON.parse(jsonValue) : null

                if (storageTasks && storageTasks.length) {
                    const myTask = storageTasks.find(todo => todo.id.toString() === id)
                    setTodo(myTask)
                }
            }catch (e) {
                console.error(e)
            }  
        }
        fetchData(id)
    }, [id])

    // make sure we are loaded
    if (!loaded && !error) {
        return null
    }

    const styles = createStyles(colorScheme, theme)

    const handleSave = async () => {
        try {
            const savedTodo = { ...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem("TaskManager")
            const storageTasks = jsonValue != null ? JSON.parse(jsonValue) : null

            if (storageTasks && storageTasks.length) {
                const otherTodos = storageTasks.filter(todo => todo.id !== savedTodo.id) // get all other todos 
                const allTodos = [...otherTodos, savedTodo] // new array with replaced todo and other todos
                await AsyncStorage.setItem("TaskManager", JSON.stringify(allTodos)) // save to storage
            }else {
                await AsyncStorage.setItem("TaskManager", JSON.stringify([savedTodo]))
            }

            router.push('/') // after edit, return to index.jsx
        }catch (e) {
            console.error(e)
        }
        
    }



    return (
        <SafeAreaView style={ styles.container}>
            <View style={ styles.inputContainer}>
                <TextInput 
                    style={ styles.input }
                    maxLength={30}
                    placeholder="Edit Task"
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...todo, title: text}))}/>
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                    style={{ marginLeft: 10}}>
                    {colorScheme === 'dark' ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36}}/>
                    : <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36}}/>}
                </Pressable>
            </View>
            <View style={ styles.inputContainer }>
                <Pressable
                    onPress={handleSave}
                    style={ styles.saveButton }
                >
                    <Text style={ styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')} // cancel edit
                    style={ [styles.saveButton, { backgroundColor: 'red' }] }
                >
                    <Text style={ [styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
        </SafeAreaView>
    )
}

function createStyles(colorScheme, theme) {
    return StyleSheet.create({
        container: {
            flex: 1, 
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6, 
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto'
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
            minWidth: 0,
            color: theme.text,
        },
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        },
    })
}