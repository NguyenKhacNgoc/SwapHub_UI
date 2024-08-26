import { FlatList, Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";

import FooterOnly from "../../layouts/FooterOnly";
import { useCallback } from "react";
import { RefreshControl } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
});


function MainScreen() {
  const navigation = useNavigation()
  const [posts, setPosts] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await getAllPost()
    setRefreshing(false)
  }, [])
  const getAllPost = async() => {
    try {
        
      const response = await axios.get('http://khacngoc.ddns.net:8080/api/getallPost')
      setPosts(response.data.result)


    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    getAllPost()

  }, [])

  return (
    <FooterOnly>
      {posts ? (
        <View>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => { navigation.navigate('DetailProduct', { post: item }) }}
              >
                <Image source={{ uri: item.images[0].secureUrl }} style={[styles.productImage, {overlayColor: 'white'}]}  />
                <Text style={styles.productName}>{item.title}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        </View>
      ) : (
        <View>
          <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Loading...</Text>
        </View>
      )}
    </FooterOnly>
  )
}

export default MainScreen;