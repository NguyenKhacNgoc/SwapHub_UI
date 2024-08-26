
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import * as ImagePicker from "expo-image-picker"

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
    marginTop: 10
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
});
function CreatePost() {
  const [selectedImg, setSelectedImg] = useState([])
  const [category, setCategory] = useState('Chọn thể loại')
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //allowsEditing: true, // cho phép chỉnh sửa ảnh sau khi chọn
      aspect: [4, 3], //tỉ lệ khung hình
      quality: 1, //chất lượng ảnh (0 đến 1)
      allowsMultipleSelection: true,

    })
    if (!result.canceled) {
      const maxSelectedImg = [...selectedImg, ...result.assets]
      if (maxSelectedImg.length > 5) {
        Alert.alert('Tối đa 5 ảnh')
        setSelectedImg(maxSelectedImg.slice(0, 5))
      }
      else {
        setSelectedImg(maxSelectedImg)
      }
    }
  }
  const onImgDel = (img) => {
    setSelectedImg(selectedImg.filter((i) => i !== img))
  }
  const handlePost = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken')
    const formData = new FormData()
    selectedImg.forEach((image, index) => {
      formData.append('images', { //đính kèm mỗi hình ảnh vào 1 FormData
        uri: image.uri, //đường dẫn tới hình ảnh trên thiết bị
        name: `image_${index + 1}.jpg`,
        type: 'image/jpg', //Loại của tệp
      })
    })
    formData.append('category', parseInt(category))
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', parseFloat(price))

    try {
      setIsLoading(true)
      const response = await axios.post('http://khacngoc.ddns.net:8080/api/createpost', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      ToastAndroid.show('Thành công', ToastAndroid.SHORT)
      navigation.navigate('MainScreen')


    } catch (error) {
      console.error('Error', error)
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getCategory = async () => {
      try {

        const accessToken = await AsyncStorage.getItem('accessToken')
        const response = await axios.get('http://khacngoc.ddns.net:8080/api/getCategory', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setCategories(response.data)

      }
      catch (error) {
        setCategories([])
      }

    }
    getCategory()




  }, [])


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Thể loại</Text>
        <Picker
          style={styles.input}
          selectedValue={category}
          onValueChange={(itemValue, itemIndex) => {
            setCategory(itemValue);
          }}
        >
          <Picker.Item label="Chọn thể loại" value={null} enabled={false} />
          {categories.map((category) => (
            <Picker.Item label={category.name} value={category.id} key={category.id} />
          ))}
        </Picker>
        <Text style={styles.label}>Hình ảnh</Text>
        <Button title="Chọn ảnh" onPress={pickImage} />
        <View style={styles.imageContainer}>
          {selectedImg.map((img) => (
            <TouchableOpacity
              key={img.uri}
              onPress={() => onImgDel(img)}
              style={styles.imageWrapper}
            >
              <Image
                source={{ uri: img.uri }}
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhấp vào để nhập..."
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          numberOfLines={5}
          placeholder="Nhấp vào để nhập..."
          onChangeText={(text) => setDescription(text)}
        />
        <Text style={styles.label}>Giá bán</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhấp vào để nhập..."
          keyboardType="numeric"
          onChangeText={(text) => setPrice(text)}
        />
        <Button
          title={isLoading ? 'Đang xử lý' : 'Đăng'}
          onPress={handlePost}
          disabled={isLoading}
          style={styles.button}
        />
      </View>
    </ScrollView>

  );
}

export default CreatePost;
