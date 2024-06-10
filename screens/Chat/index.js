import { useEffect, useRef, useState } from "react";
import { View, FlatList, TextInput, TouchableOpacity, Text, StyleSheet, ToastAndroid } from "react-native";
import { firebase } from "../../firebase/firebaseConfig"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
function ChatFirebase({ route }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [senderID, setSenderID] = useState(null)
  const [receiverID, setReceiverID] = useState(null)
  const { profile } = route.params
  const flatListRef = useRef(null)
  const navigation = useNavigation()
  const getProfile = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken')
      const response = await axios.get('http://khacngoc.ddns.net:8080/api/getprofile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.status === 200) {
        setSenderID(response.data.id)
        setReceiverID(profile.id)
      }
    }
    catch (error) {
      console.log(error)
      ToastAndroid.show(error, ToastAndroid.SHORT)

    }
  }
  const fetchData = async () => {
    try {
      const messageRef = firebase.firestore().collection('message')
      const query = messageRef.where('senderID', 'in', [senderID, receiverID]).where('receiverID', 'in', [senderID, receiverID]).orderBy('sendAt', 'asc')

      query.onSnapshot((snapshot) => {
        const messageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messageList)
      })


    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const setTitle = () => {
      navigation.setOptions({
        title: profile.fullName
      })

    }
    if (senderID !== null && receiverID !== null) fetchData()
    setTitle()
    getProfile()
  }, [senderID, receiverID])

  const handleSendMessage = async () => {
    // Code to send message
    if (content !== '') {
      const newMessage = {
        content: content.trim(),
        senderID: senderID,
        receiverID: receiverID,
        seen: false,
        sendAt: firebase.firestore.FieldValue.serverTimestamp()
      }
      try {
        setSending(true)
        await firebase.firestore().collection('message').add(newMessage)
        flatListRef.current.scrollToEnd({ animated: true });
        setContent('')

      }
      catch(error) {
        ToastAndroid.show(error, ToastAndroid.SHORT)
      }
      finally{
        setSending(false)
      }
    }

  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={item.senderID === senderID ? styles.userMessage : styles.receiverMessage}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="Nhập tin nhắn..."

        />
        <TouchableOpacity onPress={handleSendMessage} disabled={sending}>
          <FontAwesomeIcon icon={faPaperPlane} color={sending ? 'lightgray' : 'blue'} size={20} />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue',
    padding: 8,
    margin: 4,
    borderRadius: 8,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgray',
    padding: 8,
    margin: 4,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    padding: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});

export default ChatFirebase;
